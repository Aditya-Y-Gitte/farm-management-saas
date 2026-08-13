# Current Data Model

## 1. Database Context
The backend utilizes Entity Framework Core via `ApplicationDbContext`. 
Currently mapped entities:
- `Livestocks`
- `Dairies`

**Missing Domains:** Auth/Users, Tenants/Farms, Finance (Income/Expense).

## 2. Backend Entities

### Livestock (`backend/Models/Livestock.cs`)
Maps to the DB schema for animal profiles.
- `Id` (Guid, PK)
- `Name` (String, Required)
- `Species` (String, Required)
- `Breed` (String)
- `DateOfBirth` (DateTime)
- `Gender` (String)
- `HealthStatus` (String)
- `Medication` (String)
- `Vaccination` (String)

*Note: There is no `FarmId` or `TenantId` column, meaning all data is global.*

### Dairy (`backend/Models/Dairy.cs`)
Maps to the DB schema for milk production records.
- `Id` (Guid, PK)
- `LivestockId` (Guid, Required) - *Foreign Key (conceptual, no explicit navigation property defined)*
- `Date` (DateTime, Required)
- `MilkYield` (Decimal, Required)
- `FatContent` (Decimal)
- `ProteinContent` (Decimal)
- `Quality` (String)

## 3. Frontend Types (Discrepancies)

The frontend defines models that partially align with the backend but include properties for missing features.

### Livestock (`frontend/src/types/livestock.ts`)
- Contains `id`, `name`, `species`, `breed`, `dateOfBirth`, `gender`, `healthStatus`.
- **Mismatches**: Frontend excludes `Medication` and `Vaccination`.

### Dairy (`frontend/src/types/dairy.ts`)
- Contains `id`, `livestockId`, `date`, `milkYield`, `fatContent`, `proteinContent`, `quality`.
- **Mismatches**: Matches reasonably well, but API integrations fail due to route mismatches.

### Finance (`frontend/src/types/finance.ts`)
- Contains `Income` (id, date, category, amount, quantity, rate, buyerName, notes)
- Contains `Expense` (id, date, category, amount, notes, relatedEntityId)
- **Mismatches**: 100% missing from the backend.

### Auth/User (`frontend/src/auth/AuthContext.tsx`)
- Frontend expects `AuthUser` with `id`, `email`, `displayName`, `avatarUrl`, `tenantId`, `role`.
- **Mismatches**: 100% missing from the backend.
