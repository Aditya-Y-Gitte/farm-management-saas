# Microservice API Inventory

This document represents the **actual runtime API inventory** exposed by the microservices located in `services/`.
It completely supersedes any legacy backend API inventory.

All routes are accessed via the API Gateway at `http://localhost:5000` which proxies to the respective microservice.

---

## Auth Service
**Repository:** `services/auth-service`
**Database:** `auth_db`
**Authentication:** None required for login/register/refresh. Bearer JWT required for `/me` and `/logout`.
**Frontend Consumer:** `authService.ts`

| HTTP Method | Route | Request Body | Response | Status |
|---|---|---|---|---|
| `POST` | `/api/auth/google` | `GoogleLoginRequest` | `AuthResponse` (JWT + RefreshToken) | Active |
| `POST` | `/api/auth/register` | `RegisterRequest` | `AuthResponse` (JWT + RefreshToken) | Active |
| `POST` | `/api/auth/login` | `LoginRequest` | `AuthResponse` (JWT + RefreshToken) | Active |
| `POST` | `/api/auth/refresh` | (Cookie: `refreshToken`) | `{ accessToken }` | Active |
| `GET` | `/api/auth/me` | None | `UserDto` | Active |
| `POST` | `/api/auth/logout` | None | `{ message }` | Active |

---

## Catalog API (Livestock Domain)
**Repository:** `services/catalog-api`
**Database:** `catalog_db`
**Authentication:** Bearer JWT required.
**Authorization:** Isolated by tenant (FarmId extracted from JWT).
**Frontend Consumer:** `livestockService.ts`

| HTTP Method | Route | Request Body | Response | Status |
|---|---|---|---|---|
| `GET` | `/api/catalog/livestock` | Query: `?page=1&pageSize=20` | Paginated Livestock List | Active |
| `GET` | `/api/catalog/livestock/{id}` | None | `Livestock` | Active |
| `POST` | `/api/catalog/livestock` | `CreateLivestockRequest` | `Livestock` | Active |
| `PUT` | `/api/catalog/livestock/{id}` | `UpdateLivestockRequest` | `Livestock` | Active |
| `DELETE` | `/api/catalog/livestock/{id}` | None | `204 NoContent` | Active |
| `GET` | `/api/catalog/livestock/count` | None | `{ totalLivestock }` | Active |

---

## Production API (Dairy Domain)
**Repository:** `services/production-api`
**Database:** `production_db`
**Authentication:** Bearer JWT required.
**Authorization:** Isolated by tenant (FarmId extracted from JWT).
**Frontend Consumer:** `dairyService.ts`

| HTTP Method | Route | Request Body | Response | Status |
|---|---|---|---|---|
| `GET` | `/api/production/dairy` | Query: `?page=1&pageSize=20` | Paginated Dairy List | Active |
| `GET` | `/api/production/dairy/{id}` | None | `Dairy` | Active |
| `GET` | `/api/production/dairy/livestock/{livestockId}/date` | Query: `?date={datetime}` | `Dairy` | Active |
| `POST` | `/api/production/dairy` | `CreateDairyRequest` | `Dairy` | Active |
| `PUT` | `/api/production/dairy/{id}` | `UpdateDairyRequest` | `Dairy` | Active |
| `DELETE` | `/api/production/dairy/{id}` | None | `204 NoContent` | Active |
| `GET` | `/api/production/dairy/summary` | None | Dairy Summary Stats | Active |

---

## Finance API
**Repository:** `services/finance-api`
**Database:** `finance_db`
**Authentication:** Bearer JWT required.
**Authorization:** Isolated by tenant (FarmId extracted from JWT).
**Frontend Consumer:** `FinanceService.ts`

| HTTP Method | Route | Request Body | Response | Status |
|---|---|---|---|---|
| `GET` | `/api/finance/income` | Query: `?page=1&pageSize=20` | Paginated Income List | Active |
| `POST` | `/api/finance/income` | `CreateIncomeRequest` | `Income` | Active |
| `GET` | `/api/finance/expense` | Query: `?page=1&pageSize=20` | Paginated Expense List | Active |
| `POST` | `/api/finance/expense` | `CreateExpenseRequest` | `Expense` | Active |
