import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id?: string } }
) {
  const currentUser = await auth();
  const userId = params.id || currentUser?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  const numbers = await prisma.gameStatsNumber.findMany({
    where: { userId },
    select: { createdAt: true, correctAnswers: true },
  });

  const words = await prisma.gameStatsWord.findMany({
    where: { userId },
    select: { createdAt: true, correctAnswers: true },
  });

  const images = await prisma.gameStatsImage.findMany({
    where: { userId },
    select: { createdAt: true, correctAnswers: true },
  });

  const cards = await prisma.gameStatsCard.findMany({
    where: { userId },
    select: { createdAt: true, correctAnswers: true },
  });

  return NextResponse.json({
    numbers: numbers || [],
    words: words || [],
    images: images || [],
    cards: cards || [],
  });
}
