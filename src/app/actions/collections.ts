'use server'

import { revalidatePath } from 'next/cache'
import {
  createCollection as dbCreateCollection,
  updateCollection as dbUpdateCollection,
  getAllCollections,
  getCollectionById
} from '@/db/collections'
import type { CollectionItem } from '../admin/contexts/SectionsContext'
import { insertCollectionSchema } from '@/db/schema'
import type { Collection } from '@/db/schema'

interface Banner {
  image: string;
  title: string;
  description: string;
  link: { text: string; url: string };
}

// Получение всех коллекций для превью
export async function getCollections() {
  try {
    const collections = await getAllCollections()

    // Преобразуем данные в формат CollectionItem[]
    const collectionItems: CollectionItem[] = collections.map((item: Collection) => ({
      id: item.id,
      image: (item.banner as Banner).image,
      title: item.name,
      desc: (item.banner as Banner).description,
      link: (item.banner as Banner).link.url,
      flexDirection: "xl:flex-row" // можно добавить логику определения направления
    }))

    return { collections: collectionItems }
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
