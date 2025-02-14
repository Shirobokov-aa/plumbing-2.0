import { db } from "@/db"
import { collectionPreviews } from "./schema"
import {
  collectionDetails,
  collectionSections1,
  collectionSections2,
  collectionSections3,
  collectionSections4,
  collectionSectionImages
} from "@/db/schema"
import { seed as seedMainSections } from './migrations/0004_main_sections'
import { seedBathroom } from './migrations/0005_bathroom_seed'

// Основной сид для коллекций
export async function seed() {
  try {
    // 1. Сначала удаляем все данные
    await db.delete(collectionSectionImages)
    await db.delete(collectionSections1)
    await db.delete(collectionSections2)
    await db.delete(collectionSections3)
    await db.delete(collectionSections4)
    await db.delete(collectionDetails)
    await db.delete(collectionPreviews)

    // 2. Создаем превью
    const previews = await db.insert(collectionPreviews).values([
      {
        image: "/img/item-era.png",
        title: "ERA",
        desc: "Коллекция ERA воплощает гармонию современного дизайна и классических традиций...",
        link: "/",
        flexDirection: "xl:flex-row"
      },
      {
        image: "/img/item-sono.png",
        title: "SONO",
        desc: "Коллекция SONO воплощает гармонию современного дизайна и классических традиций...",
        link: "/",
        flexDirection: "xl:flex-row"
      }
    ]).returning();

    console.log('Created previews:', previews)

    // 3. Создаем детальные страницы
    const [eraDetail] = await db.insert(collectionDetails).values({
      name: "era",
      bannerImage: "/img/era-banner.png",
      bannerTitle: "Коллекция ERA",
      bannerDescription: "Описание коллекции ERA",
      bannerLinkText: "Подробнее",
      bannerLinkUrl: "/"
    }).returning();

    console.log('Created era detail:', eraDetail)

    const [sonoDetail] = await db.insert(collectionDetails).values({
      name: "sono",
      bannerImage: "/img/banner01.png",
      bannerTitle: "Заголовок баннера",
      bannerDescription: "Описание баннера",
      bannerLinkText: "Какой-то текст",
      bannerLinkUrl: "/"
    }).returning();

    console.log('Created sono detail:', sonoDetail)

    // Теперь создаем детальную страницу с правильным collectionId
    // Секции типа 1 для SONO
    const sonoSection1 = await db.insert(collectionSections1).values([
      {
        collectionDetailId: sonoDetail.id,
        title: "Смесители для раковины",
        description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
        linkText: "Посмотреть",
        linkUrl: "/",
        order: 1
      },
      {
        collectionDetailId: sonoDetail.id,
        title: "Смесители для ванной и душа",
        description: "Step into the world of Aesthetics & Co. through our portfolio of past projects. Each project...",
        linkText: "Посмотреть",
        linkUrl: "/",
        order: 2
      }
    ]).returning({ id: collectionSections1.id });

    // Изображения для секций типа 1
    await db.insert(collectionSectionImages).values([
      {
        sectionId: sonoSection1[0].id,
        sectionType: 'section1',
        src: "/img/item01.png",
        alt: "Смеситель SONO 1",
        order: 1
      },
      {
        sectionId: sonoSection1[0].id,
        sectionType: 'section1',
        src: "/img/item02.png",
        alt: "Смеситель SONO 2",
        order: 2
      },
      {
        sectionId: sonoSection1[0].id,
        sectionType: 'section1',
        src: "/img/item02.png",
        alt: "Смеситель SONO 3",
        order: 3
      }
    ]);

    // Секция типа 2 для SONO
    const sonoSection2 = await db.insert(collectionSections2).values({
      collectionDetailId: sonoDetail.id,
      title: "Смесители для раковины",
      description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
      linkText: "Посмотреть",
      linkUrl: "/",
      titleDesc: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
      descriptionDesc: "A Chic Urban Apartment Trasformation",
      order: 1
    }).returning({ id: collectionSections2.id });

    // Изображения для секции типа 2
    await db.insert(collectionSectionImages).values({
      sectionId: sonoSection2[0].id,
      sectionType: 'section2',
      src: "/img/item01.png",
      alt: "Смеситель SONO 1",
      order: 1
    });

    // SONO Section Type 3
    const sonoSection3 = await db.insert(collectionSections3).values({
      collectionDetailId: sonoDetail.id,
      title: "Унитазы",
      description: "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives.",
      linkText: "Посмотреть",
      linkUrl: "/",
      order: 1
    }).returning({ id: collectionSections3.id });

    // SONO Section 3 Images
    await db.insert(collectionSectionImages).values({
      sectionId: sonoSection3[0].id,
      sectionType: 'section3',
      src: "/img/item10.png",
      alt: "Смеситель SONO 1",
      order: 1
    });

    // SONO Section Type 4
    const sonoSection4 = await db.insert(collectionSections4).values({
      collectionDetailId: sonoDetail.id,
      title: "Унитазы",
      description: "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives.",
      order: 1
    }).returning({ id: collectionSections4.id });

    // SONO Section 4 Images
    await db.insert(collectionSectionImages).values([
      {
        sectionId: sonoSection4[0].id,
        sectionType: 'section4',
        src: "/img/item10.png",
        alt: "Смеситель SONO 1",
        order: 1
      },
      {
        sectionId: sonoSection4[0].id,
        sectionType: 'section4',
        src: "/img/item10.png",
        alt: "Смеситель SONO 2",
        order: 2
      },
      {
        sectionId: sonoSection4[0].id,
        sectionType: 'section4',
        src: "/img/item10.png",
        alt: "Смеситель SONO 3",
        order: 3
      }
    ]);

    // ERA Sections Type 1
    await db.insert(collectionSections1).values([
      {
        collectionDetailId: eraDetail.id,
        title: "Смесители для раковины",
        description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
        linkText: "Посмотреть",
        linkUrl: "/",
        order: 1
      }
    ]);

    // ERA Section Type 2
    const eraSection2 = await db.insert(collectionSections2).values({
      collectionDetailId: eraDetail.id,
      title: "Смесители для раковины",
      description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
      linkText: "Посмотреть",
      linkUrl: "/",
      titleDesc: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
      descriptionDesc: "A Chic Urban Apartment Trasformation",
      order: 1
    }).returning({ id: collectionSections2.id });

    // ERA Section 2 Images
    await db.insert(collectionSectionImages).values({
      sectionId: eraSection2[0].id,
      sectionType: 'section2',
      src: "/img/item01.png",
      alt: "Смеситель ERA 1",
      order: 1
    });

    // ERA Section Type 3
    const eraSection3 = await db.insert(collectionSections3).values({
      collectionDetailId: eraDetail.id,
      title: "Смесители для раковины",
      description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
      linkText: "Посмотреть",
      linkUrl: "/",
      order: 1
    }).returning({ id: collectionSections3.id });

    // ERA Section 3 Images
    await db.insert(collectionSectionImages).values({
      sectionId: eraSection3[0].id,
      sectionType: 'section3',
      src: "/img/item01.png",
      alt: "Смеситель ERA 1",
      order: 1
    });

    // ERA Section Type 4
    const eraSection4 = await db.insert(collectionSections4).values({
      collectionDetailId: eraDetail.id,
      title: "Унитазы",
      description: "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives.",
      order: 1
    }).returning({ id: collectionSections4.id });

    // ERA Section 4 Images
    await db.insert(collectionSectionImages).values({
      sectionId: eraSection4[0].id,
      sectionType: 'section4',
      src: "/img/item10.png",
      alt: "Смеситель ERA 1",
      order: 1
    });

    console.log('Seed data inserted successfully');

  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}

// Функция для запуска только сида ванной
async function seedBathroomOnly() {
  try {
    await seedBathroom()
    console.log('Bathroom seed completed successfully')
  } catch (error) {
    console.error('Error during bathroom seed:', error)
    process.exit(1)
  }
}

// Определяем, какой сид запускать на основе аргументов командной строки
const args = process.argv.slice(2)
if (args.includes('--bathroom-only')) {
  seedBathroomOnly()
} else {
  // Запускаем все сиды
  async function main() {
    try {
      await seed()
      await seedMainSections()
      await seedBathroom()
      console.log('All seeds completed successfully')
    } catch (error) {
      console.error('Error during seed:', error)
      process.exit(1)
    }
  }
  main()
}
