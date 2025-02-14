"use client";

import type React from "react";
import { createContext, useState, useContext } from "react";
import { updateMainSection } from "@/app/actions/main-sections";

export interface ImageBlockData {
  src: string;
  alt?: string;
  desc?: string;
  url?: string;
}

interface Section {
  title?: string;
  description?: string;
  link?: {
    name?: string;
    url?: string;
  };
  images_block?: ImageBlockData[];
  images?: string[];
}

interface SectionsMainPage {
  [key: string]: Section;
}

interface BathroomSection {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}

interface KitchenSection {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}
interface AboutSection {
  title: string;
  description: string;
  // link: { text: string; url: string };
  // images: ImageBlockData[];
}

interface BathroomPage {
  banner: {
    name: string;
    image: string;
    title: string;
    description: string;
    link: { text: string; url: string };
  };
  sections: BathroomSection[];
  collections: BathroomCollection[];
}

interface KitchenPage {
  banner: {
    name: string;
    image: string;
    title: string;
    description: string;
    link: { text: string; url: string };
  };
  sections: KitchenSection[];
  collections: KitchenCollection[];
}

interface AboutPage {
  banner: {
    name: string;
    image: string;
    title: string;
    description: string;
    link: { text: string; url: string };
  };
  sections: AboutSection[];
  // collections: KitchenCollection[]
}

export interface BathroomCollection {
  id: number;
  title: string;
  description: string;
  link: {
    text: string;
    url: string;
  };
  images: ImageBlockData[];
  order?: number;
}

interface KitchenCollection {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}

export interface CollectionItem {
  id: number; // Убедимся, что id имеет тип number
  image: string;
  title: string;
  desc: string;
  link: string;
  flexDirection: "xl:flex-row" | "xl:flex-row-reverse";
}

export interface CollectionDetail {
  id: number;
  name: string;
  banner: {
    image: string;
    title: string;
    description: string;
    link: { text: string; url: string };
  };
  sections: {
    title: string;
    description: string;
    link: { text: string; url: string };
    images: ImageBlockData[];
  }[];
  sections2: {
    title: string;
    description: string;
    link: { text: string; url: string };
    images: ImageBlockData[];
    titleDesc: string;
    descriptionDesc: string;
  }[];
  sections3: {
    title: string;
    description: string;
    link: { text: string; url: string };
    images: ImageBlockData[];
  }[];
  sections4: {
    title: string;
    description: string;
    // link: { text: string; url: string };
    images: ImageBlockData[];
  }[];
}

interface SectionsContextType {
  sections: SectionsMainPage;
  collections: CollectionItem[];
  collectionDetails: CollectionDetail[];
  bathroomPage: BathroomPage;
  kitchenPage: KitchenPage;
  aboutPage: AboutPage;
  updateSection: (sectionKey: string, newData: Section) => void;
  updateCollections: (newCollections: CollectionItem[]) => void;
  updateCollectionDetail: (id: number, newData: CollectionDetail) => void;
  updateBathroomPage: (data: BathroomPage) => void;
  updateKitchenPage: (newData: KitchenPage) => void;
  updateAboutPage: (newData: AboutPage) => void;
}

const SectionsContext = createContext<SectionsContextType | undefined>(undefined);

export function SectionsProvider({ children, initialData }: { children: React.ReactNode, initialData: BathroomPage }) {
  const [sections, setSections] = useState<SectionsMainPage>({});
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
  const [collectionDetails, setCollectionDetails] = useState<CollectionDetail[]>([
    {
      id: 1,
      name: "sono",
      banner: {
        image: "/img/banner01.png",
        title: "Заголовок баннера",
        description: "Описание баннера",
        link: { text: "Какой-то текст", url: "/" },
      },
      sections: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          link: { text: "Посмотреть", url: "/" },
          images: [
            { src: "/img/item01.png", alt: "Смеситель SONO 1" },
            { src: "/img/item02.png", alt: "Смеситель SONO 2" },
            { src: "/img/item02.png", alt: "Смеситель SONO 2" },
          ],
        },
        {
          title: "Смесители для ванной и душа",
          description:
            "Step into the world of Aesthetics & Co. through our portfolio of past projects. Each project...",
          link: { text: "Посмотреть", url: "/" },
          images: [
            {
              src: "/img/item-era.png",
              alt: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
            },
            {
              src: "/img/item-era.png",
              alt: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
            },
            {
              src: "/img/item-era.png",
              alt: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
            },
          ],
        },
      ],
      sections2: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          link: { text: "Посмотреть", url: "/" },
          images: [{ src: "/img/item01.png", alt: "Смеситель SONO 1" }],
          titleDesc: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ  И  ДУША",
          descriptionDesc: "A Chic Urban Apartment Trasformation",
        },
      ],
      sections3: [
        {
          title: "Унитазы",
          description:
            "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives. ",
          link: { text: "Посмотреть", url: "/" },
          images: [{ src: "/img/item10.png", alt: "Смеситель SONO 1" }],
        },
      ],
      sections4: [
        {
          title: "Унитазы",
          description:
            "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives. ",
          // link: { text: "Посмотреть", url: "/" },
          images: [
            { src: "/img/item10.png", alt: "Смеситель SONO 1" },
            { src: "/img/item10.png", alt: "Смеситель SONO 1" },
            { src: "/img/item10.png", alt: "Смеситель SONO 1" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "era",
      banner: {
        image: "/img/banner01.png",
        title: "Заголовок баннера",
        description: "Описание баннера",
        link: { text: "Какой-то текст", url: "/" },
      },
      sections: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          link: { text: "Посмотреть", url: "/" },
          images: [],
        },
        {
          title: "Смесители для ванной и душа",
          description:
            "Step into the world of Aesthetics & Co. through our portfolio of past projects. Each project...",
          link: { text: "Посмотреть", url: "/" },
          images: [
            {
              src: "/img/fallback-image.png",
              alt: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ И ДУША",
              desc: "A Chic Urban Apartment Trasformation",
            },
          ],
        },
      ],
      sections2: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          link: { text: "Посмотреть", url: "/" },
          images: [{ src: "/img/item01.png", alt: "Смеситель SONO 1" }],
          titleDesc: "СМЕСИТЕЛЬ ДЛЯ ВАННЫ  И  ДУША",
          descriptionDesc: "A Chic Urban Apartment Trasformation",
        },
      ],
      sections3: [
        {
          title: "Смесители для раковины",
          description:
            "Our blog covers a wide range of topics, including design inspiration, practical advice for home improvement recommendations and more.",
          link: { text: "Посмотреть", url: "/" },
          images: [{ src: "/img/item01.png", alt: "Смеситель SONO 1" }],
        },
      ],
      sections4: [
        {
          title: "Унитазы",
          description:
            "Welcome to Aesthetics & Co., where we believe in the power of exceptional design to transform spaces and enhance lives. ",
          // link: { text: "Посмотреть", url: "/" },
          images: [{ src: "/img/item10.png", alt: "Смеситель SONO 1" }],
        },
      ],
    },
  ]);

  const [bathroomPage, setBathroomPage] = useState(() => ({
    banner: initialData?.banner || {},
    sections: initialData?.sections || [],
    collections: initialData?.collections || []
  }));

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
        title: "Смесители для кухни",
        description: "Комфорт, качество и элегантность для вашей ванной комнаты",
        link: { text: "Смотреть", url: "/kitchen/faucets" },
        images: [
          { src: "", alt: "Смеситель для кухни 1" },
          { src: "", alt: "Смеситель для кухни 2" },
          { src: "", alt: "Смеситель для кухни 3" },
        ],
      },
      {
        title: "Аксессуары",
        description: "Детали, которые добавляют удобство и стиль.",
        link: { text: "Смотреть", url: "/kitchen/faucets" },
        images: [
          { src: "", alt: "Смеситель для кухни 1" },
          { src: "", alt: "Смеситель для кухни 2" },
          { src: "", alt: "Смеситель для кухни 3" },
        ],
      },
      // Добавьте другие секции по необходимости
    ],
    collections: [
      // Добавляем новые данные для коллекций
      {
        title: "Коллекция для кухни",
        description: "Элегантность и функциональность в каждой детали",
        link: { text: "Подробнее", url: "/kitchen/collections/1" },
        images: [
          { src: "/img/item01.png", alt: "Коллекция для ванной 1" },
          { src: "/img/item02.png", alt: "Коллекция для ванной 2" },
          { src: "/img/item03.png", alt: "Коллекция для ванной 3" },
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

  const updateSection = async (sectionKey: string, data: Section) => {
    const result = await updateMainSection(sectionKey, data);
    if (result.success) {
      setSections(prev => ({
        ...prev,
        [sectionKey]: data
      }));
    }
    return result;
  };

  const updateCollections = (newCollections: CollectionItem[]) => {
    setCollections(newCollections);
  };

  const updateCollectionDetail = (id: number, newData: CollectionDetail) => {
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

  return (
    <SectionsContext.Provider
      value={{
        sections,
        collections,
        collectionDetails,
        bathroomPage,
        kitchenPage,
        aboutPage,
        updateSection,
        updateCollections,
        updateCollectionDetail,
        updateBathroomPage,
        updateKitchenPage,
        updateAboutPage,
      }}
    >
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
