import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { loginSchema } from "./schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          if (!credentials.email || !credentials.password) {
            return null;
          }

          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findFirst({
            where: {
              email: email,
            },
          });

          if (!user || !user.hashedPassword) {
            return null;
          }
          console.log(password, user.hashedPassword);
          const comparePasswords = await bcrypt.compare(
            password as string,
            user.hashedPassword as string
          );

          if (!comparePasswords) {
            return null;
          }

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/memoryUp/login" },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
});
