# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Refactored
- **N-Tier Architecture (catalog-api, production-api)**: Promoted both microservices to strict enterprise N-tier architectures.
  - **Presentation Layer**: Extracted domain entities out of the controller boundary. Introduced per-service DTOs (`CreateLivestockRequest`, `UpdateDairyRequest`, etc.) with strict input validation attributes.
  - **Business Logic Layer**: Controllers are now purely routers. Services orchestrate DTO-to-Domain mapping and encapsulate all complex business rules (e.g. enforcing duplicate naming or per-day production limits).
  - **Data Access Layer**: Repositories operate solely on domain entities and return DTO aggregates (e.g. `DairySummaryDto`) without layering violations.
- **Shared Kernel**: Introduced a universal `PagedResponse<T>` generic data contract to standardize paginated list shapes across all microservices.

### Added
- **Indian Farmer DB Schemas**: Expanded backend schemas to accommodate Indian dairy farming use cases:
  - Added `TagNumber`, `Status`, `AcquisitionType`, `PurchasePrice` and `PurchaseDate` to `Livestock`.
  - Created `HealthRecord` to track veterinary checkups, medications, and costs.
  - Created `BreedingCycle` to track heat dates, insemination, pregnancy checks, and calving.
  - Updated `Dairy` to include `Session` (Morning/Evening) and replaced protein metrics with `SnfContent` (Solid-Not-Fat) standard.
  - Created `FeedConsumption` to track individual and herd-level feed usage and costs.
- **Architecture Guidelines**: Codified microservices and N-Tier standards into a root `BACKEND_GUIDELINES.md` to enforce consistency.
- **Finance Ledger (Full Stack)**: Fully implemented the `finance-api` microservice (controllers and services), utilizing Mapster for DTO mapping. On the frontend, created `FinancePage` and `FinanceForm` for creating and viewing Income/Expense transactions.
- **Comprehensive Localization**: Expanded the `i18next` Marathi (`mr`) and English (`en`) dictionaries to provide 100% coverage across Dashboard, Forms, and Finance modules.

### Changed
- **Frontend UI & Glassmorphism**: Overhauled the entire frontend aesthetic with premium glassmorphism styling, responsive layouts, and modernized CSS tokens across `Dashboard`, `LivestockList`, `DairyList`, and auth pages.
- **Centralized Constants**: Refactored `LivestockForm`, `DairyForm`, and `FinanceForm` to consume localized enums from a centralized `appConstants.ts` (tailored for Indian farming semantics) instead of using hardcoded dropdown values.
- **DTO Mapping**: Stripped out manual DTO-to-Entity mappings (`FromEntity()`) across `catalog-api` and `production-api` and adopted **Mapster** (`.Adapt<T>()`) for clean, high-performance object mapping.
- **Frontend Types**: Synchronized frontend Typescript definitions (`types/finance.ts`, `types/dairy.ts`, etc.) to strictly match backend DTO contracts.

### Fixed
- **Docker Compose Builds**: Resolved Mapster typing errors and strict Typescript warnings that were failing container builds in CI/CD environments.

## [0.1.0] - 2026-08-11

### Added
- **Local Authentication**: Added Email/Password authentication support with BCrypt password hashing alongside existing Google OAuth.
- **N-Tier Architecture**: Refactored `auth-service` to strictly adhere to N-Tier Architecture, separating Presentation (Controllers/DTOs), Business Logic (Services), and Data Access (Repositories).
- **Microservices Architecture**: Migrated the legacy monolithic backend into a distributed microservices architecture consisting of:
  - **API Gateway**: YARP-based proxy with rate limiting and metric aggregation.
  - **Auth Service**: Standalone authentication service with Google OAuth 2.0 integration and JWT generation.
  - **Catalog API**: Dedicated microservice for the Livestock domain.
  - **Production API**: Dedicated microservice for the Dairy domain.
  - **Shared Kernel**: Extracted common middleware and entity models into a shared class library.
- **Frontend Authentication**: Implemented `@react-oauth/google` for secure Google Sign-In, coupled with protected route wrappers.
- **Centralized API Client**: Created a robust `apiClient` in the frontend to handle automatic token injection and environment-aware routing.
- **Containerization**: Added `docker-compose.yml` for local multi-container orchestration.
- **Production Build Support**: Included a multi-stage `Dockerfile` and `nginx.conf` for optimized frontend delivery.
- **Documentation**: Added comprehensive `DEPLOYMENT.md` with step-by-step instructions for deploying to free-tier cloud providers (Render, Neon, Netlify).
- **Security Documentation**: Added `SECURITY.md` defining gitignore policies and pre-push checks.

### Changed
- **Database Migrations**: Replaced Entity Framework Migrations (`EnsureCreated`/`Database.Migrate`) with Evolve for explicit, raw SQL-based database migrations across all microservices.
- **Frontend UI**: Refined and polished the dashboard layout and overall styling for a better user experience. Restyled the authentication page to include tabs for "Sign In" and "Create Account".
- **Frontend Layout**: Refactored the main UI shell to securely host protected views and provide an intuitive Sidebar navigation.
- **Service Integration**: Updated `dairyService` and `livestockService` to consume the new `apiClient` rather than relying on direct endpoints.
- **Netlify Configuration**: Updated `netlify.toml` with strict rewrite rules to accurately proxy `/api/*` requests to the remote API Gateway.
- **Database Migrations (Legacy)**: Switched from `EnsureCreated()` to explicit EF Core Migrations (`Database.Migrate()`) across all microservices.

### Fixed
- **Docker Publishing**: Updated `.csproj` files across backend services to correctly include the Evolve database migration scripts (`db/migrations/*.sql`) in the published container output.
- **CORS Configuration**: Removed duplicate `UseCors` middleware from downstream microservices to prevent multiple `Access-Control-Allow-Origin` headers. CORS is now strictly handled at the API Gateway level.
- **Frontend Environment**: Updated local frontend `.env` configuration to correctly route API calls through the API Gateway rather than attempting a direct connection on an incorrect port.
- **TypeScript Compilation**: Fixed generic mapping errors in `DairyList`, `LivestockList`, and `Dashboard` when processing `PaginatedResponse` types from the API.
- **Docker Healthchecks**: Installed `curl` in `.NET 10` ASPNET runtime images (`auth-service`, `catalog-api`, `production-api`, `api-gateway`) to ensure Docker-compose health checks succeed.
- **EF Core Migrations**: Generated the missing `InitialCreate` migration for `auth-service` to prevent startup crashes when evaluating migration history.

### Security
- **Proxy Headers Verification**: Added `ForwardedHeadersMiddleware` to the API Gateway and Auth Service to accurately resolve client IPs behind load balancers for rate limiting and logging.
- **Connection Resiliency**: Configured `MaxPoolSize=50` and increased healthcheck timeouts across databases to avoid resource starvation on free-tier infrastructure.
- **Git Hygiene**: Explicitly ignored all `.env` files, `.user-secrets`, SSL certificates, and sensitive local `appsettings.json` profiles.
- **Credential Safety**: Scrubbed legacy hardcoded development credentials from public-facing codebases, replacing them with instructional placeholders.
