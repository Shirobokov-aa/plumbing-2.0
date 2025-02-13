import { mainSections, mainSectionImages } from '../schema'
import { db } from '../index'

export async function seedMainSections() {
  // Очищаем существующие данные
  await db.delete(mainSectionImages)
  await db.delete(mainSections)

  // Создаем секции
  const section1 = await db.insert(mainSections).values({
    sectionKey: 'section-1',
    title: 'Привет мир',
    description: 'Какое то описание из объекта',
    linkName: 'Посмотреть',
    linkUrl: '/123123'
  }).returning().then(res => res[0])

  const section2 = await db.insert(mainSections).values({
    sectionKey: 'section-2',
    linkName: 'Какая-то навигация',
    linkUrl: '/'
  }).returning().then(res => res[0])

  const section3 = await db.insert(mainSections).values({
    sectionKey: 'section-3',
    title: 'ERA',
    description: 'Коллекция ERA воплощает гармонию современного дизайна и классических традиций. Элегантные формы, высококачественные материалы и инновационные технологии создают идеальный баланс между эстетикой и функциональностью. Каждая деталь этой коллекции отражает стремление к совершенству и долговечности, предлагая стильные решения для ванной комнаты, которые подходят для самых разных интерьеров.',
    linkName: 'Посмотреть',
    linkUrl: '/'
  }).returning().then(res => res[0])

  const section4 = await db.insert(mainSections).values({
    sectionKey: 'section-4',
    title: 'Коллекции',
    description: 'Описание для коллекций',
    linkName: 'Смотреть',
    linkUrl: '/collections'
  }).returning().then(res => res[0])

  const section5 = await db.insert(mainSections).values({
    sectionKey: 'section-5',
    title: 'Какой-то заголовок',
    description: 'Описание для этого блока',
    linkName: 'Посмотреть',
    linkUrl: '/'
  }).returning().then(res => res[0])

  // Добавляем изображения для section1
  await db.insert(mainSectionImages).values([
    {
      sectionId: section1.id,
      src: '/img/item01.png',
      alt: 'Image 1',
      desc: 'ERA',
      order: 0
    },
    {
      sectionId: section1.id,
      src: '/img/item02.png',
      alt: 'Image 2',
      desc: 'AMO',
      order: 1
    },
    {
      sectionId: section1.id,
      src: '/img/banner-little.png',
      isMain: true,
      order: 0
    }
  ])

  // Добавляем изображения для section2
  await db.insert(mainSectionImages).values([
    {
      sectionId: section2.id,
      src: '/img/banner01.png',
      isMain: true,
      order: 0
    }
  ])

  // Добавляем изображения для section3
  await db.insert(mainSectionImages).values([
    {
      sectionId: section3.id,
      src: '/img/item-era.png',
      isMain: true,
      order: 0
    }
  ])

  // Добавляем изображения для section4
  await db.insert(mainSectionImages).values([
    {
      sectionId: section4.id,
      src: '/img/item01.png',
      alt: 'Banner 1',
      desc: 'ERA',
      url: '/era',
      order: 0
    },
    {
      sectionId: section4.id,
      src: '/img/item02.png',
      alt: 'Banner 2',
      desc: 'AMO',
      url: '/amo',
      order: 1
    },
    {
      sectionId: section4.id,
      src: '/img/item03.png',
      alt: 'Image 3',
      desc: 'TWIST',
      url: '/twist',
      order: 2
    },
    {
      sectionId: section4.id,
      src: '/img/item01.png',
      alt: 'Image 1',
      desc: 'ERA',
      url: '/era',
      order: 3
    }
  ])

  // Добавляем изображения для section5
  await db.insert(mainSectionImages).values([
    {
      sectionId: section5.id,
      src: '/img/item10.png',
      alt: 'Item 10',
      desc: 'Description 1',
      order: 0
    },
    {
      sectionId: section5.id,
      src: '/img/item11.png',
      alt: 'Item 11',
      desc: 'Description 2',
      order: 1
    },
    {
      sectionId: section5.id,
      src: '/img/item12.png',
      alt: 'Item 12',
      desc: 'Description 3',
      order: 2
    }
  ])
}
