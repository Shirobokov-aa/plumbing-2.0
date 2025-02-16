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
import { kitchenBanner, kitchenSections, kitchenCollections, kitchenImages } from './schema'
import { aboutBanner, aboutSections } from './schema'
import { mainSlider } from './schema'
import { products, productCategories, productImages, productVariants } from "./schema"

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

// Функция для заполнения данных кухни
async function seedKitchen() {
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

// Функция для запуска только сида кухни
async function seedKitchenOnly() {
  try {
    await seedKitchen()
    console.log('Kitchen seed completed successfully')
  } catch (error) {
    console.error('Error during kitchen seed:', error)
    process.exit(1)
  }
}

// Функция для заполнения данных страницы "О нас"
async function seedAbout() {
  try {
    // Создаем баннер
    await db.insert(aboutBanner).values({
      name: "О Компании",
      title: "О нашей компании",
      description: "Мы специализируемся на создании уникальных решений для вашего дома",
      image: "/img/about-banner.jpg",
      linkText: "Посмотреть коллекции",
      linkUrl: "/collections"
    })

    // Создаем секции
    await db.insert(aboutSections).values([
      {
        title: "Наша история",
        description: "История нашей компании началась...",
        order: 1
      },
      {
        title: "Наша миссия",
        description: "Наша миссия заключается в...",
        order: 2
      }
    ])

    console.log('About page seed completed successfully')
  } catch (error) {
    console.error('Error seeding about page data:', error)
    throw error
  }
}

// Функция для запуска только сида "О нас"
async function seedAboutOnly() {
  try {
    await seedAbout()
    console.log('About seed completed successfully')
  } catch (error) {
    console.error('Error during about seed:', error)
    process.exit(1)
  }
}

// Функция для заполнения данных слайдера
async function seedMainSlider() {
  try {
    // Создаем слайды
    await db.insert(mainSlider).values([
      {
        desktopImage: "/img/banner01.png",
        mobileImage: "/img/banner01-mobile.png",
        title: "Коллекция ERA",
        linkUrl: "/collections/era",
        order: 1
      },
      {
        desktopImage: "/img/banner02.png",
        mobileImage: "/img/banner02-mobile.png",
        title: "Коллекция SONO",
        linkUrl: "/collections/sono",
        order: 2
      },
      {
        desktopImage: "/img/banner03.png",
        mobileImage: "/img/banner03-mobile.png",
        title: "Кухни",
        linkUrl: "/kitchen",
        order: 3
      }
    ])

    console.log('Main slider seed completed successfully')
  } catch (error) {
    console.error('Error seeding main slider data:', error)
    throw error
  }
}

// Функция для запуска только сида слайдера
async function seedSliderOnly() {
  try {
    await seedMainSlider()
    console.log('Slider seed completed successfully')
  } catch (error) {
    console.error('Error during slider seed:', error)
    process.exit(1)
  }
}

// Функция для заполнения данных каталога
async function seedCatalog() {
  try {
    // Очищаем существующие данные
    await db.delete(productVariants)
    await db.delete(productImages)
    await db.delete(products)
    await db.delete(productCategories)

    // Создаем категорию
    const [category] = await db.insert(productCategories).values({
      name: "Смесители для раковины",
      slug: "smesiteli-dlya-rakoviny",
      description: "Коллекция смесителей для раковины",
      order: 1
    }).returning()

    // Создаем первый товар
    const [product1] = await db.insert(products).values({
      categoryId: category.id,
      name: "Смеситель для раковины ERA",
      slug: "smesitel-dlya-rakoviny-era",
      description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      article: "172728229829",
      specifications: {
        height: "150 мм",
        width: "200 мм",
        material: "латунь",
        coating: "матовое покрытие"
      },
      price: 15000,
      order: 1
    }).returning()

    // Добавляем изображения для первого товара
    await db.insert(productImages).values([
      {
        productId: product1.id,
        src: "/images/products/era-black-1.jpg",
        alt: "Смеситель ERA черный",
        order: 1
      },
      {
        productId: product1.id,
        src: "/images/products/era-black-2.jpg",
        alt: "Смеситель ERA черный",
        order: 2
      }
    ])

    // Добавляем варианты для первого товара
    await db.insert(productVariants).values([
      {
        productId: product1.id,
        name: "Черный матовый",
        value: "#000000",
        available: true
      },
      {
        productId: product1.id,
        name: "Серебристый",
        value: "#C0C0C0",
        available: true
      },
      {
        productId: product1.id,
        name: "Бронзовый",
        value: "#967444",
        available: true
      }
    ])

    // Создаем второй товар
    await db.insert(products).values({
      categoryId: category.id,
      name: "Смеситель для раковины NOVA",
      slug: "smesitel-dlya-rakoviny-nova",
      description: "Lorem ipsum dolor sit amet...",
      article: "172728229830",
      specifications: {
        height: "180 мм",
        width: "220 мм",
        material: "латунь",
        coating: "глянцевое покрытие"
      },
      price: 18000,
      order: 2
    })

    console.log('Catalog seed completed successfully')
  } catch (error) {
    console.error('Error seeding catalog data:', error)
    throw error
  }
}

// Функция для запуска только сида каталога
async function seedCatalogOnly() {
  try {
    await seedCatalog()
    console.log('Catalog seed completed successfully')
  } catch (error) {
    console.error('Error during catalog seed:', error)
    process.exit(1)
  }
}

// Обновляем проверку аргументов командной строки
const args = process.argv.slice(2)
if (args.includes('--bathroom-only')) {
  seedBathroomOnly()
} else if (args.includes('--kitchen-only')) {
  seedKitchenOnly()
} else if (args.includes('--about-only')) {
  seedAboutOnly()
} else if (args.includes('--slider-only')) {
  seedSliderOnly()
} else if (args.includes('--catalog')) { // Добавляем новую проверку
  seedCatalogOnly()
} else {
  // Запускаем все сиды
  async function main() {
    try {
      await seed()
      await seedMainSections()
      await seedBathroom()
      await seedKitchen()
      await seedAbout()
      await seedMainSlider()
      await seedCatalog() // Добавляем сид каталога в общий запуск
      console.log('All seeds completed successfully')
    } catch (error) {
      console.error('Error during seed:', error)
      process.exit(1)
    }
  }
  main()
}
