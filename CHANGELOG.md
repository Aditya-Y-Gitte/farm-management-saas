# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- **Frontend Layout**: Refactored the main UI shell to securely host protected views and provide an intuitive Sidebar navigation.
- **Service Integration**: Updated `dairyService` and `livestockService` to consume the new `apiClient` rather than relying on direct endpoints.
- **Netlify Configuration**: Updated `netlify.toml` with strict rewrite rules to accurately proxy `/api/*` requests to the remote API Gateway.
- **Database Migrations**: Switched from `EnsureCreated()` to explicit EF Core Migrations (`Database.Migrate()`) across all microservices.

### Fixed
- **TypeScript Compilation**: Fixed generic mapping errors in `DairyList`, `LivestockList`, and `Dashboard` when processing `PaginatedResponse` types from the API.
- **Docker Healthchecks**: Installed `curl` in `.NET 10` ASPNET runtime images (`auth-service`, `catalog-api`, `production-api`, `api-gateway`) to ensure Docker-compose health checks succeed.
- **EF Core Migrations**: Generated the missing `InitialCreate` migration for `auth-service` to prevent startup crashes when evaluating migration history.

### Security
- **Proxy Headers Verification**: Added `ForwardedHeadersMiddleware` to the API Gateway and Auth Service to accurately resolve client IPs behind load balancers for rate limiting and logging.
- **Connection Resiliency**: Configured `MaxPoolSize=50` and increased healthcheck timeouts across databases to avoid resource starvation on free-tier infrastructure.
- **Git Hygiene**: Explicitly ignored all `.env` files, `.user-secrets`, SSL certificates, and sensitive local `appsettings.json` profiles.
- **Credential Safety**: Scrubbed legacy hardcoded development credentials from public-facing codebases, replacing them with instructional placeholders.
