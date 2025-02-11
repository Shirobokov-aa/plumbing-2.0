"use server"

import {
  getCollectionDetailById as getDetail,
  createCollectionDetail as createDetail,
  updateCollectionDetail as updateDetail,
  deleteCollectionDetail as deleteDetail,
  createSection1,
  createSection2,
  createSection3,
  createSection4,
  createSectionImage
} from "@/db/collection-details"
import type {
  NewCollectionDetail,
  NewSection1,
  NewSection2,
  NewSection3,
  NewSection4,
  NewSectionImage
} from "@/db/schema"

// Получить детальную информацию о коллекции
export async function getCollectionDetailById(id: number) {
  try {
    const detail = await getDetail(id)
    if (!detail) return null

    // Преобразуем данные в нужный формат для фронтенда
    return {
      id: detail.id,
      name: detail.name,
      banner: {
        image: detail.bannerImage,
        title: detail.bannerTitle,
        description: detail.bannerDescription,
        link: {
          text: detail.bannerLinkText,
          url: detail.bannerLinkUrl
        }
      }
    }
  } catch (error) {
    console.error('Error fetching collection detail:', error)
    throw error
  }
}

// Создать новую детальную страницу
export async function createCollectionDetail(data: NewCollectionDetail) {
  try {
    const detail = await createDetail(data)
    return { success: true, id: detail.id }
  } catch (error) {
    console.error('Error creating collection detail:', error)
    throw error
  }
}

// Обновить детальную страницу
export async function updateCollectionDetail(id: number, data: Partial<NewCollectionDetail>) {
  try {
    await updateDetail(id, data)
    return { success: true }
  } catch (error) {
    console.error('Error updating collection detail:', error)
    throw error
  }
}

// Удалить детальную страницу
export async function deleteCollectionDetail(id: number) {
  try {
    await deleteDetail(id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting collection detail:', error)
    throw error
  }
}

// Создать секцию с изображениями
export async function createSectionWithImages(
  type: 'section1' | 'section2' | 'section3' | 'section4',
  sectionData: NewSection1 | NewSection2 | NewSection3 | NewSection4,
  images: NewSectionImage[]
) {
  try {
    let section
    switch (type) {
      case 'section1':
        section = await createSection1(sectionData as NewSection1)
        break
      case 'section2':
        section = await createSection2(sectionData as NewSection2)
        break
      case 'section3':
        section = await createSection3(sectionData as NewSection3)
        break
      case 'section4':
        section = await createSection4(sectionData as NewSection4)
        break
    }

    // Создаем изображения для секции
    await Promise.all(
      images.map(img => createSectionImage({
        ...img,
        sectionId: section.id,
        sectionType: type
      }))
    )

    return { success: true, sectionId: section.id }
  } catch (error) {
    console.error('Error creating section with images:', error)
    throw error
  }
}
