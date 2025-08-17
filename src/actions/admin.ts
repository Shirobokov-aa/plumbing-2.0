"use server";

import { db } from "@/db";
import { compare, hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { admins } from "@/db/schema";
import { auth } from "@/lib/auth/auth";

type AdminCreateInput = {
  name: string;
  email: string;
  password: string;
};

export async function createAdmin(data: AdminCreateInput) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized: User not logged in");
  }

  const hashedPassword = await hash(data.password, 10);

  try {
    await db.insert(admins).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to create admin:", error);
    throw new Error("Failed to create admin");
  }
}

export async function getAllAdmins() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized: User not logged in");
  }

  try {
    const adminsList = await db
      .select({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        createdAt: admins.createdAt,
      })
      .from(admins);

    return adminsList;
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    throw new Error("Failed to fetch admins");
  }
}

export async function changePassword(adminId: number, newPassword: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized: User not logged in");
  }

  const hashedPassword = await hash(newPassword, 10);
  try {
    await db
      .update(admins)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, adminId));

    return { success: true };
  } catch (error) {
    console.error("Failed to change password:", error);
    throw new Error("Failed to change password");
  }
}

export async function verifyPassword(adminId: number, oldPassword: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized: User not logged in");
  }

  try {
    const admin = await db.select().from(admins).where(eq(admins.id, adminId)).limit(1);

    if (!admin[0]) {
      throw new Error("Admin not found");
    }

    const isValid = await compare(oldPassword, admin[0].password);

    return { success: isValid };
  } catch (error) {
    console.error("Failed to verify password:", error);
    throw new Error("Failed to verify password");
  }
}
