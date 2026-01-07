/*
  Warnings:

  - You are about to drop the `MovieFeature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieFeature" DROP CONSTRAINT "MovieFeature_movieId_fkey";

-- DropTable
DROP TABLE "MovieFeature";

-- CreateTable
CREATE TABLE "MovieFeatureVector" (
    "movieId" INTEGER NOT NULL,
    "overview" BYTEA,
    "tagline" BYTEA,
    "genres" BYTEA,
    "keywords" BYTEA,
    "cast" BYTEA,
    "director" BYTEA,
    "runtime" BYTEA,
    "voteCount" BYTEA,
    "originalLanguage" BYTEA,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieFeatureVector_pkey" PRIMARY KEY ("movieId")
);

-- AddForeignKey
ALTER TABLE "MovieFeatureVector" ADD CONSTRAINT "MovieFeatureVector_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
