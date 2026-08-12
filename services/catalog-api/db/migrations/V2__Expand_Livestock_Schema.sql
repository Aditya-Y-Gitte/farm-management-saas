-- Expand Livestock table
ALTER TABLE "Livestocks" ADD COLUMN "TagNumber" VARCHAR(50) DEFAULT '' NOT NULL;
ALTER TABLE "Livestocks" ADD COLUMN "Status" VARCHAR(50) DEFAULT '' NOT NULL;
ALTER TABLE "Livestocks" ADD COLUMN "AcquisitionType" VARCHAR(50) DEFAULT '' NOT NULL;
ALTER TABLE "Livestocks" ADD COLUMN "PurchasePrice" NUMERIC(18,2) NULL;
ALTER TABLE "Livestocks" ADD COLUMN "PurchaseDate" TIMESTAMP WITH TIME ZONE NULL;

-- Remove old health fields that are moving to HealthRecord
ALTER TABLE "Livestocks" DROP COLUMN "HealthStatus";
ALTER TABLE "Livestocks" DROP COLUMN "Medication";
ALTER TABLE "Livestocks" DROP COLUMN "Vaccination";

-- Alter DateOfBirth to be nullable
ALTER TABLE "Livestocks" ALTER COLUMN "DateOfBirth" DROP NOT NULL;
-- Alter Name to be nullable/empty by default instead of required unique.
-- First drop the old unique index on Name
DROP INDEX "IX_Livestocks_TenantId_Name";
ALTER TABLE "Livestocks" ALTER COLUMN "Name" DROP NOT NULL;

-- Add new unique index on TagNumber
CREATE UNIQUE INDEX "IX_Livestocks_TenantId_TagNumber" ON "Livestocks" ("TenantId", "TagNumber");

-- Create HealthRecord table
CREATE TABLE "HealthRecords" (
    "Id" uuid NOT NULL,
    "TenantId" VARCHAR(200) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "LivestockId" uuid NOT NULL,
    "Date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "EventType" VARCHAR(100) NOT NULL,
    "DiagnosisOrVaccine" VARCHAR(200) NOT NULL,
    "TreatmentNotes" TEXT NOT NULL,
    "Cost" NUMERIC(18,2) NOT NULL,
    CONSTRAINT "PK_HealthRecords" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_HealthRecords_Livestocks_LivestockId" FOREIGN KEY ("LivestockId") REFERENCES "Livestocks" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_HealthRecords_TenantId" ON "HealthRecords" ("TenantId");
CREATE INDEX "IX_HealthRecords_LivestockId" ON "HealthRecords" ("LivestockId");

-- Create BreedingCycle table
CREATE TABLE "BreedingCycles" (
    "Id" uuid NOT NULL,
    "TenantId" VARCHAR(200) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "LivestockId" uuid NOT NULL,
    "HeatDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "InseminationDate" TIMESTAMP WITH TIME ZONE NULL,
    "PregnancyCheckDate" TIMESTAMP WITH TIME ZONE NULL,
    "IsPregnant" BOOLEAN NULL,
    "ExpectedCalvingDate" TIMESTAMP WITH TIME ZONE NULL,
    "ActualCalvingDate" TIMESTAMP WITH TIME ZONE NULL,
    "CalfId" uuid NULL,
    CONSTRAINT "PK_BreedingCycles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_BreedingCycles_Livestocks_LivestockId" FOREIGN KEY ("LivestockId") REFERENCES "Livestocks" ("Id") ON DELETE CASCADE
);

CREATE INDEX "IX_BreedingCycles_TenantId" ON "BreedingCycles" ("TenantId");
CREATE INDEX "IX_BreedingCycles_LivestockId" ON "BreedingCycles" ("LivestockId");
