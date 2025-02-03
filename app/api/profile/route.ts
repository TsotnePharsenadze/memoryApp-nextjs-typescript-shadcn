import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/schemas";
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
    const parsedBody = await profileSchema.parseAsync(body);

    const newData = await prisma.user.update({
      where: { id: currentUser.user.id },
      data: { ...parsedBody },
    });

    return NextResponse.json({ success: true, user: newData });
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
