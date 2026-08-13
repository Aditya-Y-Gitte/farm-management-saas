# Microservice Development Guidelines

These rules dictate how all future backend development, architecture changes, and AI-agent implementation tickets must be executed for the Farm Management SaaS.

---

### Rule 1: The Monolith is Dead
**Frontend must consume the active microservice architecture, never the discontinued backend.**
The `backend/` directory is deprecated. All frontend requests must be routed through the API Gateway (`services/api-gateway`) to the active microservices (`services/*`). Do not add new functionality, migrations, or endpoints to the `backend/` directory.

### Rule 2: Service Boundaries
**Every new API must belong to the appropriate service.**
Do not put unrelated business domains into one legacy controller. Features must be implemented within their explicit domain context:
- Livestock tracking → `services/catalog-api`
- Dairy production → `services/production-api`
- Crop management → (Future dedicated service)
- Income/Expenses → `services/finance-api`
- Authentication/Users → `services/auth-service`

### Rule 3: Database Ownership
**Each service owns its data access.**
A microservice must have its own dedicated `DbContext` and isolated logical database (e.g., `catalog_db`, `production_db`). There is no monolithic `ApplicationDbContext`.

### Rule 4: No Cross-Service Database Access
**Do not create cross-service database access.**
A microservice (e.g., `production-api`) must never establish an Entity Framework connection to another microservice's database (e.g., `catalog_db`). They do not share schemas, and they do not execute SQL `JOIN`s across domains.

### Rule 5: Frontend Direct Access
**Frontend does not directly access another service's database.**
The frontend application only communicates with microservices via their exposed HTTP REST APIs routed through the API Gateway. It must never interact directly with any database layer.

### Rule 6: Cross-Service Communication
**Cross-service communication must use the established architecture.**
Do not invent REST/event/messaging patterns without inspecting the existing implementation. Use the current patterns available in the repository.

### Rule 7: Authentication and Authorization
**Authentication/authorization must follow the current microservice security architecture.**
Every microservice (except `auth-service` login/register routes) must validate the Bearer JWT token provided by the API Gateway. Multi-tenancy isolation must be enforced via the `TenantId` extracted from the JWT claims using EF Core Global Query Filters (`HasQueryFilter`).

### Rule 8: API Contracts
**DTO/API contracts must be defined at the service boundary.**
Microservices must not expose their raw Entity Framework models (e.g., `Livestock.cs`) to the frontend. All data must be mapped to specific Data Transfer Objects (DTOs) representing the exact API contract for that endpoint (e.g., `LivestockDto`, `CreateLivestockRequest`).
