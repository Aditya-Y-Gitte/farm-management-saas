# Current API Inventory

## 1. Frontend Expected API Consumers

### Auth Service (`/src/services/authService.ts`)
| Method | Endpoint | Purpose | Backend Status |
|--------|----------|---------|----------------|
| POST   | `/api/auth/google` | Google SSO Login | ❌ Missing |
| POST   | `/api/auth/login` | Local Login | ❌ Missing |
| POST   | `/api/auth/register` | User Registration | ❌ Missing |
| POST   | `/api/auth/refresh` | Refresh JWT Token | ❌ Missing |
| GET    | `/api/auth/me` | Get Current User | ❌ Missing |
| POST   | `/api/auth/logout` | Logout | ❌ Missing |

### Livestock Service (`/src/services/livestockService.ts`)
| Method | Expected Endpoint | Actual Backend Endpoint | Backend Status |
|--------|-------------------|-------------------------|----------------|
| GET    | `/api/catalog/livestock` | `/api/v1/Livestock` | ⚠️ Path Mismatch |
| GET    | `/api/catalog/livestock/{id}` | `/api/v1/Livestock/{id}` | ⚠️ Path Mismatch |
| POST   | `/api/catalog/livestock` | `/api/v1/Livestock` | ⚠️ Path Mismatch |
| PUT    | `/api/catalog/livestock/{id}` | `/api/v1/Livestock/{id}` | ⚠️ Path Mismatch |
| DELETE | `/api/catalog/livestock/{id}` | `/api/v1/Livestock/{id}` | ⚠️ Path Mismatch |
| GET    | `/api/catalog/livestock/count` | *None* | ❌ Missing |

### Dairy Service (`/src/services/dairyService.ts`)
| Method | Expected Endpoint | Actual Backend Endpoint | Backend Status |
|--------|-------------------|-------------------------|----------------|
| GET    | `/api/production/dairy` | `/api/v1/Dairy` | ⚠️ Path Mismatch |
| GET    | `/api/production/dairy/{id}`| `/api/v1/Dairy/{id}` | ⚠️ Path Mismatch |
| POST   | `/api/production/dairy` | `/api/v1/Dairy` | ⚠️ Path Mismatch |
| PUT    | `/api/production/dairy/{id}`| `/api/v1/Dairy/{id}` | ⚠️ Path Mismatch |
| DELETE | `/api/production/dairy/{id}`| `/api/v1/Dairy/{id}` | ⚠️ Path Mismatch |
| GET    | `/api/production/dairy/summary` | *None* | ❌ Missing |
| GET    | *None (Not used by FE)* | `/api/v1/Dairy/livestock/{id}/date/{date}` | ❓ Unused by FE |

### Finance Service (`/src/services/FinanceService.ts`)
| Method | Expected Endpoint | Purpose | Backend Status |
|--------|-------------------|---------|----------------|
| GET    | `/api/finance/income` | Get paginated income | ❌ Missing |
| POST   | `/api/finance/income` | Create income record | ❌ Missing |
| GET    | `/api/finance/expense`| Get paginated expense| ❌ Missing |
| POST   | `/api/finance/expense`| Create expense record| ❌ Missing |

## 2. Backend Implemented APIs

### Livestock Controller (`/api/v1/Livestock`)
- `GET /api/v1/Livestock`
- `GET /api/v1/Livestock/{id}`
- `POST /api/v1/Livestock`
- `PUT /api/v1/Livestock/{id}`
- `DELETE /api/v1/Livestock/{id}`

### Dairy Controller (`/api/v1/Dairy`)
- `GET /api/v1/Dairy`
- `GET /api/v1/Dairy/{id}`
- `GET /api/v1/Dairy/livestock/{livestockId}/date/{date}`
- `POST /api/v1/Dairy`
- `PUT /api/v1/Dairy/{id}`
- `DELETE /api/v1/Dairy/{id}`

### System
- `GET /api/v1/health`
