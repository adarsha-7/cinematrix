/*
  Warnings:

  - The primary key for the `OriginCountry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OriginCountry` table. All the data in the column will be lost.
  - The primary key for the `TVShowOriginCountry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `countryId` on the `TVShowOriginCountry` table. All the data in the column will be lost.
  - You are about to drop the `spokenLanguage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `code` to the `OriginCountry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCode` to the `TVShowOriginCountry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MovieSpokenLanguage" DROP CONSTRAINT "MovieSpokenLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "TVShowOriginCountry" DROP CONSTRAINT "TVShowOriginCountry_countryId_fkey";

-- DropForeignKey
ALTER TABLE "TVShowSpokenLanguage" DROP CONSTRAINT "TVShowSpokenLanguage_languageId_fkey";

-- AlterTable
CREATE SEQUENCE creator_id_seq;
ALTER TABLE "Creator" ALTER COLUMN "id" SET DEFAULT nextval('creator_id_seq');
ALTER SEQUENCE creator_id_seq OWNED BY "Creator"."id";

-- AlterTable
CREATE SEQUENCE genre_id_seq;
ALTER TABLE "Genre" ALTER COLUMN "id" SET DEFAULT nextval('genre_id_seq');
ALTER SEQUENCE genre_id_seq OWNED BY "Genre"."id";

-- AlterTable
CREATE SEQUENCE network_id_seq;
ALTER TABLE "Network" ALTER COLUMN "id" SET DEFAULT nextval('network_id_seq');
ALTER SEQUENCE network_id_seq OWNED BY "Network"."id";

-- AlterTable
ALTER TABLE "OriginCountry" DROP CONSTRAINT "OriginCountry_pkey",
DROP COLUMN "id",
ADD COLUMN     "code" TEXT NOT NULL,
ADD CONSTRAINT "OriginCountry_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "adult" DROP NOT NULL;

-- AlterTable
CREATE SEQUENCE productioncompany_id_seq;
ALTER TABLE "ProductionCompany" ALTER COLUMN "id" SET DEFAULT nextval('productioncompany_id_seq');
ALTER SEQUENCE productioncompany_id_seq OWNED BY "ProductionCompany"."id";

-- AlterTable
CREATE SEQUENCE productioncountry_id_seq;
ALTER TABLE "ProductionCountry" ALTER COLUMN "id" SET DEFAULT nextval('productioncountry_id_seq');
ALTER SEQUENCE productioncountry_id_seq OWNED BY "ProductionCountry"."id";

-- AlterTable
ALTER TABLE "TVShowOriginCountry" DROP CONSTRAINT "TVShowOriginCountry_pkey",
DROP COLUMN "countryId",
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD CONSTRAINT "TVShowOriginCountry_pkey" PRIMARY KEY ("tvShowId", "countryCode");

-- DropTable
DROP TABLE "spokenLanguage";

-- CreateTable
CREATE TABLE "SpokenLanguage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpokenLanguage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MovieSpokenLanguage" ADD CONSTRAINT "MovieSpokenLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "SpokenLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVShowSpokenLanguage" ADD CONSTRAINT "TVShowSpokenLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "SpokenLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVShowOriginCountry" ADD CONSTRAINT "TVShowOriginCountry_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "OriginCountry"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
