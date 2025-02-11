import { db } from "../index"
import { sectionsTable } from "../schema"
import { eq } from "drizzle-orm"

const initialData = {
  "section-1": {
    title: "Привет мир 123",
    description: "Какое то описание из объекта",
    link: { name: "Посмотреть", url: "/123123" },
    images_block: [
      { src: "/img/item01.png", alt: "Image 1", desc: "ERA" },
      { src: "/img/item02.png", alt: "Image 2", desc: "AMO" },
    ],
    images: ["/img/banner-little.png"],
  },
  "section-2": {
    images: ["/img/banner01.png"],
    link: { name: "Какая-то навигация", url: "/" },
  },
  "section-3": {
    title: "ERA",
    description: "Коллекция ERA воплощает гармонию современного дизайна и классических традиций...",
    link: { name: "Посмотреть", url: "/" },
    images: ["/img/item-era.png"],
  },
  "section-4": {
    title: "Коллекции",
    description: "Описание для коллекций",
    link: { name: "Смотреть", url: "/" },
    images_block: [
      { src: "/img/item01.png", alt: "Banner 1", desc: "ERA", url: "/era" },
      { src: "/img/item02.png", alt: "Banner 2", desc: "AMO", url: "/amo" },
      { src: "/img/item03.png", alt: "Image 3", desc: "TWIST", url: "/twist" },
      { src: "/img/item01.png", alt: "Image 1", desc: "ERA", url: "/era" }
    ],
  },
  "section-5": {
    title: "Какой-то заголовок",
    description: "Описание для этого блока",
    link: { name: "Посмотреть", url: "/" },
    images_block: [
      { src: "/img/item10.png", alt: "Item 10", desc: "Description 1" },
      { src: "/img/item11.png", alt: "Item 11", desc: "Description 2" },
      { src: "/img/item12.png", alt: "Item 12", desc: "Description 3" },
    ],
  }
}

async function seed() {
  try {
    console.log('🚀 Начинаем добавление данных...')
    
    // Проверяем, есть ли уже данные
    const existing = await db.select().from(sectionsTable)
    console.log('📊 Существующие данные:', existing)
    
    if (existing.length === 0) {
      // Если данных нет, добавляем начальные
      const inserted = await db.insert(sectionsTable).values({
        id: 1,
        key: 'main',
        data: initialData
      }).returning()
      
      console.log('✅ Данные успешно добавлены:', inserted)
    } else {
      // Если данные есть, обновляем их
      const updated = await db
        .update(sectionsTable)
        .set({ data: initialData })
        .where(eq(sectionsTable.key, 'main'))
        .returning()
      
      console.log('✅ Данные успешно обновлены:', updated)
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении данных:', error)
    process.exit(1)
  } finally {
    console.log('👋 Завершаем работу')
    process.exit(0)
  }
}

console.log('🏁 Запускаем seed...')
seed()