import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { aboutPageTable } from "@/db/schema"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const aboutPage = await db.select().from(aboutPageTable).limit(1)
    if (aboutPage.length > 0) {
      res.status(200).json(aboutPage[0])
    } else {
      res.status(404).json({ message: "About page not found" })
    }
  } else if (req.method === "PUT") {
    const { data } = req.body
    await db.update(aboutPageTable).set({ data })
    res.status(200).json({ message: "About page updated successfully" })
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

