import { db } from "@/db"
import { aboutBanner, aboutSections } from "./schema"
import { inArray } from "drizzle-orm"

export async function getAboutBanner() {
  const [banner] = await db.select().from(aboutBanner)
  return banner
}

export async function getAboutSections() {
  const sections = await db.select().from(aboutSections)
    .orderBy(aboutSections.order)
  return sections
}

export async function getAboutPageData() {
  try {
    const [banner, sections] = await Promise.all([
      getAboutBanner(),
      getAboutSections(),
    ])

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
