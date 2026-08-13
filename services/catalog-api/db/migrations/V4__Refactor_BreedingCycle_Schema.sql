-- Refactor BreedingCycles table to align with FMS-215 Breeding Domain model
-- Note: Since there is no existing data, we can rename/drop/add directly.

ALTER TABLE "BreedingCycles" RENAME COLUMN "InseminationDate" TO "BreedingDate";
ALTER TABLE "BreedingCycles" RENAME COLUMN "ExpectedCalvingDate" TO "ExpectedDeliveryDate";
ALTER TABLE "BreedingCycles" RENAME COLUMN "ActualCalvingDate" TO "ActualDeliveryDate";

ALTER TABLE "BreedingCycles" DROP COLUMN "HeatDate";
ALTER TABLE "BreedingCycles" DROP COLUMN "PregnancyCheckDate";
ALTER TABLE "BreedingCycles" DROP COLUMN "IsPregnant";
ALTER TABLE "BreedingCycles" DROP COLUMN "CalfId";

ALTER TABLE "BreedingCycles" ADD COLUMN "Method" VARCHAR(50) DEFAULT '' NOT NULL;
ALTER TABLE "BreedingCycles" ADD COLUMN "Status" VARCHAR(50) DEFAULT '' NOT NULL;
ALTER TABLE "BreedingCycles" ADD COLUMN "Notes" TEXT DEFAULT '' NOT NULL;

-- Update foreign key to RESTRICT (same logic as HealthRecords)
ALTER TABLE "BreedingCycles" DROP CONSTRAINT "FK_BreedingCycles_Livestocks_LivestockId";
ALTER TABLE "BreedingCycles" ADD CONSTRAINT "FK_BreedingCycles_Livestocks_LivestockId" 
    FOREIGN KEY ("LivestockId") REFERENCES "Livestocks" ("Id") ON DELETE RESTRICT;
