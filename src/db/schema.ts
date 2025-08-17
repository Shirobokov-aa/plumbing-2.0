import { integer, pgTable, varchar, timestamp, text, jsonb, boolean } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// Таблица для Hero Section (баннер)
export const heroSection = pgTable("hero_section", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  description: text(),
  buttonText: varchar("button_text", { length: 255 }),
  imageBase64: text("image_base64").notNull(), // Изображение в формате base64
  lang: varchar({ length: 10 }).notNull().default('ru'), // язык контента
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для направлений (directions)
export const directions = pgTable("directions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageBase64: text("image_base64").notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  order: integer("order").default(0),
  lang: varchar("lang", { length: 10 }).notNull().default("ru"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const directionsEn = pgTable("directions_en", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  imageBase64: text("image_base64").notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Временная таблица для разрешения циклических зависимостей
const tempCategories = pgTable("product_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity()
});

// Таблица для категорий продуктов
export const productCategories = pgTable("product_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  parentId: integer("parent_id").references(() => tempCategories.id),
  order: integer("order").default(0),
  lang: varchar("lang", { length: 10 }).notNull().default("ru"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;

// Таблица для коллекций
export const collections = pgTable("collections", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  subTitle: text("sub_title"),
  imageBase64: text("image_base64"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для продуктов (обновленная)
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  article: varchar("article", { length: 100 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  categoryId: integer("category_id").references(() => productCategories.id).notNull(),
  subcategoryId: integer("subcategory_id").references(() => productCategories.id),
  images: jsonb("images").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  isActive: boolean("is_active").default(true),
  lang: varchar("lang", { length: 10 }).notNull().default("ru"),
  collectionId: integer("collection_id").references(() => collections.id),
  crossCollectionId: integer("cross_collection_id").references(() => collections.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для цветов продуктов
export const productColors = pgTable("product_colors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  suffix: varchar("suffix", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Связь между продуктами и цветами (многие-ко-многим)
export const productToColors = pgTable("product_to_colors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").references(() => products.id).notNull(),
  colorId: integer("color_id").references(() => productColors.id).notNull(),
  linkToProduct: varchar("link_to_product", { length: 255 }),
});

// Таблица для характеристик продуктов
export const productCharacteristics = pgTable("product_characteristics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").references(() => products.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для технологий продуктов
export const productTechnologies = pgTable("product_technologies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Связь между продуктами и технологиями (многие-ко-многим)
export const productToTechnologies = pgTable("product_to_technologies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").references(() => products.id).notNull(),
  technologyId: integer("technology_id").references(() => productTechnologies.id).notNull(),
});

// Таблица для технической документации
export const productDocuments = pgTable("product_documents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").references(() => products.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для страниц коллекций
export const collectionPages = pgTable("collection_pages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  collectionId: integer("collection_id").references(() => collections.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  subTitle: text("sub_title"),
  heroImage: text("hero_image"), // Баннер для детальной страницы
  bannerImage: text("banner_image"), // Баннер под заголовком "Вдохновение"
  content: jsonb("content").$type<{
    sections: {
      type: 'banner' | 'text' | 'image';
      title?: string;
      description?: string;
      image?: string;
      layout?: 'left' | 'right' | 'center';
    }[];
  }>(),
  lang: varchar("lang", { length: 10 }).notNull().default("ru"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для страницы бренда
export const brandHeroSection = pgTable("brand_hero_section", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  imageBase64: text("image_base64").notNull(),
  lang: varchar("lang", { length: 10 }).notNull().default("ru"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для основного контента страницы бренда
export const brandContent = pgTable("brand_content", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  lang: varchar("lang", { length: 10 }).notNull().default("ru"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
