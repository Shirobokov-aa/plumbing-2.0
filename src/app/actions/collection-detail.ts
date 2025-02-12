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
  createSectionImage,
  getCollectionDetailWithSections
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

    // Получаем все связанные данные
    const fullDetail = await getCollectionDetailWithSections(id)
    if (!fullDetail) return null

    // Преобразуем данные в нужный формат для фронтенда
    return {
      id: fullDetail.id,
      name: fullDetail.name,
      banner: {
        image: fullDetail.bannerImage,
        title: fullDetail.bannerTitle,
        description: fullDetail.bannerDescription,
        link: {
          text: fullDetail.bannerLinkText,
          url: fullDetail.bannerLinkUrl
        }
      },
      sections: fullDetail.sections1.map(s => ({
        title: s.title,
        description: s.description,
        linkText: s.linkText,
        linkUrl: s.linkUrl,
        images: s.images.map(img => ({
          src: img.src,
          alt: img.alt,
          order: img.order
        }))
      })),
      sections2: fullDetail.sections2.map(s => ({
        title: s.title,
        description: s.description,
        linkText: s.linkText,
        linkUrl: s.linkUrl,
        titleDesc: s.titleDesc,
        descriptionDesc: s.descriptionDesc,
        images: s.images.map(img => ({
          src: img.src,
          alt: img.alt,
          order: img.order
        }))
      })),
      sections3: fullDetail.sections3.map(s => ({
        title: s.title,
        description: s.description,
        linkText: s.linkText,
        linkUrl: s.linkUrl,
        images: s.images.map(img => ({
          src: img.src,
          alt: img.alt,
          order: img.order
        }))
      })),
      sections4: fullDetail.sections4.map(s => ({
        title: s.title,
        description: s.description,
        images: s.images.map(img => ({
          src: img.src,
          alt: img.alt,
          order: img.order
        }))
      }))
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
