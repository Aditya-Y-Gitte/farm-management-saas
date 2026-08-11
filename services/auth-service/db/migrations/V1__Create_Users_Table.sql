CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "GoogleId" character varying(256) NOT NULL,
    "Email" character varying(256) NOT NULL,
    "DisplayName" character varying(256) NOT NULL,
    "AvatarUrl" character varying(1024) NOT NULL,
    "TenantId" character varying(128) NOT NULL,
    "Role" character varying(50) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "LastLoginAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
CREATE UNIQUE INDEX "IX_Users_GoogleId" ON "Users" ("GoogleId");
CREATE INDEX "IX_Users_TenantId" ON "Users" ("TenantId");
