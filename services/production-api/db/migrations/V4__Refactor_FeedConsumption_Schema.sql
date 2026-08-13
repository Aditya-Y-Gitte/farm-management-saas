-- Rename QuantityKg to Quantity
ALTER TABLE "FeedConsumptions" RENAME COLUMN "QuantityKg" TO "Quantity";

-- Drop TotalCost
ALTER TABLE "FeedConsumptions" DROP COLUMN "TotalCost";

-- Add Unit and Notes
ALTER TABLE "FeedConsumptions" ADD COLUMN "Unit" VARCHAR(20) DEFAULT 'Kg' NOT NULL;
ALTER TABLE "FeedConsumptions" ADD COLUMN "Notes" TEXT DEFAULT '' NOT NULL;
