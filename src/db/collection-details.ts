import { db } from "./index"
import {
  collectionDetails,
  collectionSections1,
  collectionSections2,
  collectionSections3,
  collectionSections4,
  collectionSectionImages,
  type CollectionDetail,
  type NewCollectionDetail,
  type Section1,
  type NewSection1,
  type Section2,
  type NewSection2,
  type Section3,
  type NewSection3,
  type Section4,
  type NewSection4,
  type SectionImage,
  type NewSectionImage,
} from "./schema"
import { eq } from "drizzle-orm"

// Получить детальную страницу по ID
export async function getCollectionDetailById(id: number): Promise<CollectionDetail | null> {
  const [detail] = await db.select().from(collectionDetails).where(eq(collectionDetails.id, id))
  return detail || null
}

// Получить все детальные страницы
export async function getAllCollectionDetails(): Promise<CollectionDetail[]> {
  return db.select().from(collectionDetails)
}

// Создать детальную страницу
export async function createCollectionDetail(data: NewCollectionDetail): Promise<CollectionDetail> {
  const [insertedDetail] = await db.insert(collectionDetails).values(data).returning()
  return insertedDetail
}

// Обновить детальную страницу
export async function updateCollectionDetail(
  id: number,
  data: Partial<NewCollectionDetail>
): Promise<CollectionDetail | null> {
  const [updatedDetail] = await db
    .update(collectionDetails)
    .set(data)
    .where(eq(collectionDetails.id, id))
    .returning()
  return updatedDetail || null
}

// Удалить детальную страницу
export async function deleteCollectionDetail(id: number): Promise<boolean> {
  const [deletedDetail] = await db
    .delete(collectionDetails)
    .where(eq(collectionDetails.id, id))
    .returning()
  return !!deletedDetail
}

// Функции для работы с секциями
export async function createSection1(data: NewSection1): Promise<Section1> {
  const [insertedSection] = await db.insert(collectionSections1).values(data).returning()
  return insertedSection
}

export async function createSection2(data: NewSection2): Promise<Section2> {
  const [insertedSection] = await db.insert(collectionSections2).values(data).returning()
  return insertedSection
}

export async function createSection3(data: NewSection3): Promise<Section3> {
  const [insertedSection] = await db.insert(collectionSections3).values(data).returning()
  return insertedSection
}

export async function createSection4(data: NewSection4): Promise<Section4> {
  const [insertedSection] = await db.insert(collectionSections4).values(data).returning()
  return insertedSection
}

// Функции для работы с изображениями секций
export async function createSectionImage(data: NewSectionImage): Promise<SectionImage> {
  const [insertedImage] = await db.insert(collectionSectionImages).values(data).returning()
  return insertedImage
}

// Получить все секции и изображения для детальной страницы
export async function getCollectionDetailWithSections(id: number) {
  const detail = await getCollectionDetailById(id);
  if (!detail) return null;

  const sections1 = await db.select().from(collectionSections1)
    .where(eq(collectionSections1.collectionDetailId, id));
  const sections2 = await db.select().from(collectionSections2)
    .where(eq(collectionSections2.collectionDetailId, id));
  const sections3 = await db.select().from(collectionSections3)
    .where(eq(collectionSections3.collectionDetailId, id));
  const sections4 = await db.select().from(collectionSections4)
    .where(eq(collectionSections4.collectionDetailId, id));

  // Получаем изображения для каждой секции
  const images = await db.select().from(collectionSectionImages);

  return {
    ...detail,
    sections1: sections1.map(s => ({
      ...s,
      images: images.filter(i => i.sectionId === s.id && i.sectionType === 'section1')
    })),
    sections2: sections2.map(s => ({
      ...s,
      images: images.filter(i => i.sectionId === s.id && i.sectionType === 'section2')
    })),
    sections3: sections3.map(s => ({
      ...s,
      images: images.filter(i => i.sectionId === s.id && i.sectionType === 'section3')
    })),
    sections4: sections4.map(s => ({
      ...s,
      images: images.filter(i => i.sectionId === s.id && i.sectionType === 'section4')
    })),
  };
}
