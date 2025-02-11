import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { bathroomPageTable } from "@/db/schema"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const bathroomPage = await db.select().from(bathroomPageTable).limit(1)
    if (bathroomPage.length > 0) {
      res.status(200).json(bathroomPage[0])
    } else {
      res.status(404).json({ message: "Bathroom page not found" })
    }
  } else if (req.method === "PUT") {
    const { data } = req.body
    await db.update(bathroomPageTable).set({ data })
    res.status(200).json({ message: "Bathroom page updated successfully" })
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

