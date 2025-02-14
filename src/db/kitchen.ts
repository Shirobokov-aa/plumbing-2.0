import { db } from "@/db"
import { kitchenBanner, kitchenSections, kitchenCollections, kitchenImages } from "./schema"
import { inArray } from "drizzle-orm"

export async function getKitchenBanner() {
  const [banner] = await db.select().from(kitchenBanner)
  return banner
}

export async function getKitchenSections() {
  const sections = await db.select().from(kitchenSections)
    .orderBy(kitchenSections.order)

  const sectionIds = sections.map(section => section.id)
  const images = await db.select().from(kitchenImages)
    .where(inArray(kitchenImages.sectionId, sectionIds))
    .orderBy(kitchenImages.order)

  return sections.map(section => ({
    ...section,
    images: images.filter(img => img.sectionId === section.id)
  }))
}

export async function getKitchenCollections() {
  const collections = await db.select().from(kitchenCollections)
    .orderBy(kitchenCollections.order)

  const collectionIds = collections.map(collection => collection.id)
  const images = await db.select().from(kitchenImages)
    .where(inArray(kitchenImages.collectionId, collectionIds))
    .orderBy(kitchenImages.order)

  return collections.map(collection => ({
    ...collection,
    images: images.filter(img => img.collectionId === collection.id)
  }))
}

export async function getKitchenPageData() {
  try {
    const [banner, sections, collections] = await Promise.all([
      getKitchenBanner(),
      getKitchenSections(),
      getKitchenCollections()
    ])

    return {
      banner: banner ? {
        ...banner,
        link: {
          text: banner.linkText || '',
          url: banner.linkUrl || ''
        }
      } : null,
      sections: sections.map(section => ({
        id: section.id,
        title: section.title || '',
        description: section.description || '',
        link: {
          text: section.linkText || '',
          url: section.linkUrl || ''
        },
        images: section.images.map(img => ({
          src: img.src,
          alt: img.alt || '',
          order: img.order || 0
        })),
        order: section.order || 0
      })),
      collections: collections.map(collection => ({
        id: collection.id,
        title: collection.title || '',
        description: collection.description || '',
        link: {
          text: collection.linkText || '',
          url: collection.linkUrl || ''
        },
        images: collection.images.map(img => ({
          src: img.src,
          alt: img.alt || '',
          order: img.order || 0
        })),
        order: collection.order || 0
      }))
    }
  } catch (error) {
    console.error('Error getting kitchen page data:', error)
    throw error
  }
}
