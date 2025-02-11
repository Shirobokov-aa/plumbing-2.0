import { db } from "./index"
import { collections, type NewCollection, type Collection } from "./schema"
import { eq } from "drizzle-orm"
import { collectionPreviews, type NewCollectionPreview, type CollectionPreview } from "./schema"

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

// Функции для работы с превью коллекций
export async function createCollectionPreview(data: NewCollectionPreview): Promise<{ id: number }> {
  const [insertedPreview] = await db.insert(collectionPreviews)
    .values(data)
    .returning({
      id: collectionPreviews.id
    })

  if (!insertedPreview) {
    throw new Error('Failed to create preview')
  }

  return insertedPreview
}

export async function updateCollectionPreview(id: number, data: Partial<NewCollectionPreview>): Promise<CollectionPreview | null> {
  const [updatedPreview] = await db.update(collectionPreviews)
    .set(data)
    .where(eq(collectionPreviews.id, id))
    .returning()
  return updatedPreview || null
}

export async function getAllCollectionPreviews(): Promise<CollectionPreview[]> {
  return db.select().from(collectionPreviews)
}

export async function getCollectionPreviewById(id: number): Promise<CollectionPreview | null> {
  const [preview] = await db.select()
    .from(collectionPreviews)
    .where(eq(collectionPreviews.id, id))
  return preview || null
}
