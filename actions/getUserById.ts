"use server";

import { prisma } from "@/lib/prisma";

export default async function getUserById(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id,
    },
  });
  return user;
}
