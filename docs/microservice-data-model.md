# Microservice Data & Database Inventory

This document represents the **actual runtime data model inventory** mapped directly from the active microservices in `services/`.
It completely supersedes any legacy backend DB models.

## Architecture Paradigm

The active system utilizes the **Database-per-Service** pattern.
There is **no shared PostgreSQL schema** and **no shared `ApplicationDbContext`**.
Each microservice owns its data entirely, enforces its own migrations, and connects to an isolated logical PostgreSQL database running in Docker.

Tenant isolation (multi-tenancy) is enforced in every service via Entity Framework Core **Global Query Filters** (`HasQueryFilter(e => e.TenantId == _tenantId)`), extracting the Tenant ID from the JWT claims injected by the API Gateway.

---

## 1. Catalog Service (Livestock Domain)
- **Database Name**: `catalog_db`
- **DbContext**: `CatalogDbContext` (`services/catalog-api/Data/CatalogDbContext.cs`)
- **Tenant Boundary**: `TenantId` (enforced via Global Query Filter in DbContext)

### Entities:
- **`Livestock`** (`services/catalog-api/Models/Livestock.cs`)
  - Table: `Livestocks`
  - Unique Index: `TenantId` + `TagNumber`
- **`HealthRecord`** (`services/catalog-api/Models/HealthRecord.cs`)
  - Table: `HealthRecords`
  - Relationship: Belongs to `Livestock`
- **`BreedingCycle`** (`services/catalog-api/Models/BreedingCycle.cs`)
  - Table: `BreedingCycles`
  - Relationship: Belongs to `Livestock`

---

## 2. Production Service (Dairy Domain)
- **Database Name**: `production_db`
- **DbContext**: `ProductionDbContext` (`services/production-api/Data/ProductionDbContext.cs`)
- **Tenant Boundary**: `TenantId` (enforced via Global Query Filter in DbContext)

### Entities:
- **`Dairy`** (`services/production-api/Models/Dairy.cs`)
  - Table: `Dairies`
  - Unique Index: `TenantId` + `LivestockId` + `Date` + `Session`
  - *Note: `LivestockId` is a soft foreign key. No direct EF navigation property exists to the `Livestock` table since they live in different databases.*
- **`FeedConsumption`** (`services/production-api/Models/FeedConsumption.cs`)
  - Table: `FeedConsumptions`

---

## 3. Finance Service
- **Database Name**: `finance_db`
- **DbContext**: `FinanceDbContext` (`services/finance-api/Data/FinanceDbContext.cs`)
- **Tenant Boundary**: `TenantId` (enforced via Global Query Filter in DbContext)

### Entities:
- **`Income`** (`services/finance-api/Models/Income.cs`)
  - Table: `Incomes`
- **`Expense`** (`services/finance-api/Models/Expense.cs`)
  - Table: `Expenses`

---

## 4. Auth Service
- **Database Name**: `auth_db`
- **DbContext**: `AuthDbContext` (`services/auth-service/Data/AuthDbContext.cs`)
- **Tenant Boundary**: Provisions users. The `TenantId` column in `Users` maps a user to their farm/tenant workspace.

### Entities:
- **`User`** (`services/auth-service/Models/User.cs`)
  - Table: `Users`
  - Unique Indexes: `GoogleId`, `Email`
- **`RefreshToken`** (`services/auth-service/Models/RefreshToken.cs`)
  - Table: `RefreshTokens`
  - Relationship: Belongs to `User` (FK: `UserId`)

---

## Crucial Implementation Differences from Legacy

1. **No ApplicationDbContext**: The old `backend/Data/ApplicationDbContext.cs` is discontinued.
2. **Database-per-service**: Microservices do not execute JOINs across domains. (e.g., `Dairy` records hold a `LivestockId` GUID, but the database cannot enforce foreign key constraints to `catalog_db`).
3. **TenantId vs FarmId**: The actual running code uses `TenantId` across all entities via a shared `BaseEntity`, whereas previous legacy documentation assumed `FarmId`.
