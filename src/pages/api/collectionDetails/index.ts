import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { sectionsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const sections = await db.select().from(sectionsTable)
      return res.status(200).json(sections)
    }

    if (req.method === "PUT") {
      const { key, data } = req.body
      const updated = await db
        .update(sectionsTable)
        .set({ data })
        .where(eq(sectionsTable.key, key))
        .returning()
      return res.status(200).json(updated[0])
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}