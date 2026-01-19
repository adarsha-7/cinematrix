/*
  Warnings:

  - You are about to drop the `UserInteraction` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "InteractionType" ADD VALUE 'RATED';

-- DropForeignKey
ALTER TABLE "UserInteraction" DROP CONSTRAINT "UserInteraction_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UserInteraction" DROP CONSTRAINT "UserInteraction_tvShowId_fkey";

-- DropForeignKey
ALTER TABLE "UserInteraction" DROP CONSTRAINT "UserInteraction_userId_fkey";

-- DropTable
DROP TABLE "UserInteraction";

-- CreateTable
CREATE TABLE "UserInteractionMovies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER,
    "type" "InteractionType" NOT NULL,
    "value" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInteractionMovies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMovieRecommendations" (
    "userId" TEXT NOT NULL,
    "recommendations" INTEGER[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMovieRecommendations_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserInteractionMovies" ADD CONSTRAINT "UserInteractionMovies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInteractionMovies" ADD CONSTRAINT "UserInteractionMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovieRecommendations" ADD CONSTRAINT "UserMovieRecommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
