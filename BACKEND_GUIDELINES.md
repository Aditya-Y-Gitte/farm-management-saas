# Backend Engineering Guidelines

This document outlines the architectural standards and best practices for the Farm Management SaaS backend. All new services and features must adhere to these guidelines to ensure consistency, maintainability, and scalability.

## 1. Microservice Organization

We follow a strict microservice architecture. Each domain owns its data and logic.

- **`catalog-api`**: Core master data (Livestock, Breeds, Health, Breeding).
- **`production-api`**: Daily operational data (Milk Yields, Feed Consumption).
- **`finance-api`**: Financial ledgers (Incomes, Expenses).
- **`auth-service`**: Identity, tenants, and tokens.
- **`api-gateway`**: YARP-based reverse proxy routing traffic to internal services.

### Standard Directory Structure per Service
```text
services/<service-name>/
├── Controllers/      # HTTP boundary layer
├── Services/         # Business logic layer
├── Repositories/     # Data access layer
├── Models/           # Domain Entities (EF Core mapped)
├── DTOs/             # Request/Response objects
├── Data/             # DbContext and Configurations
└── db/migrations/    # Evolve SQL migrations
```

## 2. N-Tier Architecture Rules

Strict layer isolation must be maintained:

- **Controllers (Presentation):** 
  - Must be thin. 
  - Inject `IServices`, **never** `IRepositories` or `DbContext`.
  - Validate HTTP inputs using Data Annotations on DTOs.
  - Return `IActionResult` (e.g., `Ok()`, `BadRequest()`).
- **Services (Business Logic):**
  - Inject `IRepositories`.
  - Enforce business constraints (e.g., uniqueness, validation logic).
  - Handle mapping between Domain Entities and DTOs using **Mapster**.
- **Repositories (Data Access):**
  - Inject `DbContext`.
  - Execute EF Core LINQ queries.
  - **Never** return DTOs; always return Domain Entities or generic aggregates.

## 3. Data Transfer Objects (DTOs) & Mapping

Domain Models (`Models/`) represent the database schema and must **never** be leaked across the HTTP boundary. 

- **Inputs:** Must be suffixed with `Request` (e.g., `CreateLivestockRequest`).
- **Outputs:** Must be suffixed with `Dto` (e.g., `LivestockDto`).
- **Mapping:** We use **Mapster** for object-to-object mapping. Avoid manual mapping (`new Dto { Prop = entity.Prop }`) to keep services clean and reduce boilerplate.

## 4. Database & Evolve Migrations

Each microservice has its own isolated PostgreSQL database. 

- We use **Evolve** for raw SQL migrations.
- Migrations live in `db/migrations/`.
- **Naming Convention:** `V<VersionNumber>__<Action>_<Table>.sql` (e.g., `V1__Initial_Schema.sql`, `V2__Expand_Livestock.sql`).
- **Rule:** Separate logical changes into separate files. Do not modify existing applied migrations; always create a new version.

## 5. Multi-Tenancy & Base Entity

This is a multi-tenant SaaS application. Tenant isolation is mandatory.

- All tenant-specific entities must inherit from `BaseEntity` from `SharedKernel`.
- `BaseEntity` provides `Id`, `TenantId`, `CreatedAt`, and `UpdatedAt`.
- **EF Core Configuration:** 
  - Every entity must have a Global Query Filter in `DbContext`: `modelBuilder.Entity<T>(e => e.HasQueryFilter(x => x.TenantId == _tenantId));`
  - The `TenantId` is extracted from the JWT token via `IHttpContextAccessor`.
  - `CreatedAt` and `UpdatedAt` are stamped automatically in `SaveChanges`.

## 6. API Design Standards

- Use standard RESTful resource naming (e.g., `GET /api/livestock`, `POST /api/livestock`).
- Always return standard HTTP status codes.
- **Pagination:** Any endpoint returning a list must support pagination and return the `PagedResponse<T>` wrapper from `SharedKernel`.

## 7. Authentication & Security

- **API Gateway:** Handles initial routing and acts as the entry point.
- **Internal Services:** Each internal microservice must implement JWT Bearer validation (`AddJwtBearer`). Even though the gateway sits in front, services validate tokens independently for defense-in-depth.
