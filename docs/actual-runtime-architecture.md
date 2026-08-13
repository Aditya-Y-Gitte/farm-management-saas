# Actual Runtime Architecture

## Overview

The Farm Management SaaS application operates on a **microservice architecture**. 
The repository contains a legacy, discontinued monolithic backend located in the `backend/` directory which is **no longer used in runtime**.

The actual runtime components are deployed via Docker Compose (`docker-compose.yml`) and are located in the `services/` directory.

## Current Source of Truth

The active, deployed backend logic lives entirely within `services/`.
The `backend/` directory is deprecated and does not reflect the running application state.

---

## Service Mapping

Every frontend API call is routed through an API Gateway (YARP) to a specific isolated microservice. 
Each microservice maintains its own dedicated PostgreSQL database.

### 1. API Gateway
- **Repository Path**: `services/api-gateway`
- **Role**: BFF (Backend-For-Frontend) & Reverse Proxy (YARP)
- **Port/Base URL**: `http://localhost:5000`
- **Dependencies**: Forwards requests to auth-service, catalog-api, production-api, and finance-api.

### 2. Auth Service
- **Repository Path**: `services/auth-service`
- **Purpose**: JWT authentication, user registration, and Farm (Tenant) provisioning.
- **Port**: `5003` (Internal Docker Address: `http://auth-service:5003`)
- **Public API Route**: `/api/auth/{**catch-all}`
- **Database**: `auth_db`
- **Status**: Active

### 3. Catalog API (Livestock Domain)
- **Repository Path**: `services/catalog-api`
- **Purpose**: Core entity management (Livestock, Health, Inventory).
- **Port**: `5001` (Internal Docker Address: `http://catalog-api:5001`)
- **Public API Route**: `/api/catalog/{**catch-all}` (e.g., `/api/catalog/livestock`)
- **Database**: `catalog_db`
- **Status**: Active

### 4. Production API (Dairy Domain)
- **Repository Path**: `services/production-api`
- **Purpose**: Milk production logging, dairy analytics.
- **Port**: `5002` (Internal Docker Address: `http://production-api:5002`)
- **Public API Route**: `/api/production/{**catch-all}` (e.g., `/api/production/dairy`)
- **Database**: `production_db`
- **Status**: Active

### 5. Finance API
- **Repository Path**: `services/finance-api`
- **Purpose**: Income, expense, and profitability tracking.
- **Port**: `5004` (Internal Docker Address: `http://finance-api:8080`)
- **Public API Route**: `/api/finance/{**catch-all}`
- **Database**: `finance_db`
- **Status**: Active

---

## Authentication flow

The frontend communicates with `/api/auth` to obtain a JWT. All subsequent requests to `/api/catalog`, `/api/production`, and `/api/finance` include this JWT. The API Gateway validates the JWT (`AuthorizationPolicy: "authenticated"`) before proxying requests to the microservices.

## Frontend API Clients

The frontend (`frontend/src/services/apiClient.ts` and feature services) points directly to the API Gateway:
`REACT_APP_API_URL` defaults to `http://localhost:5000`.

- `livestockService.ts` calls `GET /api/catalog/livestock`
- `dairyService.ts` calls `GET /api/production/dairy`
- `FinanceService.ts` calls `GET /api/finance/income` and `GET /api/finance/expense`

## Explicit Deprecation of `backend/`

The monolithic `backend/` directory is **deprecated and unsupported**.
It is not started by `docker-compose.yml`, its controllers are not reachable via the API Gateway, and its `ApplicationDbContext` is not mapped to any running database containers.

Any previous refactor decisions targeting `backend/` are incorrect and must be migrated or reverted in future remediation tickets.
