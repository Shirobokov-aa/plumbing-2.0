'use server'

import { db } from '@/db'
import { mainSections, mainSectionImages } from '@/db/schema'
// import type { MainSection, MainSectionImage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

interface ImageBlockData {
  src: string
  alt?: string
  desc?: string
  url?: string
}

interface SectionData {
  title?: string
  description?: string
  link?: {
    name?: string
    url?: string
  }
  images?: string[]
  images_block?: ImageBlockData[]
}

interface FormattedSection {
  [key: string]: {
    title?: string
    description?: string
    link?: {
      name?: string
      url?: string
    }
    images?: string[]
    images_block?: ImageBlockData[]
  }
}

// Получение всех секций с изображениями
export async function getMainSections(): Promise<FormattedSection> {
  try {
    const sections = await db.query.mainSections.findMany({
      with: {
        images: true
      }
    })

    // Преобразуем данные в формат, ожидаемый фронтендом
    const formattedSections = sections.reduce<FormattedSection>((acc, section) => {
      const mainImages = section.images.filter(img => img.isMain)
      const blockImages = section.images.filter(img => !img.isMain)

      acc[section.sectionKey] = {
        title: section.title || undefined,
        description: section.description || undefined,
        link: {
          name: section.linkName || undefined,
          url: section.linkUrl || undefined
        },
        images: mainImages.map(img => img.src),
        images_block: blockImages.map(img => ({
          src: img.src,
          alt: img.alt || undefined,
          desc: img.desc || undefined,
          url: img.url || undefined
        }))
      }
      return acc
    }, {})

    return formattedSections
  } catch (error) {
    console.error('Error getting main sections:', error)
    throw error
  }
}

interface UpdateResponse {
  success: boolean
  error?: string
}

// Обновление секции
export async function updateMainSection(sectionKey: string, data: SectionData): Promise<UpdateResponse> {
  try {
    const section = await db
      .update(mainSections)
      .set({
        title: data.title,
        description: data.description,
        linkName: data.link?.name,
        linkUrl: data.link?.url,
        updatedAt: new Date()
      })
      .where(eq(mainSections.sectionKey, sectionKey))
      .returning()
      .then(res => res[0])

    if (!section) {
      throw new Error('Section not found')
    }

    // Обновляем изображения
    if (data.images?.length) {
      await db.delete(mainSectionImages)
        .where(and(
          eq(mainSectionImages.sectionId, section.id),
          eq(mainSectionImages.isMain, true)
        ))

      await db.insert(mainSectionImages).values(
        data.images.map((src: string, index: number) => ({
          sectionId: section.id,
          src,
          isMain: true,
          order: index
        }))
      )
    }

    if (data.images_block?.length) {
      await db.delete(mainSectionImages)
        .where(and(
          eq(mainSectionImages.sectionId, section.id),
          eq(mainSectionImages.isMain, false)
        ))

      await db.insert(mainSectionImages).values(
        data.images_block.map((img: ImageBlockData, index: number) => ({
          sectionId: section.id,
          src: img.src,
          alt: img.alt,
          desc: img.desc,
          url: img.url,
          isMain: false,
          order: index
        }))
      )
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating main section:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}
