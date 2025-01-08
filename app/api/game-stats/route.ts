import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const currentUser = await auth();
  if (!currentUser?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  const groupDataByDate = async (model: any) =>
    await model.findMany({
      where: { userId: currentUser?.user?.id },
      select: {
        createdAt: true,
        correctAnswers: true,
      },
    });

  const numbers = await groupDataByDate(prisma.gameStatsNumber);
  const words = await groupDataByDate(prisma.gameStatsWord);
  const images = await groupDataByDate(prisma.gameStatsImage);
  const cards = await groupDataByDate(prisma.gameStatsCard);

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
