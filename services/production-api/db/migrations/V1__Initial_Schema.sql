CREATE TABLE "Dairies" (
    "Id" uuid NOT NULL,
    "LivestockId" uuid NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "MilkYield" numeric NOT NULL,
    "FatContent" numeric NOT NULL,
    "ProteinContent" numeric NOT NULL,
    "Quality" character varying(50) NOT NULL,
    "TenantId" character varying(128) NOT NULL,
    "CreatedBy" character varying(128) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Dairies" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Dairies_TenantId" ON "Dairies" ("TenantId");
CREATE UNIQUE INDEX "IX_Dairies_TenantId_LivestockId_Date" ON "Dairies" ("TenantId", "LivestockId", "Date");
