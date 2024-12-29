import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, username, name, surname, password, confirmPassword } =
      await registerSchema.parseAsync(body);

    if (password !== confirmPassword) {
      return NextResponse.json(
        { field: "password", error: "Passwords don't not match" },
        { status: 401 }
      );
    }
    
    const currentUser = await auth();
    if (currentUser?.user?.id) {
      return NextResponse.redirect(new URL("/memoryApp"));
    }
    const findEmail = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
    });

    if (findEmail) {
      return NextResponse.json(
        { field: "email", error: "Email already registered" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        surname,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ newUser });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: err,
        },
        {
          status: 501,
        }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 501 }
    );
  }
}
