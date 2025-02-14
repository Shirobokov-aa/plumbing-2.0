import { db } from "@/db"
import { kitchenBanner, kitchenSections, kitchenCollections, kitchenImages } from "../schema"

export async function seedKitchen() {
  try {
    // Создаем баннер
    await db.insert(kitchenBanner).values({
      name: "Кухня",
      title: "Кухня",
      description: "Описание кухни",
      image: "/images/kitchen/banner.png",
      linkText: "Подробнее",
      linkUrl: "/kitchen/details"
    })

    // Создаем секции
    const [section1, section2] = await db.insert(kitchenSections).values([
      {
        title: "Кухонные гарнитуры",
        description: "Описание кухонных гарнитуров",
        linkText: "Смотреть все",
        linkUrl: "/kitchen/furniture",
        order: 1
      },
      {
        title: "Мойки и смесители",
        description: "Описание моек и смесителей",
        linkText: "Смотреть все",
        linkUrl: "/kitchen/sinks",
        order: 2
      }
    ]).returning()

    // Создаем коллекции
    const [collection1] = await db.insert(kitchenCollections).values({
      title: "Коллекция для кухни",
      description: "Описание коллекции",
      linkText: "Подробнее",
      linkUrl: "/kitchen/collection1",
      order: 1
    }).returning()

    // Добавляем изображения для секций
    await db.insert(kitchenImages).values([
      {
        sectionId: section1.id,
        src: "/images/kitchen/furniture1.png",
        alt: "Гарнитур 1",
        order: 1
      },
      {
        sectionId: section1.id,
        src: "/images/kitchen/furniture2.png",
        alt: "Гарнитур 2",
        order: 2
      },
      {
        sectionId: section2.id,
        src: "/images/kitchen/sink1.png",
        alt: "Мойка 1",
        order: 1
      }
    ])

    // Добавляем изображения для коллекций
    await db.insert(kitchenImages).values([
      {
        collectionId: collection1.id,
        src: "/images/kitchen/collection1.png",
        alt: "Коллекция 1",
        order: 1
      }
    ])

    console.log('Kitchen seed completed successfully')
  } catch (error) {
    console.error('Error seeding kitchen data:', error)
    throw error
  }
}
