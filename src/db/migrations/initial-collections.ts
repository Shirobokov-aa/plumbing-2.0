import { db } from "../index"
import { collectionsTable } from "../schema"
import { eq } from "drizzle-orm"

const initialCollections = [
  {
    id: 1,
    title: "ERA",
    desc: "Коллекция ERA воплощает гармонию современного дизайна и классических традиций...",
    image: "/img/item-era.png",
    link: "/collections/collection-detail/era",
    flexDirection: "xl:flex-row"
  },
  {
    id: 2,
    title: "AMO",
    desc: "Коллекция AMO - это воплощение элегантности и современного стиля...",
    image: "/img/item-amo.png",
    link: "/collections/collection-detail/amo",
    flexDirection: "xl:flex-row-reverse"
  },
  {
    id: 3,
    title: "TWIST",
    desc: "TWIST - это смелое сочетание классических форм и современных решений...",
    image: "/img/item-twist.png",
    link: "/collections/collection-detail/twist",
    flexDirection: "xl:flex-row"
  }
  // Добавьте остальные коллекции по аналогии
]

async function seed() {
  try {
    // Проверяем, есть ли уже данные
    const existing = await db.select().from(collectionsTable)
    
    if (existing.length === 0) {
      // Если данных нет, добавляем начальные
      await db.insert(collectionsTable).values({
        id: 1,
        data: initialCollections
      })
      console.log('✅ Коллекции успешно добавлены')
    } else {
      // Если данные есть, обновляем их
      await db.update(collectionsTable)
        .set({ data: initialCollections })
        .where(eq(collectionsTable.id, existing[0].id))
      console.log('✅ Коллекции успешно обновлены')
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении коллекций:', error)
  }
}

seed() 