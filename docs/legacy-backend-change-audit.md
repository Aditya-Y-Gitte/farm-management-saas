# Legacy Backend Change Audit

This document reviews previous pull requests and commits that incorrectly targeted the discontinued monolithic `backend/` directory instead of the active microservices in `services/`.

The objective is to determine the impact of these changes and classify the necessary remediation action for each.

## Classification Actions
- **KEEP**: The change is valid and in the correct place.
- **PORT**: The logic is valid but needs to be moved to the correct microservice.
- **REIMPLEMENT**: The intent is valid, but the implementation must be redesigned for the microservice architecture.
- **REVERT**: The change is actively harmful and must be undone.
- **DEPRECATE**: The change is invalid/unnecessary and can be safely abandoned or deleted.

---

## Audit Log

| Ticket / Context | PR / Commit | Files Changed | What was implemented | Target backend | Still relevant? | Equivalent microservice | Action |
|---|---|---|---|---|---|---|---|
| **FMS-201** | Branch `FMS-201`<br>Commit `b614e43` | `backend/Models/Livestock.cs`<br>`backend/Data/Configurations/*`<br>`backend/DTOs/*`<br>`backend/Services/*`<br>`backend/Controllers/*`<br>`backend/Migrations/*`<br>`backend.Tests/*` | Refactored the Livestock entity (added TagNumber, Status, etc.), implemented DTOs, rewrote LivestockService and LivestockController, generated an EF Core migration, and wrote xUnit tests. | `backend/` (Invalid) | Yes, the domain model updates are required by the FMS roadmap. | `services/catalog-api` | **REIMPLEMENT** (The domain logic and tests must be rewritten targeting `CatalogDbContext` and `catalog-api`). The `FMS-201` branch should be closed/abandoned as superseded. |
| **Historical** | Commit `658ab98` | `backend/appsettings.json`<br>`backend/appsettings.Development.json` | Scrubbed real DB passwords and removed tracked dev overrides. | `backend/` (Invalid) | No, `backend/` is discontinued. However, it was a security fix. | N/A | **KEEP** (Do not revert the security scrub, but the files themselves are deprecated). |
| **Historical** | Commit `8dc032c`<br>Commit `66db827` | `backend/Controllers/*`<br>`backend/Resources/*`<br>`backend/Program.cs` | Added Marathi language support, `IStringLocalizer`, and resource files (`.resx`) to the monolithic backend controllers. | `backend/` (Invalid) | Yes, localization is a core product feature. | `services/api-gateway` (or individual microservices) | **PORT / REIMPLEMENT** (Determine if localization should be handled at the gateway layer or if `IStringLocalizer` should be implemented in each microservice). |
| **Historical** | Commit `e1c8778` | `backend/ExceptionHandlingMiddleware.cs` | Global exception handling middleware for standardizing API error responses. | `backend/` (Invalid) | Yes, standard RFC 7807 error responses are required across APIs. | All microservices | **PORT** (The middleware logic should be extracted to `FarmManagement.SharedKernel` and applied to all microservices). |
| **Historical** | Commit `e1c8778`<br>Commit `d67b2d4` | `backend/Controllers/*`<br>`backend/Services/*`<br>`backend/Repositories/*` | Original monolithic CRUD implementations for Livestock and Dairy. | `backend/` (Invalid) | No, these have already been superseded by the `catalog-api` and `production-api` microservices. | `catalog-api`, `production-api` | **DEPRECATE** (The code in `backend/` can be safely deleted in a future cleanup ticket). |
| **Historical** | Commit `c619f25` | `backend/Migrations/*` | Initial EF Core migrations for the monolith. | `backend/` (Invalid) | No. The microservices maintain their own migration histories in `services/*/db/migrations`. | N/A | **DEPRECATE** |

---

## Conclusion & Next Steps

1. **FMS-201 MUST NOT BE MERGED** in its current form. It targets the discontinued `backend/`. 
2. The `backend/` directory should be completely deleted in a future cleanup ticket to prevent further confusion, ensuring that all FMS-201+ work strictly targets `services/`.
3. Valuable logic trapped in the monolith (Exception Middleware, `.resx` localization resources) should be ported to the active architecture.
