'use server'

import { db } from "@/db"
import {
  bathroomBanner,
  bathroomSections,
  bathroomCollections,
  bathroomImages
} from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { getBathroomPageData } from "@/db/bathroom"

// Баннер
export async function updateBathroomBanner(data: {
  name: string
  title: string
  description: string
  image: string
  linkText: string
  linkUrl: string
}) {
  try {
    const [banner] = await db.select().from(bathroomBanner)

    if (banner) {
      await db.update(bathroomBanner)
        .set(data)
        .where(eq(bathroomBanner.id, banner.id))
    } else {
      await db.insert(bathroomBanner).values(data)
    }

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/banner')
    return { success: true }
  } catch (error) {
    console.error('Error updating bathroom banner:', error)
    return { success: false }
  }
}

// Секции
export async function createBathroomSection(data: {
  title: string
  description: string
  linkText: string
  linkUrl: string
  order: number
  images: { src: string; alt: string; order: number }[]
}) {
  try {
    const [section] = await db.insert(bathroomSections)
      .values({
        title: data.title,
        description: data.description,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        order: data.order
      })
      .returning()

    if (data.images.length > 0) {
      await db.insert(bathroomImages)
        .values(data.images.map(img => ({
          sectionId: section.id,
          src: img.src,
          alt: img.alt,
          order: img.order
        })))
    }

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/sections')
    return { success: true }
  } catch (error) {
    console.error('Error creating bathroom section:', error)
    return { success: false }
  }
}

export async function updateBathroomSection(id: number, data: {
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
    // Обновляем секцию
    await db.update(bathroomSections)
      .set({
        title: data.title,
        description: data.description,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        order: data.order,
      })
      .where(eq(bathroomSections.id, id))

    // Удаляем старые изображения
    await db.delete(bathroomImages)
      .where(eq(bathroomImages.sectionId, id))

    // Добавляем новые изображения
    if (data.images.length > 0) {
      await db.insert(bathroomImages)
        .values(data.images.map(img => ({
          sectionId: id,
          src: img.src,
          alt: img.alt,
          order: img.order
        })))
    }

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/sections')
    return { success: true }
  } catch (error) {
    console.error('Error updating bathroom section:', error)
    return { success: false }
  }
}

export async function deleteBathroomSection(id: number) {
  try {
    await db.delete(bathroomImages)
      .where(eq(bathroomImages.sectionId, id))

    await db.delete(bathroomSections)
      .where(eq(bathroomSections.id, id))

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/sections')
    return { success: true }
  } catch (error) {
    console.error('Error deleting bathroom section:', error)
    return { success: false }
  }
}

// Коллекции
export async function createBathroomCollection(data: {
  title: string
  description: string
  linkText: string
  linkUrl: string
  order: number
  images: { src: string; alt: string; order: number }[]
}) {
  try {
    const [collection] = await db.insert(bathroomCollections)
      .values({
        title: data.title,
        description: data.description,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        order: data.order
      })
      .returning()

    if (data.images.length > 0) {
      await db.insert(bathroomImages)
        .values(data.images.map(img => ({
          collectionId: collection.id,
          src: img.src,
          alt: img.alt,
          order: img.order
        })))
    }

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/collections')
    return { success: true }
  } catch (error) {
    console.error('Error creating bathroom collection:', error)
    return { success: false }
  }
}

export async function updateBathroomCollection(id: number, data: {
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
    // Обновляем коллекцию
    await db.update(bathroomCollections)
      .set({
        title: data.title,
        description: data.description,
        linkText: data.linkText,
        linkUrl: data.linkUrl,
        order: data.order,
      })
      .where(eq(bathroomCollections.id, id))

    // Удаляем старые изображения
    await db.delete(bathroomImages)
      .where(eq(bathroomImages.collectionId, id))

    // Добавляем новые изображения
    if (data.images.length > 0) {
      await db.insert(bathroomImages)
        .values(data.images.map(img => ({
          collectionId: id,
          src: img.src,
          alt: img.alt,
          order: img.order
        })))
    }

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/collections')
    return { success: true }
  } catch (error) {
    console.error('Error updating bathroom collection:', error)
    return { success: false }
  }
}

export async function deleteBathroomCollection(id: number) {
  try {
    await db.delete(bathroomImages)
      .where(eq(bathroomImages.collectionId, id))

    await db.delete(bathroomCollections)
      .where(eq(bathroomCollections.id, id))

    revalidatePath('/bathroom')
    revalidatePath('/admin/bathroom/collections')
    return { success: true }
  } catch (error) {
    console.error('Error deleting bathroom collection:', error)
    return { success: false }
  }
}

export async function getBathroomData() {
  try {
    const data = await getBathroomPageData();
    return data;
  } catch (error) {
    console.error('Error getting bathroom data:', error);
    throw error;
  }
}
