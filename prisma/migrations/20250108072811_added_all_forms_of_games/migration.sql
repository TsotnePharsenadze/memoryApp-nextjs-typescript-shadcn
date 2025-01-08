/*
  Warnings:

  - You are about to drop the `GameStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameStats" DROP CONSTRAINT "GameStats_userId_fkey";

-- DropTable
DROP TABLE "GameStats";

-- CreateTable
CREATE TABLE "GameStatsNumber" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "gameStatus" INTEGER NOT NULL DEFAULT 0,
    "numbersUserPicked" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "numbersToDisplay" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCustom" BOOLEAN NOT NULL,

    CONSTRAINT "GameStatsNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatsWord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "gameStatus" INTEGER NOT NULL DEFAULT 0,
    "wordsUserPicked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "wordsToDisplay" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCustom" BOOLEAN NOT NULL,

    CONSTRAINT "GameStatsWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatsImage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "gameStatus" INTEGER NOT NULL DEFAULT 0,
    "imagesUserPicked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imagesToDisplay" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCustom" BOOLEAN NOT NULL,

    CONSTRAINT "GameStatsImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameStatsCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "gameStatus" INTEGER NOT NULL DEFAULT 0,
    "CardsUserPicked" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "CardsToDisplay" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isCustom" BOOLEAN NOT NULL,

    CONSTRAINT "GameStatsCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameStatsNumber" ADD CONSTRAINT "GameStatsNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatsWord" ADD CONSTRAINT "GameStatsWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatsImage" ADD CONSTRAINT "GameStatsImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameStatsCard" ADD CONSTRAINT "GameStatsCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
