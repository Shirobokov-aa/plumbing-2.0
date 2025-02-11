import { db } from "./index"
import { collections, type NewCollection, type Collection } from "./schema"
import { eq } from "drizzle-orm"

export async function createCollection(data: NewCollection): Promise<Collection> {
  const [insertedCollection] = await db.insert(collections).values(data).returning()
  return insertedCollection
}

export async function updateCollection(id: number, data: Partial<NewCollection>): Promise<Collection | null> {
  const [updatedCollection] = await db.update(collections).set(data).where(eq(collections.id, id)).returning()
  return updatedCollection || null
}

export async function getAllCollections(): Promise<Collection[]> {
  return db.select().from(collections)
}

export async function getCollectionById(id: number): Promise<Collection | null> {
  const [collection] = await db.select().from(collections).where(eq(collections.id, id))
  return collection || null
}
