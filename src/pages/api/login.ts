import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcrypt"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, password } = req.body

  const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1)

  if (user.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  // Here you would typically create a session or JWT token
  // For simplicity, we're just sending a success response
  res.status(200).json({ message: "Login successful" })
}

