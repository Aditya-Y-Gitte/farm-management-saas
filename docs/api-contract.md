# API Contract

This document defines the standardized RESTful API contract for the Farm Management SaaS (FMS), aligning the frontend services with the backend .NET Core implementation.

## Global Headers
All authenticated API endpoints must include:
- `Authorization: Bearer <JWT_TOKEN>`

*(Note: The `FarmId` / `TenantId` is extracted securely from the JWT on the backend. It should never be passed in the URL or body for authorization purposes).*

---

## 1. Standard API Error Contract (FMS-103.8)

All errors (4xx, 5xx) must follow the RFC 7807 Problem Details for HTTP APIs standard.

**Example 404 Not Found:**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Not Found",
  "status": 404,
  "detail": "The requested livestock record was not found or does not belong to your farm."
}
```

**Example 400 Bad Request (Validation):**
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Error",
  "status": 400,
  "errors": {
    "TagNumber": ["Tag number is required."],
    "DateOfBirth": ["Date of birth cannot be in the future."]
  }
}
```

---

## 2. Livestock API Contract (FMS-103.1, FMS-103.2)

### Base Path: `/api/livestock`

#### `GET /api/livestock`
- **Purpose**: Get a paginated list of livestock for the farm.
- **Query Params**: `page` (int, default 1), `pageSize` (int, default 20), `status` (string, optional)
- **Response (200 OK)**:
```json
{
  "items": [
    {
      "id": "guid",
      "tagNumber": "COW-001",
      "species": "Cow",
      "status": "Active"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

#### `GET /api/livestock/{id}`
- **Purpose**: Get detailed profile of a specific animal.
- **Response (200 OK)**: Full `Livestock` object.

#### `POST /api/livestock`
- **Purpose**: Add a new animal.
- **Body**: `LivestockCreateDto` (tagNumber, species, gender, status, etc.)
- **Response (201 Created)**: Full created `Livestock` object.

#### `PUT /api/livestock/{id}`
- **Purpose**: Update an animal's details.
- **Body**: `LivestockUpdateDto`
- **Response (200 OK)**: Full updated `Livestock` object.

#### `DELETE /api/livestock/{id}`
- **Purpose**: Delete (or soft delete) an animal.
- **Response (204 No Content)**

---

## 3. Health API Contract (FMS-103.3)

### Base Path: `/api/livestock/{id}/health`

#### `GET /api/livestock/{id}/health`
- **Purpose**: Get all health records for a specific animal.
- **Response (200 OK)**: Array of `HealthRecord` objects.

#### `POST /api/livestock/{id}/health`
- **Purpose**: Add a health record.
- **Body**: `HealthRecordCreateDto`
- **Response (201 Created)**

#### `PUT /api/livestock/{id}/health/{recordId}`
- **Purpose**: Update a health record.

#### `DELETE /api/livestock/{id}/health/{recordId}`
- **Purpose**: Delete a health record.

---

## 4. Breeding API Contract (FMS-103.4)

### Base Path: `/api/livestock/{id}/breeding`

#### `GET /api/livestock/{id}/breeding`
- **Purpose**: Get all breeding cycles for a specific animal.
- **Response (200 OK)**: Array of `BreedingCycle` objects.

#### `POST /api/livestock/{id}/breeding`
- **Purpose**: Add a new breeding cycle event.
- **Body**: `BreedingCycleCreateDto`
- **Response (201 Created)**

#### `PUT /api/livestock/{id}/breeding/{cycleId}`
- **Purpose**: Update a breeding cycle status (e.g. InHeat -> Pregnant).

#### `DELETE /api/livestock/{id}/breeding/{cycleId}`
- **Purpose**: Delete a breeding cycle record.

---

## 5. Dairy API Contract (FMS-103.5)

### Base Path: `/api/dairy`

#### `GET /api/dairy`
- **Purpose**: Get a paginated list of milk production records.
- **Query Params**: `page`, `pageSize`, `startDate`, `endDate`, `livestockId` (optional)
- **Response (200 OK)**: Paginated `DairyRecord` objects.

#### `GET /api/dairy/{id}`
- **Purpose**: Get a specific dairy record.

#### `POST /api/dairy`
- **Purpose**: Log a new milk production record.
- **Body**: `DairyRecordCreateDto` (livestockId, date, session, yieldLiters, etc.)
- **Response (201 Created)**

#### `PUT /api/dairy/{id}`
- **Purpose**: Update a milk production record.

#### `DELETE /api/dairy/{id}`
- **Purpose**: Delete a milk production record.

---

## 6. Dashboard API Contract (FMS-103.6)

### Base Path: `/api/dashboard`

#### `GET /api/dashboard/summary`
- **Purpose**: High-level KPIs for the farm.
- **Response (200 OK)**:
```json
{
  "totalLivestock": 150,
  "milkingCows": 120,
  "todayMilkYield": 2400.5,
  "thisMonthRevenue": 15000.00
}
```

#### `GET /api/dashboard/milk-trend`
- **Purpose**: Time-series data for charting milk production over time.
- **Query Params**: `days` (default 7)
- **Response (200 OK)**:
```json
[
  { "date": "2026-08-10", "totalYield": 2350 },
  { "date": "2026-08-11", "totalYield": 2400 }
]
```

#### `GET /api/dashboard/attention`
- **Purpose**: List of livestock requiring immediate attention.
- **Response (200 OK)**:
```json
[
  { "livestockId": "guid", "tagNumber": "COW-001", "reason": "Due for vaccination" },
  { "livestockId": "guid", "tagNumber": "COW-042", "reason": "Expected calving today" }
]
```

---

## 7. Finance API Contract (FMS-103.7)

### Base Path: `/api/finance`

#### `GET /api/finance/income`
- **Purpose**: Get a paginated list of income records.
- **Response (200 OK)**: Paginated `Income` objects.

#### `POST /api/finance/income`
- **Purpose**: Log income (e.g. Milk Sale, Animal Sale).
- **Body**: `IncomeCreateDto`

#### `GET /api/finance/expense`
- **Purpose**: Get a paginated list of expense records.
- **Response (200 OK)**: Paginated `Expense` objects.

#### `POST /api/finance/expense`
- **Purpose**: Log expense (e.g. Feed, Medicine).
- **Body**: `ExpenseCreateDto`

#### `GET /api/finance/summary`
- **Purpose**: Get aggregated revenue vs expenses over a period.
- **Query Params**: `startDate`, `endDate`
- **Response (200 OK)**:
```json
{
  "totalIncome": 25000,
  "totalExpense": 12000,
  "netProfit": 13000
}
```
