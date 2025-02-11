import { db } from '../index'
import { collections } from '../schema'

const initialCollections = [
  {
    name: "ERA",
    banner: {
      image: "/img/item-era.png",
      title: "ERA",
      description: "Коллекция ERA воплощает гармонию современного дизайна и классических традиций...",
      link: { text: "Подробнее", url: "/" }
    },
    sections: [],
    sections2: [],
    sections3: [],
    sections4: []
  },
  {
    name: "AMO",
    banner: {
      image: "/img/item01.png",
      title: "AMO",
      description: "Описание для коллекции AMO",
      link: { text: "Подробнее", url: "/" }
    },
    sections: [],
    sections2: [],
    sections3: [],
    sections4: []
  },
  {
    name: "TWIST",
    banner: {
      image: "/img/item02.png",
      title: "TWIST",
      description: "Описание для коллекции TWIST",
      link: { text: "Подробнее", url: "/" }
    },
    sections: [],
    sections2: [],
    sections3: [],
    sections4: []
  }
]

export async function seed() {
  try {
    for (const collection of initialCollections) {
      await db.insert(collections).values(collection).onConflictDoNothing()
    }
    console.log('Seed data inserted successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}
