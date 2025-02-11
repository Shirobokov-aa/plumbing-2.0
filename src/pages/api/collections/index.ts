// File: src/pages/api/collections/index.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/db/index"
import { collectionsTable } from "@/db/schema"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const collections = await db.select().from(collectionsTable)
      console.log("Получены коллекции из БД:", JSON.stringify(collections, null, 2))
      
      if (collections.length === 0) {
        return res.status(200).json([])
      }
      
      if (!collections[0].data) {
        return res.status(500).json({ message: "Данные коллекций отсутствуют в БД" })
      }
      
      res.status(200).json(collections[0].data)
    } catch (error) {
      console.error('Ошибка получения коллекций:', error)
      res.status(500).json({ message: 'Ошибка получения коллекций', details: error instanceof Error ? error.message : 'Неизвестная ошибка' })
    }
  } else if (req.method === "POST") {
    try {
      const data = req.body // Изменено: убрана деструктуризация
      console.log("Полученные данные:", data) // Добавлено логирование

      if (!data) {
        throw new Error("Данные отсутствуют")
      }

      const newCollection = await db.insert(collectionsTable).values({ id: 1, data }).returning() 
      res.status(201).json(newCollection[0])
    } catch (error) {
      console.error("Ошибка при добавлении коллекции:", error)
      res.status(500).json({ error: "Ошибка при добавлении коллекции", details: error instanceof Error ? error.message : 'Неизвестная ошибка' })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  } 
}
