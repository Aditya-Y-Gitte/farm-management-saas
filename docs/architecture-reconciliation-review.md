# Architecture Reconciliation Review

This document summarizes the findings of the FMS-151 through FMS-158 remediation effort, officially closing the loop on the legacy monolithic backend architecture confusion and establishing the definitive microservice architecture.

---

### 1. What backend does the frontend actually consume?
The frontend strictly consumes the **API Gateway** (`services/api-gateway` running on `http://localhost:5000`). The Gateway securely proxies authenticated REST traffic to four isolated Docker microservices. The frontend **does not** communicate with the monolithic `backend/` directory.

### 2. Which services own each domain?
The architecture utilizes the Database-per-service pattern. Domains are strictly partitioned:
- **Auth & Identity Domain** (Users, Tokens) → `services/auth-service` → `auth_db`
- **Catalog Domain** (Livestock, Health, Breeding) → `services/catalog-api` → `catalog_db`
- **Production Domain** (Dairy, Feed) → `services/production-api` → `production_db`
- **Finance Domain** (Income, Expense) → `services/finance-api` → `finance_db`

### 3. What previous changes were made against the wrong backend?
Several commits and branches incorrectly targeted the discontinued `backend/` directory:
- **FMS-201** branch (`b614e43`): Implemented domain updates, EF configurations, validations, DTOs, and unit tests against the monolithic `ApplicationDbContext`.
- **Historical Commits** (`e1c8778`, `d67b2d4`): Implemented basic monolithic CRUD controllers and repositories.
- **Historical Features** (`8dc032c`, `66db827`, `e1c8778`): Implemented `.resx` Localization and a global Exception Handling Middleware inside the monolith.

### 4. Which changes should remain?
No active code within `backend/` will remain in use. However, the security commit (`658ab98`) that scrubbed hardcoded database passwords from the legacy appsettings remains valid and should not be undone. The `backend/` directory has been cleanly deleted.

### 5. Which changes must be reverted?
**No blind git reverts are required.** 
Because `backend/` is fully isolated and ignored by the `docker-compose.yml` runtime, it causes no regressions. Reverting 6 months of commits would unnecessarily risk git conflicts.
- The unmerged FMS-201 PR will simply be **abandoned/closed**.
- The `backend/` directory will be **deleted** wholesale (`git rm -r backend/`) in a future cleanup ticket.

### 6. Which changes must be reimplemented?
Before the `backend/` is deleted, several valuable features trapped inside must be ported or reimplemented against the active microservices:
1. **FMS-201 Domain Rules**: TagNumber uniqueness, validation logic, and DTO structures must be reimplemented inside `services/catalog-api`.
2. **Exception Handling Middleware**: Must be extracted to a shared library (`FarmManagement.SharedKernel`) and injected into all active microservices to enforce RFC 7807 error responses.
3. **Localization**: The Marathi/English `.resx` logic must be ported to the microservice ecosystem (likely at the API Gateway layer).

### 7. What is the new FMS-201+ roadmap?
The `docs/refactor-roadmap.md` has been rewritten. The old `FMS-201..208` tickets have been marked INVALID. The new roadmap targets the microservices directly:
- **FMS-211**: Auth Service Domain Refactor
- **FMS-212**: Catalog API: Livestock Domain Refactor
- **FMS-213**: Production API: Dairy Domain Refactor
- **FMS-214**: Catalog API: Health Domain Refactor
- **FMS-215**: Catalog API: Breeding Domain Refactor
- **FMS-216**: Finance API: Finance Domain Refactor
- **FMS-217**: API Gateway: Dashboard Aggregation

### 8. Are there any architectural ambiguities still remaining?
**No.** The investigation successfully resolved all discrepancies.
- **Data Ownership**: It is proven that services use isolated databases (no shared schemas).
- **Multi-Tenancy**: It is proven that authorization is bounded by a `TenantId` field inside the JWT, automatically enforced by Entity Framework Global Query Filters across all domains.
- **Cross-Service References**: It is proven that services use "soft" GUID references (e.g., `Dairy.LivestockId`) rather than EF navigation properties, preventing cross-database SQL joins.
