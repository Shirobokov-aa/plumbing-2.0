import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authOptions } from "./auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authOptions,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await db.query.admins.findFirst({
          where: eq(admins.email, email),
        });

        if (!user) return null;

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) return null;

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
});
