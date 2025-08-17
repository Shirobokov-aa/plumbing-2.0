// Типы для работы с каталогом продуктов
import { CollectionPage } from "./types";

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  order: number;
  lang: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductColor {
  id: number;
  name: string;
  code: string; // HEX код цвета
  suffix: string; // Суффикс для артикула (например, "CH" для хрома)
  linkToProduct?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCharacteristic {
  id: number;
  productId: number;
  name: string;
  value: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductTechnology {
  id: number;
  name: string;
  title: string;
  description?: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductDocument {
  id: number;
  productId: number;
  name: string;
  type: string;
  fileUrl: string;
  fileSize: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Интерфейс для коллекций
export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  subTitle: string | null;
  imageBase64: string | null;
  heroImage?: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  pages?: CollectionPage[];
}

// Полный объект для отображения продукта
export interface Product {
  id: number;
  name: string;
  article: string;
  description?: string | null;
  price: number;
  categoryId: number;
  subcategoryId?: number | null;
  images: (string | ProductImage)[];
  featured: boolean;
  isActive: boolean;
  lang: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Тип для изображения продукта
export interface ProductImage {
  url: string;
  colorId: number | null;
}

// Тип для продукта с дополнительной информацией
export interface ProductWithDetails extends Product {
  category?: ProductCategory;
  subcategory?: ProductCategory;
  colors?: ProductColor[];
  characteristics?: ProductCharacteristic[];
  technologies?: ProductTechnology[];
  documents?: ProductDocument[];
  collection?: Collection;
  crossCollection?: Collection;
  productToColors?: {
    colorId: number;
    linkToProduct: string | null;
  }[];
}


// Параметры для запроса продуктов с фильтрацией
export interface ProductsQueryParams {
  categoryId?: number;
  subcategoryId?: number;
  categorySlug?: string;
  subcategorySlug?: string;
  featured?: boolean;
  lang?: string;
  limit?: number;
  offset?: number;
}

// Результат запроса со списком продуктов
export interface ProductsQueryResult {
  products: ProductWithDetails[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
