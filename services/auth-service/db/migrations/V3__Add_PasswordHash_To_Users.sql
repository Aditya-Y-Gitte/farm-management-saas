ALTER TABLE "Users" ALTER COLUMN "GoogleId" DROP NOT NULL;
ALTER TABLE "Users" ADD "PasswordHash" character varying(512);
