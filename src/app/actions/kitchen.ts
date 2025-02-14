'use server'

import { db } from "@/db"
import {
  kitchenBanner,
  kitchenSections,
  kitchenCollections,
  kitchenImages
} from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { getKitchenPageData } from "@/db/kitchen"

export async function getKitchenData() {
  try {
    const data = await getKitchenPageData();
    return data;
  } catch (error) {
    console.error('Error getting kitchen data:', error);
    throw error;
  }
}

export async function updateKitchenBanner(data: {
  name: string
  title: string
  description: string
  image: string
  linkText: string
  linkUrl: string
}) {
  try {
    const [banner] = await db.select().from(kitchenBanner)

    if (banner) {
      await db.update(kitchenBanner)
        .set(data)
        .where(eq(kitchenBanner.id, banner.id))
    } else {
      await db.insert(kitchenBanner).values(data)
    }

    revalidatePath('/kitchen')
    revalidatePath('/admin/kitchen/banner')
    return { success: true }
  } catch (error) {
    console.error('Error updating kitchen banner:', error)
    return { success: false }
  }
}

export async function updateKitchenSection(id: number, data: {
  title: string
  description: string
  linkText: string
  linkUrl: string
  order: number
  images: Array<{
    src: string
    alt: string
    order: number
  }>
}) {
  try {
    // Обновляем данные секции
    await db.update(kitchenSections)
      .set({
        title: data.title,
        description: data.description,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        order: data.order
      })
      .where(eq(kitchenSections.id, id))

    // Удаляем старые изображения
    await db.delete(kitchenImages)
      .where(eq(kitchenImages.sectionId, id))

    // Добавляем новые изображения
    if (data.images.length > 0) {
      await db.insert(kitchenImages)
        .values(data.images.map(img => ({
          sectionId: id,
          src: img.src,
          alt: img.alt,
          order: img.order
        })))
    }

    revalidatePath('/kitchen')
    revalidatePath('/admin/kitchen/sections')
    return { success: true }
  } catch (error) {
    console.error('Error updating kitchen section:', error)
    return { success: false }
  }
}

export async function updateKitchenCollection(id: number, data: {
  title: string
  description: string
  linkText: string
  linkUrl: string
  order: number
  images: Array<{
    src: string
    alt: string
    order: number
  }>
}) {
  try {
    // Обновляем данные коллекции
    await db.update(kitchenCollections)
      .set({
        title: data.title,
        description: data.description,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        order: data.order
      })
      .where(eq(kitchenCollections.id, id))

    // Удаляем старые изображения
    await db.delete(kitchenImages)
      .where(eq(kitchenImages.collectionId, id))

    // Добавляем новые изображения
    if (data.images.length > 0) {
      await db.insert(kitchenImages)
        .values(data.images.map(img => ({
          collectionId: id,
          src: img.src,
          alt: img.alt,
          order: img.order
        })))
    }

    revalidatePath('/kitchen')
    revalidatePath('/admin/kitchen/collections')
    return { success: true }
  } catch (error) {
    console.error('Error updating kitchen collection:', error)
    return { success: false }
  }
}

export async function deleteKitchenSection(id: number) {
  try {
    // Сначала удаляем связанные изображения
    await db.delete(kitchenImages)
      .where(eq(kitchenImages.sectionId, id))

    // Затем удаляем саму секцию
    await db.delete(kitchenSections)
      .where(eq(kitchenSections.id, id))

    revalidatePath('/kitchen')
    revalidatePath('/admin/kitchen/sections')
    return { success: true }
  } catch (error) {
    console.error('Error deleting kitchen section:', error)
    return { success: false }
  }
}

export async function deleteKitchenCollection(id: number) {
  try {
    // Сначала удаляем связанные изображения
    await db.delete(kitchenImages)
      .where(eq(kitchenImages.collectionId, id))

    // Затем удаляем саму коллекцию
    await db.delete(kitchenCollections)
      .where(eq(kitchenCollections.id, id))

    revalidatePath('/kitchen')
    revalidatePath('/admin/kitchen/collections')
    return { success: true }
  } catch (error) {
    console.error('Error deleting kitchen collection:', error)
    return { success: false }
  }
}
