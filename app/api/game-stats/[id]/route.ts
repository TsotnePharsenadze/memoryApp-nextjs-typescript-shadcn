import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { useParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const currentUser = await auth();

  const params = useParams();

  const userId = params?.id as string;

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  const numbers = await prisma.gameStatsNumber.findMany({
    where: { userId },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  const words = await prisma.gameStatsWord.findMany({
    where: { userId },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  const images = await prisma.gameStatsImage.findMany({
    where: { userId },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  const cards = await prisma.gameStatsCard.findMany({
    where: { userId },
    select: {
      createdAt: true,
      correctAnswers: true,
    },
  });

  return new Response(
    JSON.stringify({
      numbers: numbers || [],
      words: words || [],
      images: images || [],
      cards: cards || [],
    }),
    { status: 200 }
  );
}
