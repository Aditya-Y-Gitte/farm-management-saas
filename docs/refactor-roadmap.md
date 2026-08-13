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

---

## EPIC 1 — Discovery, Architecture & Contract Stabilization

Goal: Fully understand the existing system and establish the design contracts before touching any functionality.

| Ticket | Title | Status |
|--------|-------|--------|
| FMS-101 | Repository & Architecture Audit | ✅ Done |
| FMS-102 | Define Target Domain Model | ✅ Done |
| FMS-103 | Define FE/BE API Contract | ✅ Done |
| FMS-104 | Refactor Architecture Documentation | ✅ Done |

---

## EPIC 2 — Backend Foundation

Goal: Implement the new backend domain, authentication, multi-tenancy, and API contract before any frontend work depends on it.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-201 | Implement Auth (Local + JWT + Farm provisioning) | ⬜ Planned | FMS-104 |
| FMS-202 | Implement Livestock Domain (EF Core + DTO + Controller) | ⬜ Planned | FMS-201 |
| FMS-203 | Implement DairyRecord Domain | ⬜ Planned | FMS-202 |
| FMS-204 | Implement HealthRecord Domain | ⬜ Planned | FMS-202 |
| FMS-205 | Implement BreedingCycle Domain | ⬜ Planned | FMS-202 |
| FMS-206 | Implement Finance Domain (Transactions) | ⬜ Planned | FMS-201 |
| FMS-207 | Implement Dashboard Aggregation Endpoints | ⬜ Planned | FMS-203, FMS-206 |
| FMS-208 | Database Migrations | ⬜ Planned | FMS-205, FMS-206 |

---

## EPIC 3 — Frontend Restructure & i18n Foundation

Goal: Migrate the frontend to the feature-based architecture and establish the translation infrastructure before building features.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-301 | Migrate to Feature-Based Architecture | ⬜ Planned | FMS-104 |
| FMS-302 | Implement i18n Namespace Structure (EN + MR) | ⬜ Planned | FMS-301 |
| FMS-303 | Refactor AppShell: Mobile Bottom Nav + Desktop Sidebar | ⬜ Planned | FMS-301 |
| FMS-304 | Implement Shared UI Components (Button, Card, EmptyState, ErrorState, Spinner) | ⬜ Planned | FMS-301 |
| FMS-305 | Update API Service Layer to match api-contract.md | ⬜ Planned | FMS-301 |

---

## EPIC 4 — Authentication & Session

Goal: Replace the incomplete auth stub with a working local-auth flow.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-401 | Implement Login / Register Pages (Local Auth) | ⬜ Planned | FMS-201, FMS-303 |
| FMS-402 | Session Persistence (Refresh Token via Cookie) | ⬜ Planned | FMS-401 |

---

## EPIC 5 — Livestock Feature

Goal: Deliver a fully working Livestock management module (list, add, profile, edit, delete).

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-501 | Livestock List Page | ⬜ Planned | FMS-202, FMS-304 |
| FMS-502 | Add Animal Workflow | ⬜ Planned | FMS-501 |
| FMS-503 | Livestock Profile Page | ⬜ Planned | FMS-501 |
| FMS-504 | Edit & Delete Animal | ⬜ Planned | FMS-503 |

---

## EPIC 6 — Dairy Feature

Goal: Deliver milk production logging and history.

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-601 | Dairy List & Log Milk Page | ⬜ Planned | FMS-203, FMS-304 |
| FMS-602 | Dairy Record Detail / Edit | ⬜ Planned | FMS-601 |

---

## EPIC 7 — Health & Breeding

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-701 | Health Record List & Add (within Livestock Profile) | ⬜ Planned | FMS-204, FMS-503 |
| FMS-702 | Breeding Cycle List & Add (within Livestock Profile) | ⬜ Planned | FMS-205, FMS-503 |

---

## EPIC 8 — Dashboard

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-801 | Dashboard Page Refactor (Summary + Milk Trend + Attention) | ⬜ Planned | FMS-207, FMS-304 |

---

## EPIC 9 — Finance

| Ticket | Title | Status | Depends On |
|--------|-------|--------|-----------|
| FMS-901 | Finance Overview Page (Income/Expense List) | ⬜ Planned | FMS-206, FMS-304 |
| FMS-902 | Add Income / Expense Workflow | ⬜ Planned | FMS-901 |
