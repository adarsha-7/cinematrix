/*
  Warnings:

  - The values [WATCHED] on the enum `InteractionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InteractionType_new" AS ENUM ('CLICK', 'WATCHLIST', 'SEARCH', 'RATED');
ALTER TABLE "UserInteractionMovies" ALTER COLUMN "type" TYPE "InteractionType_new" USING ("type"::text::"InteractionType_new");
ALTER TYPE "InteractionType" RENAME TO "InteractionType_old";
ALTER TYPE "InteractionType_new" RENAME TO "InteractionType";
DROP TYPE "public"."InteractionType_old";
COMMIT;
