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
  // NewCollectionDetail,
  NewSection1,
  NewSection2,
  NewSection3,
  NewSection4,
  // NewSectionImage
} from "@/db/schema"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import {
  collectionSections1,
  collectionSections2,
  collectionSections3,
  collectionSections4,
  collectionSectionImages
} from "@/db/schema"

type CollectionDetailInput = {
  name: string;
  bannerImage: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerLinkText: string;
  bannerLinkUrl: string;
  sections1: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections2: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    titleDesc: string;
    descriptionDesc: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections3: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections4: Array<{
    title: string;
    description: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
}

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
export async function createCollectionDetail(data: CollectionDetailInput) {
  try {
    // Создаем основную запись
    const detail = await createDetail(data)

    // Создаем секции с изображениями
    await Promise.all([
      ...data.sections1.map(section =>
        createSectionWithImages('section1', {
          ...section,
          collectionDetailId: detail.id
        }, section.images)
      ),
      ...data.sections2.map(section =>
        createSectionWithImages('section2', {
          ...section,
          collectionDetailId: detail.id
        }, section.images)
      ),
      ...data.sections3.map(section =>
        createSectionWithImages('section3', {
          ...section,
          collectionDetailId: detail.id
        }, section.images)
      ),
      ...data.sections4.map(section =>
        createSectionWithImages('section4', {
          ...section,
          collectionDetailId: detail.id
        }, section.images)
      )
    ])

    return { success: true, id: detail.id }
  } catch (error) {
    console.error('Error creating collection detail:', error)
    throw error
  }
}

// Обновить детальную страницу
export async function updateCollectionDetail(id: number, data: Partial<CollectionDetailInput>) {
  try {
    // Обновляем основную запись
    await updateDetail(id, {
      name: data.name,
      bannerImage: data.bannerImage,
      bannerTitle: data.bannerTitle,
      bannerDescription: data.bannerDescription,
      bannerLinkText: data.bannerLinkText,
      bannerLinkUrl: data.bannerLinkUrl,
    })

    // Удаляем существующие изображения и секции
    await db.delete(collectionSectionImages)
      .where(eq(collectionSectionImages.sectionId, id))

    await db.delete(collectionSections1)
      .where(eq(collectionSections1.collectionDetailId, id))
    await db.delete(collectionSections2)
      .where(eq(collectionSections2.collectionDetailId, id))
    await db.delete(collectionSections3)
      .where(eq(collectionSections3.collectionDetailId, id))
    await db.delete(collectionSections4)
      .where(eq(collectionSections4.collectionDetailId, id))

    // Создаем новые секции
    if (data.sections1) {
      await Promise.all(data.sections1.map(section =>
        createSectionWithImages('section1', {
          ...section,
          collectionDetailId: id
        }, section.images)
      ))
    }

    if (data.sections2) {
      await Promise.all(data.sections2.map(section =>
        createSectionWithImages('section2', {
          ...section,
          collectionDetailId: id
        }, section.images)
      ))
    }

    if (data.sections3) {
      await Promise.all(data.sections3.map(section =>
        createSectionWithImages('section3', {
          ...section,
          collectionDetailId: id
        }, section.images)
      ))
    }

    if (data.sections4) {
      await Promise.all(data.sections4.map(section =>
        createSectionWithImages('section4', {
          ...section,
          collectionDetailId: id
        }, section.images)
      ))
    }

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
async function createSectionWithImages(
  type: 'section1' | 'section2' | 'section3' | 'section4',
  sectionData: NewSection1 | NewSection2 | NewSection3 | NewSection4,
  images: Array<{ src: string; alt: string; order: number }>
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

    // Добавляем sectionId и sectionType к каждому изображению
    const imagesWithSection = images.map(img => ({
      ...img,
      sectionId: section.id,
      sectionType: type
    }))

    await Promise.all(imagesWithSection.map(createSectionImage))

    return section
  } catch (error) {
    console.error('Error creating section with images:', error)
    throw error
  }
}
