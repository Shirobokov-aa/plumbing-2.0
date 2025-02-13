'use server'

import { db } from "@/db"
import {
  collectionDetails,
  collectionSections1,
  collectionSections2,
  collectionSections3,
  collectionSections4,
  collectionSectionImages
} from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function deleteCollectionDetail(id: number) {
  try {
    // 1. Сначала получаем все секции
    const sections1 = await db.select().from(collectionSections1)
      .where(eq(collectionSections1.collectionDetailId, id))
    const sections2 = await db.select().from(collectionSections2)
      .where(eq(collectionSections2.collectionDetailId, id))
    const sections3 = await db.select().from(collectionSections3)
      .where(eq(collectionSections3.collectionDetailId, id))
    const sections4 = await db.select().from(collectionSections4)
      .where(eq(collectionSections4.collectionDetailId, id))

    // 2. Удаляем изображения для каждой секции
    for (const section of [...sections1, ...sections2, ...sections3, ...sections4]) {
      await db.delete(collectionSectionImages)
        .where(eq(collectionSectionImages.sectionId, section.id))
    }

    // 3. Удаляем все секции
    await db.delete(collectionSections1)
      .where(eq(collectionSections1.collectionDetailId, id))
    await db.delete(collectionSections2)
      .where(eq(collectionSections2.collectionDetailId, id))
    await db.delete(collectionSections3)
      .where(eq(collectionSections3.collectionDetailId, id))
    await db.delete(collectionSections4)
      .where(eq(collectionSections4.collectionDetailId, id))

    // 4. Теперь можно удалить саму запись
    await db.delete(collectionDetails)
      .where(eq(collectionDetails.id, id))

    revalidatePath('/admin/collection-detail')
    return { success: true }
  } catch (error) {
    console.error('Error deleting collection detail:', error)
    return { success: false }
  }
}
