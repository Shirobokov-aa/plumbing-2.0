// Типы для объектов меню
export type MenuItem = {
  title: string
  href?: string
  children?: MenuItem[]
}

// Типы для словаря направлений
export interface DirectionItem {
  title: string;
  description: string;
}

export interface DirectionsDictionary {
  directions: {
    title: string;
    bathroom: DirectionItem;
    kitchen: DirectionItem;
    collections: DirectionItem;
    details: string;
  };
}

// Типы для словаря Footer и навигации
export interface NavigationDictionary {
  navigation: {
    about: string;
    contacts: string;
    warranty: string;
    wheretobuy: string;
  };
  categories: {
    bathroom: string;
    kitchen: string;
    collection: string;
  };
  footer: {
    social: string;
    language: string;
  };
}

// Типы для словаря меню
export interface MenuDictionary {
  menu: {
    products: string;
    bathroom: {
      title: string;
      sink_mixers: string;
      bath_shower_mixers: string;
      shower_systems: string;
      toilets: string;
    };
    kitchen: {
      title: string;
      kitchen_mixers: string;
      accessories: string;
      dispensers: string;
    };
    collections: string;
    about: string;
    warranty_service: string;
    where_to_buy: string;
    contacts: string;
    close: string;
    close_menu: string;
    open_menu: string;
  };
}

// Полный словарь, объединяющий все типы
export interface Dictionary extends DirectionsDictionary, NavigationDictionary, MenuDictionary {}

export interface Product {
  id: number;
  name: string;
  images: string[];
  colors: { code: string; name: string }[];
  price: number;
  category: string;
  subcategory: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  parent?: string;
}

// Типы для коллекций
export interface CollectionSection {
  type: 'banner' | 'text' | 'image';
  title?: string;
  description?: string;
  image?: string;
  layout?: 'left' | 'right' | 'center';
}

export interface CollectionPage {
  id: number;
  collectionId: number;
  title: string;
  description: string | null;
  subTitle: string | null;
  heroImage: string | null;
  bannerImage: string | null;
  content: {
    sections: CollectionSection[];
  };
  lang: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  subTitle: string | null;
  imageBase64: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  pages?: CollectionPage[];
}

// Типы для страницы бренда
export interface BrandHeroSection {
  id: number;
  imageBase64: string;
  lang: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type BrandHeroSectionFormData = {
  title?: string;
  description?: string;
  buttonText?: string;
  imageBase64: string;
  lang: string;
};

export interface BrandContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  lang: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export type BrandContentFormData = {
  title: string;
  subtitle: string;
  description: string;
  lang: string;
};
