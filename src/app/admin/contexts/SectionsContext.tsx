"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { updateMainSection, getMainSections } from "@/app/actions/main-sections";
import { getBathroomData } from "@/app/actions/bathroom";
import { getKitchenData } from "@/app/actions/kitchen";

const SectionsContext = createContext<SectionsContextType | undefined>(undefined);

export function SectionsProvider({ children, initialData }: SectionsProviderProps) {
  const [sections, setSections] = useState<SectionsMainPage | null>(null);
  const [bathroomPage, setBathroomPage] = useState<BathroomPage>({
    banner: initialData.banner,
    sections: initialData.sections,
    collections: initialData.collections
  });
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionItem[]>([
    {
      id: 1,
      image: "/img/item-era.png",
      title: "ERA",
      desc: "Коллекция ERA воплощает гармонию современного дизайна и классических традиций...",
      link: "/",
      flexDirection: "xl:flex-row",
    },
    {
      id: 2,
      image: "/img/item01.png",
      title: "AMO",
      desc: "Описание для коллекции AMO",
      link: "/",
      flexDirection: "xl:flex-row-reverse",
    },
    {
      id: 3,
      image: "/img/item02.png",
      title: "TWIST",
      desc: "Описание для коллекции TWIST",
      link: "/",
      flexDirection: "xl:flex-row",
    },
  ]);
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetailData[]>([
    {
      id: 1,
      name: "sono",
      bannerImage: "/img/banner01.png",
      bannerTitle: "Заголовок баннера",
      bannerDescription: "Описание баннера",
      bannerLinkText: "Какой-то текст",
      bannerLinkUrl: "/",
      sections1: [
        {
          title: "Смесители для раковины",
          description: "Our blog covers a wide range of topics...",
          linkText: "Посмотреть",
          linkUrl: "/",
          order: 1,
          images: [
            { src: "/img/item01.png", alt: "Смеситель SONO 1", order: 1 },
            { src: "/img/item02.png", alt: "Смеситель SONO 2", order: 2 },
            { src: "/img/item02.png", alt: "Смеситель SONO 2", order: 3 }
          ]
        }
      ],
      sections2: [
        {
          title: "Смесители для раковины",
          description: "Our blog covers...",
          linkText: "Посмотреть",
          linkUrl: "/",
          titleDesc: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
          descriptionDesc: "A Chic Urban Apartment Trasformation",
          order: 1,
          images: [
            { src: "/img/item01.png", alt: "Смеситель SONO 1", order: 1 }
          ]
        }
      ],
      sections3: [
        {
          title: "Унитазы",
          description: "Welcome to Aesthetics & Co....",
          linkText: "Посмотреть",
          linkUrl: "/",
          order: 1,
          images: [
            { src: "/img/item10.png", alt: "Смеситель SONO 1", order: 1 }
          ]
        }
      ],
      sections4: [
        {
          title: "Унитазы",
          description: "Welcome to Aesthetics & Co....",
          order: 1,
          images: [
            { src: "/img/item10.png", alt: "Смеситель SONO 1", order: 1 },
            { src: "/img/item10.png", alt: "Смеситель SONO 1", order: 2 },
            { src: "/img/item10.png", alt: "Смеситель SONO 1", order: 3 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "era",
      bannerImage: "/img/banner01.png",
      bannerTitle: "Заголовок баннера",
      bannerDescription: "Описание баннера",
      bannerLinkText: "Какой-то текст",
      bannerLinkUrl: "/",
      sections1: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          linkText: "Посмотреть",
          linkUrl: "/",
          images: [],
          order: 1,
        },
        {
          title: "Смесители для ванной и душа",
          description:
            "Step into the world of Aesthetics & Co. through our portfolio of past projects. Each project...",
          linkText: "Посмотреть",
          linkUrl: "/",
          order: 1,
          images: [
            {
              src: "/img/fallback-image.png",
              alt: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
              order: 1
            },
          ],
        },
      ],
      sections2: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          linkText: "Посмотреть",
          linkUrl: "/",
          images: [{ src: "/img/item01.png", alt: "Смеситель SONO 1", order: 1 }],
          titleDesc: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ  И  ДУША",
          descriptionDesc: "A Chic Urban Apartment Trasformation",
          order: 1,
        },
      ],
      sections3: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          linkText: "Посмотреть",
          linkUrl: "/",
          images: [{ src: "/img/item01.png", alt: "Смеситель SONO 1", order: 1 }],
          order: 1,
        },
      ],
      sections4: [
        {
          title: "Унитазы",
          description:
            "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives. ",
          order: 1,
          images: [{ src: "/img/item10.png", alt: "Смеситель SONO 1", order: 1 }],
        },
      ],
    },
  ]);

  const [kitchenPage, setKitchenPage] = useState<KitchenPage>({
    banner: {
      name: "Кухня",
      image: "/img/banner01.png",
      title: "",
      description: "",
      link: { text: "Узнать больше", url: "/kitchen" },
    },
    sections: [
      {
        id: 1,
        title: "Смесители для кухни",
        description: "Комфорт, качество и элегантность для вашей ванной комнаты",
        link: { text: "Смотреть", url: "/kitchen/faucets" },
        order: 1,
        images: [
          { src: "", alt: "Смеситель для кухни 1", order: 1 },
          { src: "", alt: "Смеситель для кухни 2", order: 2 },
          { src: "", alt: "Смеситель для кухни 3", order: 3 },
        ],
      },
      {
        id: 2,
        title: "Аксессуары",
        description: "Детали, которые добавляют удобство и стиль.",
        link: { text: "Смотреть", url: "/kitchen/faucets" },
        order: 2,
        images: [
          { src: "", alt: "Смеситель для кухни 1", order: 1 },
          { src: "", alt: "Смеситель для кухни 2", order: 2 },
          { src: "", alt: "Смеситель для кухни 3", order: 3 },
        ],
      },
      // Добавьте другие секции по необходимости
    ],
    collections: [
      // Добавляем новые данные для коллекций
      {
        id: 1,
        title: "Коллекция для кухни",
        description: "Элегантность и функциональность в каждой детали",
        link: { text: "Подробнее", url: "/kitchen/collections/1" },
        order: 1,
        images: [
          { src: "/img/item01.png", alt: "Коллекция для ванной 1", order: 1 },
          { src: "/img/item02.png", alt: "Коллекция для ванной 2", order: 2 },
          { src: "/img/item03.png", alt: "Коллекция для ванной 3", order: 3 }
        ],
      },
      // Добавьте дополнительные коллекции по необходимости
    ],
  });

  const [aboutPage, setAboutPage] = useState<AboutPage>({
    banner: {
      name: "О Компании",
      image: "/img/banner01.png",
      title: "",
      description: "",
      link: { text: "Посмотреть Коллекции", url: "/collection" },
    },
    sections: [
      {
        title: "О нас",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit i",
      },
    ],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mainData, bathroomData, kitchenData] = await Promise.all([
          getMainSections(),
          getBathroomData(),
          getKitchenData()
        ]);

        setSections(mainData);
        if (bathroomData.banner) {
          setBathroomPage({
            banner: {
              name: bathroomData.banner.name || "",
              image: bathroomData.banner.image || "",
              title: bathroomData.banner.title || "",
              description: bathroomData.banner.description || "",
              linkText: bathroomData.banner.linkText || "",
              linkUrl: bathroomData.banner.linkUrl || "",
              id: bathroomData.banner.id || 1,
              createdAt: bathroomData.banner.createdAt || null,
              updatedAt: bathroomData.banner.updatedAt || null
            },
            sections: bathroomData.sections.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              linkText: section.link.text,
              linkUrl: section.link.url,
              order: section.order,
              createdAt: null,
              updatedAt: null,
              images: section.images.map((img, index) => ({
                id: index + 1,
                src: img.src,
                alt: img.alt,
                order: img.order,
                sectionId: null,
                collectionId: null,
                createdAt: null,
                updatedAt: null
              }))
            })),
            collections: bathroomData.collections
          });
        }
        if (kitchenData.banner) {
          setKitchenPage({
            banner: {
              name: kitchenData.banner.name || "",
              image: kitchenData.banner.image || "",
              title: kitchenData.banner.title || "",
              description: kitchenData.banner.description || "",
              link: kitchenData.banner.link
            },
            sections: kitchenData.sections,
            collections: kitchenData.collections
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateSection = async (sectionKey: string, newData: Section) => {
    try {
      const result = await updateMainSection(sectionKey, newData);
      if (result.success) {
        setSections(prev => ({
          ...prev,
          [sectionKey]: newData
        }));
      } else {
        console.error('Failed to update section:', result.error);
      }
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const updateCollections = (newCollections: CollectionItem[]) => {
    setCollections(newCollections);
  };

  const updateCollectionDetail = (id: number, newData: CollectionDetailData) => {
    setCollectionDetails((prevDetails) => prevDetails.map((detail) => (detail.id === id ? newData : detail)));
  };

  const updateBathroomPage = (data: BathroomPage) => {
    setBathroomPage(data);
  };

  const updateKitchenPage = (newData: KitchenPage) => {
    setKitchenPage(newData);
  };
  const updateAboutPage = (newData: AboutPage) => {
    setAboutPage(newData);
  };

  const value = {
    sections,
    collections,
    collectionDetails,
    bathroomPage,
    kitchenPage,
    aboutPage,
    isLoading,
    updateSection,
    updateCollections,
    updateCollectionDetail,
    updateBathroomPage,
    updateKitchenPage,
    updateAboutPage,
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <SectionsContext.Provider value={value}>
      {children}
    </SectionsContext.Provider>
  );
}

export function useSections() {
  const context = useContext(SectionsContext);
  if (context === undefined) {
    throw new Error("useSections must be used within a SectionsProvider");
  }
  return context;
}
