-- CreateTable
CREATE TABLE "GameStats" (
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

    CONSTRAINT "GameStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameStats" ADD CONSTRAINT "GameStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
