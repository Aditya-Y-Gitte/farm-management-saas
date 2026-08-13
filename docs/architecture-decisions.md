# Architecture Decisions

This document records the significant architectural decisions made during the FMS refactor.
Each entry documents the decision, the rationale, alternatives considered, and implementation impact.

---

## ADR-001 — Feature-Based Frontend Structure

**Decision**: Organize the frontend by feature domain, not by layer (no `components/`, `hooks/`, `utils/` top-level silos).

**Rationale**: As the application grows across Livestock, Dairy, Health, Breeding, Finance, and Feed domains, a layer-based structure forces every new feature to scatter files across many directories. A feature-based structure (`features/livestock/`, `features/dairy/`) keeps all related logic co-located and makes it immediately clear which code belongs to which domain.

**Target Structure**:
```
src/
  features/
    livestock/
      components/      # Livestock-specific components
      pages/           # LivestockListPage, LivestockProfilePage
      services/        # livestockService.ts
      types/           # Livestock, CreateLivestockRequest
    dairy/
    health/
    breeding/
    finance/
    dashboard/
  shared/
    components/        # Reusable UI (Button, Modal, EmptyState, ErrorState)
    hooks/             # useApi, useDebounce
    types/             # PaginatedResponse, ApiError
  auth/
  config/
```

**Alternatives considered**: Layer-based (`/components`, `/hooks`, `/services`) — rejected because cross-cutting concern refactors become painful and it encourages accidental coupling.

**Impact**: All new and refactored code must follow this structure. Existing flat `/pages` and `/components` directories will be migrated as their feature areas are refactored.

---

## ADR-002 — CSS Variable Token Strategy

**Decision**: Use vanilla CSS with a single design-token file (`index.css` / `:root` variables) rather than Tailwind CSS, CSS-in-JS, or CSS Modules.

**Rationale**: The existing codebase is already on vanilla CSS. Re-introducing a utility framework would require a large migration effort with no direct user value. CSS variables provide sufficient theming power and are easily overridable for responsive breakpoints. They also have zero runtime cost.

**Token Namespaces**:
- `--color-*` — semantic color tokens (primary, danger, success, text-*, bg-*)
- `--space-*` — spacing scale (xs, sm, md, lg, xl)
- `--font-*` — typography (size-sm, size-base, size-lg, weight-*)
- `--radius-*` — border radii
- `--shadow-*` — elevation shadows
- `--transition-*` — animation timings

**Alternatives considered**: Tailwind CSS — rejected (major migration, not in requirements). CSS Modules — rejected (adds build complexity, component isolation already achieved by naming convention). Styled-components — rejected (runtime cost, not in tech stack).

**Impact**: All components must use CSS variables, never raw hex values or hardcoded pixel values. Color usage must support light mode by default; future dark mode requires only a variable override on `[data-theme="dark"]`.

---

## ADR-003 — Backend DTO Strategy

**Decision**: All backend API endpoints will use dedicated DTOs (Data Transfer Objects) for input and output. EF Core entities are never serialized or deserialized directly.

**Rationale**: Exposing EF entities directly creates over-posting vulnerabilities, exposes internal IDs and navigation properties, and couples the API contract to the DB schema. DTOs allow the API and domain to evolve independently. FMS-101 identified that the existing `LivestockController` accepts `[FromBody] Livestock` (the raw entity) — this is a security/coupling issue to be resolved.

**Pattern**:
- `LivestockDto` — returned by GET endpoints (safe read model)
- `CreateLivestockDto` — accepted by POST
- `UpdateLivestockDto` — accepted by PUT

**Mapping**: Manual mapping in the Service layer (no AutoMapper for now, to avoid an unnecessary dependency). If mapping boilerplate becomes excessive, revisit.

**Alternatives considered**: AutoMapper — deferred (adds a dependency, generates magic, harder to debug). Record types — acceptable for simple DTOs, to be adopted per domain.

**Impact**: All controllers introduced in EPIC 2 onwards must use DTOs. The `FarmId` must never be accepted in the request body — it must always be extracted from the JWT claim in the controller/service.

---

## ADR-004 — Translation (i18n) Structure

**Decision**: Use `i18next` with namespace-per-domain JSON files loaded via HTTP. The namespaces map 1:1 to the feature domains.

**Supported Languages**: English (`en`), Marathi (`mr`).

**File Layout**:
```
public/
  locales/
    en/
      common.json       # Shared labels, buttons, errors
      navigation.json   # Sidebar nav items
      dashboard.json
      livestock.json
      dairy.json
      health.json
      breeding.json
      finance.json
    mr/
      (same structure)
```

**Rationale**: A single `translation.json` file (the current `i18n.ts` config implies) will become unmanageable across 6+ domains. Namespace-per-domain allows teams to work on translations independently and enables lazy loading of only the namespaces a page needs.

**Rules**:
- No raw strings in JSX. All user-facing text must use `t('namespace:key')`.
- Keys must be semantic (`livestock:addAnimal`, not `livestock:button1`).
- Long Marathi labels must be tested for line wrapping on mobile-sized viewports.

**Alternatives considered**: Single flat file — rejected (unscalable). React-Intl — rejected (heavier API, i18next already installed).

**Impact**: Current `i18n.ts` backend loadPath will be updated to support namespace loading: `/locales/{{lng}}/{{ns}}.json`. All existing string literals in pages will be migrated when their feature area is refactored.

---

## ADR-005 — Mobile Navigation Pattern

**Decision**: Use a **bottom navigation bar** as the primary navigation on mobile (< 768px). The sidebar remains for desktop (≥ 768px). The sidebar will be hidden on mobile via CSS media queries.

**Rationale**: Sidebar navigation, even collapsed, takes up significant horizontal space on mobile. Farmers primarily use phones in the field. A bottom tab bar is the established mobile-native navigation pattern (iOS, Android) and is reachable with one thumb. The current AppShell uses a sidebar with a collapse toggle — this must be adapted to the mobile pattern.

**Tab Items** (enabled modules only, max 5 tabs):
1. Dashboard (Home icon)
2. Livestock
3. Dairy
4. Finance
5. More (overflow for less-used items)

**Alternatives considered**: Hamburger menu (slide-out drawer) — rejected (requires two taps to reach any section). Full-screen overlay menu — rejected (visually disruptive, poor for frequent navigation).

**Impact**: `AppShell.tsx` will be refactored to render a `BottomNav` component on mobile. CSS `@media (max-width: 768px)` will hide the `Sidebar`. Navigation links in `BottomNav` derive from `app.config.ts` enabled modules.

---

## ADR-006 — Domain Ownership & Authorization

**Decision**: All backend domain queries are scoped to a `FarmId` extracted from the authenticated JWT. No user may query or mutate another farm's data. The `FarmId` is never passed in the API request body.

**Rationale**: The FMS-101 audit found that the current backend has no tenant isolation — all data is global. A multi-tenant application requires that every query include a `WHERE FarmId = @farmId` clause derived from the authenticated user's claims, not from client-supplied input.

**Implementation Pattern**:
1. JWT includes a `farmId` claim (set during login).
2. A custom `ICurrentUserService` reads `HttpContext.User.Claims` to provide `FarmId` and `UserId` to services.
3. Every service method receives the `FarmId` from `ICurrentUserService`, never from the DTO.
4. EF Core queries always filter: `.Where(x => x.FarmId == currentUser.FarmId)`.

**Alternatives considered**: Row-level security in PostgreSQL — deferred as it adds DB-level complexity; application-level enforcement is sufficient and more transparent. Passing `farmId` in URL — rejected (can be forged).

**Impact**: All new backend entities include a `FarmId` (Guid) column. All services inject `ICurrentUserService`. All existing controllers will be updated to pass `FarmId` from the current user.

---

## ADR-007 — Dashboard Architecture

**Decision**: The Dashboard is a dedicated, read-only aggregation page served by backend endpoints under `/api/dashboard/`. It does not perform client-side aggregation from multiple endpoints.

**Rationale**: Fetching raw data from multiple APIs and aggregating on the client is wasteful (multiple round trips, large payloads) and produces poor performance on mobile. A single `/api/dashboard/summary` call returns only the computed metrics the farmer needs. This also ensures the backend controls what data is exposed and maintains authorization correctly.

**Dashboard Endpoints** (defined in api-contract.md):
- `GET /api/dashboard/summary` — KPI figures (total livestock, today's milk, monthly revenue)
- `GET /api/dashboard/milk-trend` — time-series for the milk chart
- `GET /api/dashboard/attention` — animals/events requiring action today

**Frontend pattern**: The `DashboardPage` dispatches three parallel requests (`Promise.all`) on mount. Each section handles its own loading/empty/error state independently, so a single failing endpoint does not blank the whole dashboard.

**Alternatives considered**: Client-side aggregation from `/api/livestock`, `/api/dairy` etc. — rejected (expensive, couples dashboard to every domain API). GraphQL — rejected (significant new infrastructure, not in the tech stack).

**Impact**: A `DashboardController` must be implemented on the backend. The current `DashboardPage.tsx` (which appears to have some inline data/charts) will be refactored to use the three dashboard endpoints.
