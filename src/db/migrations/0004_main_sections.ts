import { db } from '../index'
import { mainSections, mainSectionImages } from '../schema'

interface SectionImage {
  src: string;
  alt?: string;
  desc?: string;
  url?: string;
  isMain: boolean;
}

const initialSections = [
  {
    sectionKey: 'section-1',
    title: 'Привет мир',
    description: 'Какое то описание из объекта',
    linkName: 'Посмотреть',
    linkUrl: '/123123'
  },
  {
    sectionKey: 'section-2',
    linkName: 'Какая-то навигация',
    linkUrl: '/'
  },
  {
    sectionKey: 'section-3',
    title: 'ERA',
    description: 'Коллекция ERA воплощает гармонию современного дизайна и классических традиций...',
    linkName: 'Посмотреть',
    linkUrl: '/'
  },
  {
    sectionKey: 'section-4',
    title: 'Коллекции',
    description: 'Описание для коллекций',
    linkName: 'Смотреть',
    linkUrl: '/collections'
  },
  {
    sectionKey: 'section-5',
    title: 'Какой-то заголовок',
    description: 'Описание для этого блока',
    linkName: 'Посмотреть',
    linkUrl: '/'
  }
]

const initialImages: { sectionKey: string; images: SectionImage[] }[] = [
  // section-1 images
  {
    sectionKey: 'section-1',
    images: [
      { src: '/img/item01.png', alt: 'Image 1', desc: 'ERA', isMain: false },
      { src: '/img/item02.png', alt: 'Image 2', desc: 'AMO', isMain: false },
      { src: '/img/banner-little.png', isMain: true }
    ]
  },
  // section-2 images
  {
    sectionKey: 'section-2',
    images: [
      { src: '/img/banner01.png', isMain: true }
    ]
  },
  // section-3 images
  {
    sectionKey: 'section-3',
    images: [
      { src: '/img/item-era.png', isMain: true }
    ]
  },
  // section-4 images
  {
    sectionKey: 'section-4',
    images: [
      { src: '/img/item01.png', alt: 'Banner 1', desc: 'ERA', url: '/era', isMain: false },
      { src: '/img/item02.png', alt: 'Banner 2', desc: 'AMO', url: '/amo', isMain: false },
      { src: '/img/item03.png', alt: 'Image 3', desc: 'TWIST', url: '/twist', isMain: false },
      { src: '/img/item01.png', alt: 'Image 1', desc: 'ERA', url: '/era', isMain: false }
    ]
  },
  // section-5 images
  {
    sectionKey: 'section-5',
    images: [
      { src: '/img/item10.png', alt: 'Item 10', desc: 'Description 1', isMain: false },
      { src: '/img/item11.png', alt: 'Item 11', desc: 'Description 2', isMain: false },
      { src: '/img/item12.png', alt: 'Item 12', desc: 'Description 3', isMain: false }
    ]
  }
]

export async function seed() {
  try {
    // Очищаем таблицы перед вставкой
    await db.delete(mainSectionImages)
    await db.delete(mainSections)

    // Вставляем секции
    for (const section of initialSections) {
      const [insertedSection] = await db.insert(mainSections).values(section).returning()

      // Находим изображения для текущей секции
      const sectionImages = initialImages.find(img => img.sectionKey === section.sectionKey)

      // Вставляем изображения для секции
      if (sectionImages) {
        for (const [index, image] of sectionImages.images.entries()) {
          await db.insert(mainSectionImages).values({
            sectionId: insertedSection.id,
            src: image.src,
            alt: image.alt,
            desc: image.desc,
            url: image.url,
            isMain: image.isMain,
            order: index
          })
        }
      }
    }

    console.log('Main sections seed data inserted successfully')
  } catch (error) {
    console.error('Error seeding main sections data:', error)
    throw error
  }
}
