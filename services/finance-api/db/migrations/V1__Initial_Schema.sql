CREATE TABLE "Incomes" (
    "Id" uuid NOT NULL,
    "TenantId" VARCHAR(200) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "Amount" NUMERIC(18,2) NOT NULL,
    "Quantity" NUMERIC(18,2) NULL,
    "Rate" NUMERIC(18,2) NULL,
    "BuyerName" VARCHAR(200) DEFAULT '' NOT NULL,
    "Notes" TEXT DEFAULT '' NOT NULL,
    CONSTRAINT "PK_Incomes" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Incomes_TenantId" ON "Incomes" ("TenantId");
CREATE INDEX "IX_Incomes_Date" ON "Incomes" ("Date");

CREATE TABLE "Expenses" (
    "Id" uuid NOT NULL,
    "TenantId" VARCHAR(200) NOT NULL,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Date" TIMESTAMP WITH TIME ZONE NOT NULL,
    "Category" VARCHAR(100) NOT NULL,
    "Amount" NUMERIC(18,2) NOT NULL,
    "Notes" TEXT DEFAULT '' NOT NULL,
    "RelatedEntityId" uuid NULL,
    CONSTRAINT "PK_Expenses" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_Expenses_TenantId" ON "Expenses" ("TenantId");
CREATE INDEX "IX_Expenses_Date" ON "Expenses" ("Date");
