import { db } from "@/db"
import { bathroomBanner, bathroomSections, bathroomCollections, bathroomImages } from "./schema"
import { inArray } from "drizzle-orm"

export async function getBathroomBanner() {
  const [banner] = await db.select().from(bathroomBanner)
  return banner
}

export async function getBathroomSections() {
  const sections = await db.select().from(bathroomSections)
    .orderBy(bathroomSections.order)

  const sectionIds = sections.map(section => section.id)
  const images = await db.select().from(bathroomImages)
    .where(inArray(bathroomImages.sectionId, sectionIds))
    .orderBy(bathroomImages.order)

  return sections.map(section => ({
    ...section,
    images: images.filter(img => img.sectionId === section.id)
  }))
}

export async function getBathroomCollections() {
  const collections = await db.select().from(bathroomCollections)
    .orderBy(bathroomCollections.order)

  const collectionIds = collections.map(collection => collection.id)
  const images = await db.select().from(bathroomImages)
    .where(inArray(bathroomImages.collectionId, collectionIds))
    .orderBy(bathroomImages.order)

  return collections.map(collection => ({
    ...collection,
    images: images.filter(img => img.collectionId === collection.id)
  }))
}

export async function getBathroomPageData() {
  try {
    const [banner, sections, collections] = await Promise.all([
      getBathroomBanner(),
      getBathroomSections(),
      getBathroomCollections()
    ]);

    console.log('Loaded bathroom data:', { banner, sections, collections });

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
    };
  } catch (error) {
    console.error('Error getting bathroom page data:', error);
    throw error;
  }
}
