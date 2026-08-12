-- Alter Dairy table
ALTER TABLE "Dairies" ADD COLUMN "Session" VARCHAR(20) DEFAULT 'Morning' NOT NULL;
ALTER TABLE "Dairies" ADD COLUMN "SnfContent" NUMERIC(18,2) DEFAULT 0 NOT NULL;
ALTER TABLE "Dairies" DROP COLUMN "ProteinContent";

-- Drop the old unique index and create a new one that includes Session
DROP INDEX "IX_Dairies_TenantId_LivestockId_Date";
CREATE UNIQUE INDEX "IX_Dairies_TenantId_LivestockId_Date_Session" ON "Dairies" ("TenantId", "LivestockId", "Date", "Session");

-- Create FeedConsumption table
CREATE TABLE "FeedConsumptions" (
    "Id" uuid NOT NULL,
    "TenantId" VARCHAR(200) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "FeedType" VARCHAR(100) NOT NULL,
    "QuantityKg" NUMERIC(18,2) NOT NULL,
    "TotalCost" NUMERIC(18,2) NOT NULL,
    "LivestockId" uuid NULL,
    CONSTRAINT "PK_FeedConsumptions" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_FeedConsumptions_TenantId" ON "FeedConsumptions" ("TenantId");
CREATE INDEX "IX_FeedConsumptions_Date" ON "FeedConsumptions" ("Date");
