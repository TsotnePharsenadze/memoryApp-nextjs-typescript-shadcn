import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/schemas";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
    const parsedBody = await passwordSchema.parseAsync(body);

    if (parsedBody.password !== parsedBody.confirmPassword) {
      return NextResponse.json(
        { message: "Passwords don't match" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: currentUser?.user?.id as string,
      },
    });

    const result = await bcrypt.compare(
      parsedBody.currentPassword,
      user?.hashedPassword as string
    );

    if (!result) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(parsedBody.password, 12);

    const newData = await prisma.user.update({
      where: { id: currentUser.user.id },
      data: { hashedPassword },
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
