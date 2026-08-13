# Git / PR Remediation Strategy

This document outlines the specific Git and Pull Request actions required to remediate the historical codebase pollution resulting from the discontinued monolithic `backend/` directory.

The overarching strategy is to **avoid blind mass-reverts**. The `backend/` directory is isolated dead code. It does not negatively impact the active microservice runtime in `services/`. Therefore, surgical porting and wholesale directory deletion is safer than complex `git revert` operations.

---

## 1. Unmerged PRs (Case A)

### FMS-201 (Livestock Domain Refactor)
- **Status**: Branch `personal/agitte/FMS-201` is pushed but unmerged.
- **Impact**: It heavily modified the discontinued `backend/` directory, introducing EF configurations, validations, and DTOs against `ApplicationDbContext`.
- **Action**:
  - Do **NOT** merge this PR.
  - Close/abandon the PR on GitHub.
  - The branch will serve as a reference for Case D (reusable logic).

---

## 2. Merged Obsolete Code (Case B)

### Entirety of `backend/` Directory
- **Status**: Merged into `develop` over several months.
- **Impact**: Harmless. The `docker-compose.yml` does not build it, and the `api-gateway` does not route traffic to it. It is simply dead weight in the repository.
- **Action**:
  - Leave it temporarily until porting (Case D) is complete.
  - Create a future cleanup ticket (e.g., FMS-161 or part of a cleanup epic) with the sole objective of executing `git rm -r backend/` and removing it from the solution completely.

---

## 3. Active System Regressions (Case C)

*No merged legacy backend code was found to actively degrade the runtime microservices.*
The frontend configuration (`frontend/src/config/app.config.ts`) and API Gateway configuration correctly point to `services/`. There are no cross-dependencies between `services/` and `backend/`. Therefore, no emergency reverts are necessary.

---

## 4. Reusable Logic to Port (Case D)

Before executing the final deletion of `backend/`, the following valid logic must be extracted and ported into the active microservice architecture:

### A. Localization (Marathi / English)
- **Source**: `backend/Resources/*`, `backend/Controllers/LivestockController.cs` (Commit `8dc032c`, `66db827`)
- **Action**: The `IStringLocalizer` configuration and `.resx` translation files must be ported.
- **Target**: `services/api-gateway` (if handling translation centrally) OR individual microservices (e.g., `services/catalog-api`).

### B. Global Exception Handling
- **Source**: `backend/ExceptionHandlingMiddleware.cs` (Commit `e1c8778`)
- **Action**: The standard RFC 7807 error response wrapper is critical for frontend API clients.
- **Target**: Should be ported to `FarmManagement.SharedKernel` and injected into the pipeline of all active microservices.

### C. FMS-201 Validations & DTOs
- **Source**: `personal/agitte/FMS-201` branch (`backend/DTOs/LivestockDtos.cs`, `backend/Services/LivestockService.cs`)
- **Action**: The TagNumber uniqueness constraints, DateOfBirth validations, and partial-update PUT logic designed in FMS-201 are valid business rules.
- **Target**: Reimplement inside `services/catalog-api` targeting `CatalogDbContext`.
