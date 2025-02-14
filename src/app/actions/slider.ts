'use server'

import { db } from "@/db"
import { mainSlider } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function getSlides() {
  try {
    const slides = await db.select().from(mainSlider).orderBy(mainSlider.order)
    return slides.map(slide => ({
      id: slide.id,
      desktopImage: slide.desktopImage,
      mobileImage: slide.mobileImage,
      title: slide.title,
      linkUrl: slide.linkUrl,
      order: slide.order
    }))
  } catch (error) {
    console.error('Error getting slides:', error)
    return []
  }
}

export async function updateSlide(id: number, data: {
  desktopImage: string
  mobileImage: string
  title: string
  linkUrl: string
  order: number
}) {
  try {
    await db.update(mainSlider)
      .set(data)
      .where(eq(mainSlider.id, id))

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating slide:', error)
    return { success: false }
  }
}
