import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await auth();
  if (!currentUser?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  const numbers = await prisma.gameStatsNumber.findMany({
    where: { userId: currentUser?.user?.id },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  const words = await prisma.gameStatsWord.findMany({
    where: { userId: currentUser?.user?.id },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  const images = await prisma.gameStatsImage.findMany({
    where: { userId: currentUser?.user?.id },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  const cards = await prisma.gameStatsCard.findMany({
    where: { userId: currentUser?.user?.id },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  return new Response(
    JSON.stringify({
      numbers: numbers || {},
      words: words || {},
      images: images || {},
      cards: cards || {},
    }),
    { status: 200 }
  );
}
