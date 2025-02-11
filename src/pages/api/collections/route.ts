// File: src/pages/api/collections/route.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from "@/db"
import { collectionsTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const collections = await db.select().from(collectionsTable)
      console.log("Получены коллекции из БД:", JSON.stringify(collections, null, 2))

      if (collections.length === 0) {
        return res.status(200).json([])
      }

      if (!collections[0].data) {
        return res.status(500).json({ message: "Данные коллекций отсутствуют в БД" })
      }
      
      console.log('Отправка данных коллекций клиенту')

      res.status(200).json(collections[0]?.data || [])
    } catch (error) {
      console.error('Ошибка получения коллекций:', error)
      res.status(500).json({ error: 'Ошибка получения коллекций' })
    }
  } else if (req.method === 'POST') {
    try {
      const { data } = req.body
      console.log("Полученные данные для обновления:", JSON.stringify(data, null, 2))

      if (!data) {
        throw new Error("Данные отсутствуют")
      }

      const existing = await db.select().from(collectionsTable)
      console.log("Существующие данные:", JSON.stringify(existing, null, 2))

      if (existing.length === 0) {
        console.log("Создание новой записи")
        await db.insert(collectionsTable).values({
          id: 1,
          data
        })
      } else {
        console.log("Обновление существующей записи")
        await db.update(collectionsTable)
          .set({ data })
          .where(eq(collectionsTable.id, existing[0].id))
      }

      const updatedCollections = await db.select().from(collectionsTable)
      console.log("Обновленные данные в БД:", JSON.stringify(updatedCollections, null, 2))

      res.status(200).json({ success: true, data: updatedCollections[0]?.data || [] })
    } catch (error) {
      console.error('Ошибка обновления коллекций:', error)
      res.status(500).json({ error: 'Ошибка обновления коллекций', details: error instanceof Error ? error.message : 'Неизвестная ошибка' })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}