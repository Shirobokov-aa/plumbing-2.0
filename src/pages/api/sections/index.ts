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

      // Проверяем существование записи
      const existing = await db
        .select()
        .from(sectionsTable)
        .where(eq(sectionsTable.key, key))
        .limit(1)

      if (existing.length === 0) {
        // Если записи нет, создаем новую
        const inserted = await db
          .insert(sectionsTable)
          .values({
            id: 0, // PostgreSQL проигнорирует это значение для serial/autoincrement
            key,
            data
          })
          .returning()
        return res.status(201).json(inserted[0])
      }

      // Если запись есть, обновляем её
      const updated = await db
        .update(sectionsTable)
        .set({ data })
        .where(eq(sectionsTable.key, key))
        .returning()

      return res.status(200).json(updated[0])
    }

    return res.status(405).json({ message: "Method not allowed" })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}