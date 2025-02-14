import { db } from "@/db"
import { bathroomBanner, bathroomSections, bathroomCollections, bathroomImages } from "../schema"

export async function seedBathroom() {
  try {
    // Создаем баннер
    await db.insert(bathroomBanner).values({
      name: "Ванная комната",
      title: "Ванная комната",
      description: "Описание ванной комнаты",
      image: "/images/bathroom/banner.png",
      linkText: "Подробнее",
      linkUrl: "/bathroom/details"
    })

    // Создаем секции
    const [section1, section2] = await db.insert(bathroomSections).values([
      {
        title: "Ванны и душевые",
        description: "Описание ванн и душевых",
        linkText: "Смотреть все",
        linkUrl: "/bathroom/bath",
        order: 1
      },
      {
        title: "Раковины",
        description: "Описание раковин",
        linkText: "Смотреть все",
        linkUrl: "/bathroom/sinks",
        order: 2
      }
    ]).returning()

    // Создаем коллекции
    const [collection1] = await db.insert(bathroomCollections).values({
      title: "Коллекция для ванной",
      description: "Описание коллекции",
      linkText: "Подробнее",
      linkUrl: "/bathroom/collection1",
      order: 1
    }).returning()

    // Добавляем изображения для секций
    await db.insert(bathroomImages).values([
      {
        sectionId: section1.id,
        src: "/images/bathroom/bath1.png",
        alt: "Ванна 1",
        order: 1
      },
      {
        sectionId: section1.id,
        src: "/images/bathroom/bath2.png",
        alt: "Ванна 2",
        order: 2
      },
      {
        sectionId: section2.id,
        src: "/images/bathroom/sink1.png",
        alt: "Раковина 1",
        order: 1
      }
    ])

    // Добавляем изображения для коллекций
    await db.insert(bathroomImages).values([
      {
        collectionId: collection1.id,
        src: "/images/bathroom/collection1.png",
        alt: "Коллекция 1",
        order: 1
      }
    ])

    console.log('Bathroom seed completed successfully')
  } catch (error) {
    console.error('Error seeding bathroom data:', error)
    throw error
  }
}
