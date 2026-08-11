CREATE TABLE "RefreshTokens" (
    "Id" uuid NOT NULL,
    "TokenHash" character varying(512) NOT NULL,
    "UserId" uuid NOT NULL,
    "ExpiresAt" timestamp with time zone NOT NULL,
    "IsRevoked" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "ReplacedByTokenId" uuid,
    CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_RefreshTokens_TokenHash" ON "RefreshTokens" ("TokenHash");
CREATE INDEX "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");
