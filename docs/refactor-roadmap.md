# FMS Refactor Roadmap

This document outlines the planned ticket sequence for the Farm Management SaaS refactor.
Tickets within an Epic may have dependencies and should be completed in order unless stated otherwise.
The roadmap reflects intent, not a fixed schedule. Any ticket may be re-prioritized based on review feedback.

---

## Status Legend
- `✅ Done` — PR merged into develop
- `🔄 In Progress` — Branch active, PR open
- `⬜ Planned` — Not yet started
- `🚫 Blocked` — Waiting on a dependency
- `❌ Invalid/Superseded` — Ticket was abandoned due to architecture changes

---

## Architecture Transition Mapping (FMS-158)

The original FMS-201 through FMS-208 tickets were planned against a discontinued monolithic `backend/` directory. They have been explicitly marked as INVALID TARGETS and superseded by microservice-specific tickets.

| Old Ticket | Still valid? | New Service | New Implementation Ticket |
|---|---|---|---|
| FMS-201 Implement Auth | No (Invalid Target) | `auth-service` | FMS-211 Auth Service Domain Refactor |
| FMS-202 Implement Livestock Domain | No (Invalid Target) | `catalog-api` | FMS-212 Catalog API: Livestock Domain Refactor |
| FMS-203 Implement DairyRecord Domain | No (Invalid Target) | `production-api` | FMS-213 Production API: Dairy Domain Refactor |
| FMS-204 Implement HealthRecord Domain | No (Invalid Target) | `catalog-api` | FMS-214 Catalog API: Health Domain Refactor |
| FMS-205 Implement BreedingCycle Domain | No (Invalid Target) | `catalog-api` | FMS-215 Catalog API: Breeding Domain Refactor |
| FMS-206 Implement Finance Domain | No (Invalid Target) | `finance-api` | FMS-216 Finance API: Finance Domain Refactor |
| FMS-207 Implement Dashboard Aggregation | No (Invalid Target) | `api-gateway` | FMS-217 API Gateway: Dashboard Aggregation |
| FMS-208 Database Migrations | No (Invalid Target) | All services | Deferred / Split (Each service handles its own migrations inside its respective FMS-21X ticket) |

---

## EPIC 1 — Discovery, Architecture & Contract Stabilization

Goal: Fully understand the existing system and establish the design contracts before touching any functionality.

| Ticket | Title | Status |
|--------|-------|--------|
| FMS-101 | Repository & Architecture Audit | ✅ Done |
| FMS-102 | Define Target Domain Model | ✅ Done |
| FMS-103 | Define FE/BE API Contract | ✅ Done |
| FMS-104 | Refactor Architecture Documentation | ✅ Done |
| FMS-151 to FMS-160 | Architecture Remediation (Microservice correction) | ✅ Done |

---

## EPIC 2 — Backend Microservice Foundation

Goal: Implement the new domain, multi-tenancy, and API contract directly in the correct active microservices.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-211 | Auth Service Domain Refactor | ⬜ Planned | FMS-160 |
| FMS-212 | Catalog API: Livestock Domain Refactor | ⬜ Planned | FMS-211 |
| FMS-213 | Production API: Dairy Domain Refactor | ⬜ Planned | FMS-211 |
| FMS-214 | Catalog API: Health Domain Refactor | ⬜ Planned | FMS-212 |
| FMS-215 | Catalog API: Breeding Domain Refactor | ⬜ Planned | FMS-212 |
| FMS-216 | Finance API: Finance Domain Refactor | ⬜ Planned | FMS-211 |
| FMS-217 | API Gateway: Dashboard Aggregation | ⬜ Planned | FMS-213, FMS-216 |

---

## EPIC 3 — Frontend Restructure & i18n Foundation

Goal: Migrate the frontend to the feature-based architecture and establish the translation infrastructure before building features.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-301 | Migrate to Feature-Based Architecture | ⬜ Planned | FMS-160 |
| FMS-302 | Implement i18n Namespace Structure (EN + MR) | ⬜ Planned | FMS-301 |
| FMS-303 | Refactor AppShell: Mobile Bottom Nav + Desktop Sidebar | ⬜ Planned | FMS-301 |
| FMS-304 | Implement Shared UI Components (Button, Card, EmptyState, ErrorState, Spinner) | ⬜ Planned | FMS-301 |
| FMS-305 | Update API Service Layer to match api-contract.md | ⬜ Planned | FMS-301 |

---

## EPIC 4 — Authentication & Session

Goal: Replace the incomplete auth stub with a working local-auth flow.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-401 | Implement Login / Register Pages (Local Auth) | ⬜ Planned | FMS-211, FMS-303 |
| FMS-402 | Session Persistence (Refresh Token via Cookie) | ⬜ Planned | FMS-401 |

---

## EPIC 5 — Livestock Feature

Goal: Deliver a fully working Livestock management module (list, add, profile, edit, delete).

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-501 | Livestock List Page | ⬜ Planned | FMS-212, FMS-304 |
| FMS-502 | Add Animal Workflow | ⬜ Planned | FMS-501 |
| FMS-503 | Livestock Profile Page | ⬜ Planned | FMS-501 |
| FMS-504 | Edit & Delete Animal | ⬜ Planned | FMS-503 |

---

## EPIC 6 — Dairy Feature

Goal: Deliver milk production logging and history.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-601 | Dairy List & Log Milk Page | ⬜ Planned | FMS-213, FMS-304 |
| FMS-602 | Dairy Record Detail / Edit | ⬜ Planned | FMS-601 |

---

## EPIC 7 — Health & Breeding

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-701 | Health Record List & Add (within Livestock Profile) | ⬜ Planned | FMS-214, FMS-503 |
| FMS-702 | Breeding Cycle List & Add (within Livestock Profile) | ⬜ Planned | FMS-215, FMS-503 |

---

## EPIC 8 — Dashboard

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-801 | Dashboard Page Refactor (Summary + Milk Trend + Attention) | ⬜ Planned | FMS-217, FMS-304 |

---

## EPIC 9 — Finance

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-901 | Finance Overview Page (Income/Expense List) | ⬜ Planned | FMS-216, FMS-304 |
| FMS-902 | Add Income / Expense Workflow | ⬜ Planned | FMS-901 |
