import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { collectionsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "GET") {
    const collection = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, Number(id)))
      .limit(1)
    if (collection.length > 0) {
      res.status(200).json(collection[0])
    } else {
      res.status(404).json({ message: "Collection not found" })
    }
  } else if (req.method === "PUT") {
    const { data } = req.body
    await db
      .update(collectionsTable)
      .set({ data })
      .where(eq(collectionsTable.id, Number(id)))
    res.status(200).json({ message: "Collection updated successfully" })
  } else if (req.method === "DELETE") {
    await db.delete(collectionsTable).where(eq(collectionsTable.id, Number(id)))
    res.status(200).json({ message: "Collection deleted successfully" })
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

