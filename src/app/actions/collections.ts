'use server'

import { revalidatePath } from 'next/cache'
import {
  createCollection as dbCreateCollection,
  updateCollection as dbUpdateCollection,
  getCollectionById,
  createCollectionPreview as dbCreatePreview,
  updateCollectionPreview as dbUpdatePreview,
  getAllCollectionPreviews,
  getCollectionPreviewById
} from '@/db/collections'
import type { CollectionItem } from '../admin/contexts/SectionsContext'
import { insertCollectionSchema, insertPreviewSchema, collectionPreviews, collectionDetails, collectionSections1, collectionSections2, collectionSections3, collectionSections4 } from '@/db/schema'
import type { NewCollectionPreview } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { getAllCollectionDetails } from "@/db/collection-details"

// interface Banner {
//   image: string;
//   title: string;
//   description: string;
//   link: { text: string; url: string };
// }

// Получение всех коллекций для превью
export async function getCollectionPreviews() {
  try {
    const previews = await getAllCollectionPreviews()
    return { collections: previews }
  } catch (error) {
    console.error('Error fetching collection previews:', error)
    return { error: 'Ошибка при получении коллекций' }
  }
}

// Получение всех коллекций для детальных страниц
export async function getCollections() {
  try {
    const collections = await getAllCollectionDetails()
    return { collections }
  } catch (error) {
    console.error('Error fetching collections:', error)
    return { error: 'Ошибка при получении коллекций' }
  }
}

// Создание новой коллекции
export async function createCollection(data: CollectionItem) {
  try {
    const newCollection = insertCollectionSchema.parse({
      name: data.title,
      banner: {
        image: data.image,
        title: data.title,
        description: data.desc,
        link: {
          text: 'Подробнее',
          url: data.link
        }
      },
      sections: [],
      sections2: [],
      sections3: [],
      sections4: []
    })

    await dbCreateCollection(newCollection)
    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    return { success: true }
  } catch (error) {
    console.error('Error creating collection:', error)
    return { error: 'Ошибка при создании коллекции' }
  }
}

// Обновление коллекции
export async function updateCollection(id: number, data: CollectionItem) {
  try {
    const updatedCollection = insertCollectionSchema.partial().parse({
      name: data.title,
      banner: {
        image: data.image,
        title: data.title,
        description: data.desc,
        link: {
          text: 'Подробнее',
          url: data.link
        }
      }
    })

    await dbUpdateCollection(id, updatedCollection)
    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    return { success: true }
  } catch (error) {
    console.error('Error updating collection:', error)
    return { error: 'Ошибка при обновлении коллекции' }
  }
}

// Получение коллекции по ID
export async function getCollection(id: number) {
  try {
    const collection = await getCollectionById(id)
    if (!collection) {
      return { error: 'Коллекция не найдена' }
    }
    return { collection }
  } catch (error) {
    console.error('Error fetching collection:', error)
    return { error: 'Ошибка при получении коллекции' }
  }
}

// Создание нового превью коллекции
export async function createCollectionPreview(data: NewCollectionPreview) {
  try {
    const validatedData = insertPreviewSchema.parse(data)
    const result = await dbCreatePreview(validatedData)
    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    return { success: true, id: result.id }
  } catch (error) {
    console.error('Error creating collection preview:', error)
    return { error: 'Ошибка при создании коллекции' }
  }
}

// Обновление превью коллекции
export async function updateCollectionPreview(id: number, data: Partial<NewCollectionPreview>) {
  try {
    const validatedData = insertPreviewSchema.partial().parse(data)
    await dbUpdatePreview(id, validatedData)
    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    return { success: true }
  } catch (error) {
    console.error('Error updating collection preview:', error)
    return { error: 'Ошибка при обновлении коллекции' }
  }
}

// Получение превью коллекции по ID
export async function getCollectionPreview(id: number) {
  try {
    const preview = await getCollectionPreviewById(id)
    if (!preview) {
      return { error: 'Коллекция не найдена' }
    }
    return { collection: preview }
  } catch (error) {
    console.error('Error fetching collection preview:', error)
    return { error: 'Ошибка при получении коллекции' }
  }
}

type PreviewResponse =
  | { success: true; id: number }
  | { success: false; error: string }

export async function addCollectionPreview(data: FormData): Promise<PreviewResponse> {
  try {
    // 1. Создаем превью
    const preview = {
      title: data.get('title') as string,
      desc: data.get('desc') as string,
      image: data.get('image') as string,
      flexDirection: data.get('flexDirection') as "xl:flex-row" | "xl:flex-row-reverse",
      link: '/collections/collection-detail/' // временная ссылка
    }

    const result = await createCollectionPreview(preview)

    if (!result?.id) {
      throw new Error('Failed to get preview ID')
    }

    // 2. Создаем детальную страницу с базовой структурой
    await db.insert(collectionDetails).values({
      id: result.id,
      name: preview.title.toLowerCase(),
      bannerImage: preview.image,
      bannerTitle: preview.title,
      bannerDescription: preview.desc,
      bannerLinkText: "Подробнее",
      bannerLinkUrl: `/collections/collection-detail/${result.id}`
    })

    // 3. Создаем пустые секции для детальной страницы
    const emptySection = {
      collectionDetailId: result.id,
      title: "",
      description: "",
      linkText: "",
      linkUrl: "",
      order: 0
    }

    await Promise.all([
      db.insert(collectionSections1).values(emptySection),
      db.insert(collectionSections2).values({
        ...emptySection,
        titleDesc: "",
        descriptionDesc: ""
      }),
      db.insert(collectionSections3).values(emptySection),
      db.insert(collectionSections4).values({
        collectionDetailId: result.id,
        title: "",
        description: "",
        order: 0
      })
    ])

    // 4. Обновляем ссылку превью
    await updateCollectionPreview(result.id, {
      link: `/collections/collection-detail/${result.id}`
    })

    revalidatePath('/collections')
    revalidatePath('/admin/collections')
    revalidatePath('/admin/collection-detail')

    return { success: true, id: result.id }
  } catch (error) {
    console.error('Error in addCollectionPreview:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

export async function deleteCollectionPreview(id: number) {
  try {
    // Удаляем превью
    await db.delete(collectionPreviews)
      .where(eq(collectionPreviews.id, id))

    // Удаляем детальную страницу
    await db.delete(collectionDetails)
      .where(eq(collectionDetails.id, id))

    revalidatePath('/admin/collections')
    revalidatePath('/collections')
    revalidatePath('/admin/collection-detail')
    return { success: true }
  } catch (error) {
    console.error('Error deleting collection preview:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при удалении коллекции'
    }
  }
}

// Добавьте новую функцию
export async function updateAllCollectionLinks() {
  try {
    const previews = await getAllCollectionPreviews()

    for (const preview of previews) {
      await updateCollectionPreview(preview.id, {
        link: `/collections/collection-detail/${preview.id}` // используем ID
      })
    }

    revalidatePath('/collections')
    return { success: true }
  } catch (error) {
    console.error('Error updating collection links:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка при обновлении ссылок'
    }
  }
}
