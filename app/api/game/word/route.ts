import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const currentUser = await auth();
  if (!currentUser?.user?.id) {
    return NextResponse.json(
      {
        message: "Unauthorized request",
      },
      {
        status: 401,
      }
    );
  }

  const {
    correctAnswers,
    incorrectAnswers,
    gameStatus,
    isCustom,
    wordsUserPicked,
    wordsToDisplay,
    currentIndex,
    startTime,
    endTime,
  } = await req.json();

  try {
    const parsedWordsUserPicked = wordsUserPicked.map(String);
    const parsedWordsToDisplay = wordsToDisplay.map(String);

    const gameStats = await prisma.gameStatsWord.create({
      data: {
        userId: currentUser.user.id,
        correctAnswers,
        incorrectAnswers,
        isCustom,
        gameStatus,
        wordsUserPicked: parsedWordsUserPicked,
        wordsToDisplay: parsedWordsToDisplay,
        currentIndex,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json({
      message: "Game stats saved successfully",
      gameStats,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    return NextResponse.json(
      { message: "Failed to save game stats" },
      { status: 500 }
    );
  }
}
