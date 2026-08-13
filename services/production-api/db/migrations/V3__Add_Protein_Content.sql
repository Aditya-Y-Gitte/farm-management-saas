-- Add ProteinContent back as nullable
ALTER TABLE "Dairies" ADD COLUMN "ProteinContent" NUMERIC(18,2) NULL;
