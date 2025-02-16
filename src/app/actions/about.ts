'use server'

import { db } from "@/db"
import { aboutBanner, aboutSections } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function getAboutPageData(): Promise<AboutPageData> {
  try {
    const [banner] = await db.select().from(aboutBanner)
    const sections = await db.select().from(aboutSections).orderBy(aboutSections.order)

    return {
      banner: banner ? {
        name: banner.name || '',
        title: banner.title || '',
        description: banner.description || '',
        image: banner.image || '',
        link: {
          text: banner.linkText || '',
          url: banner.linkUrl || ''
        }
      } : null,
      sections: sections.map(section => ({
        id: section.id,
        title: section.title || '',
        description: section.description || '',
        order: section.order || 0
      }))
    }
  } catch (error) {
    console.error('Error getting about page data:', error)
    throw error
  }
}

export async function updateAboutBanner(data: {
  name: string
  title: string
  description: string
  image: string
  linkText: string
  linkUrl: string
}) {
  try {
    const [banner] = await db.select().from(aboutBanner)

    if (banner) {
      await db.update(aboutBanner)
        .set(data)
        .where(eq(aboutBanner.id, banner.id))
    } else {
      await db.insert(aboutBanner).values(data)
    }

    revalidatePath('/about')
    revalidatePath('/admin/about/banner')
    return { success: true }
  } catch (error) {
    console.error('Error updating about banner:', error)
    return { success: false }
  }
}

export async function updateAboutSection(id: number, data: {
  title: string
  description: string
  order: number
}) {
  try {
    await db.update(aboutSections)
      .set(data)
      .where(eq(aboutSections.id, id))

    revalidatePath('/about')
    revalidatePath('/admin/about/sections')
    return { success: true }
  } catch (error) {
    console.error('Error updating about section:', error)
    return { success: false }
  }
}

export async function deleteAboutSection(id: number) {
  try {
    await db.delete(aboutSections)
      .where(eq(aboutSections.id, id))

    revalidatePath('/about')
    revalidatePath('/admin/about/sections')
    return { success: true }
  } catch (error) {
    console.error('Error deleting about section:', error)
    return { success: false }
  }
}
