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
    imagesUserPicked,
    imagesToDisplay,
    currentIndex,
    startTime,
    endTime,
  } = await req.json();

  try {
    const parsedCardsUserPicked = imagesUserPicked.map(String);
    const parsedCardsToDisplay = imagesToDisplay.map(String);

    const gameStats = await prisma.gameStatsCard.create({
      data: {
        userId: currentUser.user.id,
        correctAnswers,
        incorrectAnswers,
        gameStatus,
        isCustom,
        CardsUserPicked: parsedCardsUserPicked,
        CardsToDisplay: parsedCardsToDisplay,
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
