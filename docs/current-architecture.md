# Current Architecture Audit

## 1. Overview
The Farm Management SaaS application follows a standard decoupled architecture with a React frontend and a .NET Core web API backend. However, significant structural and functional gaps exist between the two layers.

## 2. Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: `react-router-dom` handling routes like `/dashboard`, `/livestock`, `/dairy`, `/finances`, and `/login`. Uses a `ProtectedRoute` wrapper for authenticated routes.
- **State/Auth**: A custom `AuthContext` handles session state and attempts to use an HTTP-only refresh token mechanism alongside a Bearer JWT.
- **API Client**: Axios-based `apiClient.ts` configured to handle token injection and automated 401 retries.
- **Design/CSS**: Standard CSS (`App.css`, `index.css`) utilizing CSS variables for an "Enterprise" sleek light mode and glassmorphism. It explicitly avoids Tailwind CSS.

## 3. Backend Architecture
- **Framework**: .NET 8 (or 7) Core Web API.
- **Structure**: Layered architecture using Controllers, Services, and Repositories.
- **Database**: PostgreSQL via Entity Framework Core (`ApplicationDbContext`).
- **Configuration**: Uses environment variables and `appsettings.json` for connections. Configured with CORS, Swagger, and API Versioning (v1).

## 4. Key Findings & Disconnects
- **Critical Routing Mismatch**: Frontend expects API routes like `/api/catalog/livestock` and `/api/production/dairy`. However, the backend controllers are decorated with `[Route("api/v{version:apiVersion}/[controller]")]`, making the actual routes `/api/v1/Livestock` and `/api/v1/Dairy`. **As a result, all frontend API calls currently return 404.**
- **Missing Authentication Backend**: The frontend fully implements an auth flow expecting `/api/auth/login`, `/api/auth/google`, `/api/auth/refresh`, and `/api/auth/me`. The backend **does not contain an Auth controller, user models, or any identity framework**.
- **Missing Finance Backend**: The frontend contains pages, types, and API services for `Finance` (Income/Expense). The backend has zero implementation for finance.
- **Multi-Tenancy**: The frontend models expect a `tenantId` in the Auth response, but the backend data models (`Livestock`, `Dairy`) have no tenant or user association, meaning data is globally shared among all users.

## 5. Dead / Unused Code
- **Frontend Finance Service**: Completely unusable due to missing backend.
- **Frontend Auth Service**: Completely unusable due to missing backend.
- **Frontend API Calls**: Effectively dead code at runtime due to the path mismatches (`/api/catalog/...` vs `/api/v1/...`).
