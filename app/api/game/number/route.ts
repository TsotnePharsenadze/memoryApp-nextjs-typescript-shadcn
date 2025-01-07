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
    numbersUserPicked,
    numbersToDisplay,
    currentIndex,
    startTime,
    endTime,
  } = await req.json();

  try {
    const parsedNumbersUserPicked = numbersUserPicked.map(Number);
    const parsedNumbersToDisplay = numbersToDisplay.map(Number);

    const gameStats = await prisma.gameStats.create({
      data: {
        userId: currentUser.user.id,
        correctAnswers,
        incorrectAnswers,
        gameStatus,
        numbersUserPicked: parsedNumbersUserPicked,
        numbersToDisplay: parsedNumbersToDisplay,
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
    return NextResponse.json(
      { message: "Failed to save game stats" },
      { status: 500 }
    );
  }
}
