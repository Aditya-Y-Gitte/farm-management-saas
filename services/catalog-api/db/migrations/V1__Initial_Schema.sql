CREATE TABLE "Livestocks" (
    "Id" uuid NOT NULL,
    "Name" character varying(200) NOT NULL,
    "Species" character varying(100) NOT NULL,
    "Breed" character varying(100) NOT NULL,
    "DateOfBirth" timestamp with time zone NOT NULL,
    "Gender" character varying(20) NOT NULL,
    "HealthStatus" character varying(50) NOT NULL,
    "Medication" character varying(500) NOT NULL,
    "Vaccination" character varying(500) NOT NULL,
    "TenantId" character varying(128) NOT NULL,
    "CreatedBy" character varying(128) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Livestocks" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Livestocks_TenantId" ON "Livestocks" ("TenantId");
CREATE UNIQUE INDEX "IX_Livestocks_TenantId_Name" ON "Livestocks" ("TenantId", "Name");
