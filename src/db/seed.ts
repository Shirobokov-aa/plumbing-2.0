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

async function seed() {
  try {
    // Очищаем таблицу перед вставкой
    await db.delete(collectionPreviews)

    // Вставляем начальные данные
    await db.insert(collectionPreviews).values([
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
    ])

    console.log('Seed data inserted successfully')

    // Создаем детальную страницу для коллекции SONO
    const sonoDetail = await db.insert(collectionDetails).values({
      collectionId: 1, // ID из таблицы collection_previews
      name: "sono",
      bannerImage: "/img/banner01.png",
      bannerTitle: "Заголовок баннера",
      bannerDescription: "Описание баннера",
      bannerLinkText: "Какой-то текст",
      bannerLinkUrl: "/"
    }).returning({ id: collectionDetails.id });

    // Секции типа 1 для SONO
    const sonoSection1 = await db.insert(collectionSections1).values([
      {
        collectionDetailId: sonoDetail[0].id,
        title: "Смесители для раковины",
        description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
        linkText: "Посмотреть",
        linkUrl: "/",
        order: 1
      },
      {
        collectionDetailId: sonoDetail[0].id,
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
      collectionDetailId: sonoDetail[0].id,
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
          collectionDetailId: sonoDetail[0].id,
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
          collectionDetailId: sonoDetail[0].id,
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

        // ERA Collection
        const eraDetail = await db.insert(collectionDetails).values({
          collectionId: 2,
          name: "era",
          bannerImage: "/img/banner01.png",
          bannerTitle: "Заголовок баннера",
          bannerDescription: "Описание баннера",
          bannerLinkText: "Какой-то текст",
          bannerLinkUrl: "/"
        }).returning({ id: collectionDetails.id });

        // ERA Sections Type 1
        await db.insert(collectionSections1).values([
          {
            collectionDetailId: eraDetail[0].id,
            title: "Смесители для раковины",
            description: "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
            linkText: "Посмотреть",
            linkUrl: "/",
            order: 1
          }
        ]);

        // ERA Section Type 2
        const eraSection2 = await db.insert(collectionSections2).values({
          collectionDetailId: eraDetail[0].id,
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
          collectionDetailId: eraDetail[0].id,
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
          collectionDetailId: eraDetail[0].id,
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

    // Аналогично добавляем секции типа 3 и 4 для SONO
    // И создаем такую же структуру для коллекции ERA
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
