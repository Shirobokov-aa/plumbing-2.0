import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { kitchenPageTable } from "@/db/schema"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const kitchenPage = await db.select().from(kitchenPageTable).limit(1)
    if (kitchenPage.length > 0) {
      res.status(200).json(kitchenPage[0])
    } else {
      res.status(404).json({ message: "Kitchen page not found" })
    }
  } else if (req.method === "PUT") {
    const { data } = req.body
    await db.update(kitchenPageTable).set({ data })
    res.status(200).json({ message: "Kitchen page updated successfully" })
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

