import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { accounDeleteSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await auth();
    if (!currentUser?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized request" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const parsedBody = await accounDeleteSchema.parseAsync(body);

    if (parsedBody.keyword !== "DELETE") {
      return NextResponse.json(
        { message: "Make sure that word is DELETE in uppercase" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.gameStatsCard.deleteMany({
        where: {
          userId: currentUser?.user?.id,
        },
      });
      await prisma.gameStatsImage.deleteMany({
        where: {
          userId: currentUser?.user?.id,
        },
      });
      await prisma.gameStatsNumber.deleteMany({
        where: {
          userId: currentUser?.user?.id,
        },
      });
      await prisma.gameStatsWord.deleteMany({
        where: {
          userId: currentUser?.user?.id,
        },
      });
      await prisma.user.delete({
        where: {
          id: currentUser?.user?.id,
        },
      });

      return true;
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: err instanceof Error ? err.message : err,
      },
      { status: 500 }
    );
  }
}
