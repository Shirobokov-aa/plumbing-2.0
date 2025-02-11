import { db } from '../index'
import { collectionPreviews } from '../schema'

const initialPreviews = [
  {
    image: "/img/item-era.png",
    title: "ERA",
    desc: "Коллекция ERA воплощает гармонию современного дизайна и классических традиций...",
    link: "/",
    flexDirection: "xl:flex-row"
  },
  {
    image: "/img/item01.png",
    title: "AMO",
    desc: "Описание для коллекции AMO",
    link: "/",
    flexDirection: "xl:flex-row-reverse"
  },
  {
    image: "/img/item02.png",
    title: "TWIST",
    desc: "Описание для коллекции TWIST",
    link: "/",
    flexDirection: "xl:flex-row"
  }
]

export async function seed() {
  try {
    // Очищаем таблицу перед вставкой
    await db.delete(collectionPreviews)

    // Вставляем начальные данные
    for (const preview of initialPreviews) {
      await db.insert(collectionPreviews).values(preview)
    }
    console.log('Preview seed data inserted successfully')
  } catch (error) {
    console.error('Error seeding preview data:', error)
    throw error
  }
}
