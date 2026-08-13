-- Refactor HealthRecords table to align with FMS-214 Health Domain model
-- Note: Since there is no existing data, we can rename/add/drop columns freely.

ALTER TABLE "HealthRecords" DROP COLUMN "Cost";

ALTER TABLE "HealthRecords" RENAME COLUMN "EventType" TO "Type";
ALTER TABLE "HealthRecords" RENAME COLUMN "DiagnosisOrVaccine" TO "Diagnosis";
ALTER TABLE "HealthRecords" RENAME COLUMN "TreatmentNotes" TO "Treatment";

ALTER TABLE "HealthRecords" ADD COLUMN "Description" VARCHAR(500) DEFAULT '' NOT NULL;
ALTER TABLE "HealthRecords" ADD COLUMN "Medication" VARCHAR(200) DEFAULT '' NOT NULL;
ALTER TABLE "HealthRecords" ADD COLUMN "Veterinarian" VARCHAR(100) DEFAULT '' NOT NULL;
ALTER TABLE "HealthRecords" ADD COLUMN "Notes" TEXT DEFAULT '' NOT NULL;

-- Change foreign key delete behavior from CASCADE to RESTRICT to preserve health history
ALTER TABLE "HealthRecords" DROP CONSTRAINT "FK_HealthRecords_Livestocks_LivestockId";
ALTER TABLE "HealthRecords" ADD CONSTRAINT "FK_HealthRecords_Livestocks_LivestockId" 
    FOREIGN KEY ("LivestockId") REFERENCES "Livestocks" ("Id") ON DELETE RESTRICT;
