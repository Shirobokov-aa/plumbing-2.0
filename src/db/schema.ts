import { integer, pgTable, varchar, jsonb, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

const linkSchema = z.object({
  text: z.string(),
  url: z.string(),
});

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  desc: z.string().optional(),
});

const bannerSchema = z.object({
  image: z.string(),
  title: z.string(),
  description: z.string(),
  link: linkSchema,
});

const sectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: linkSchema,
  images: z.array(imageSchema),
  titleDesc: z.string().optional(),
  descriptionDesc: z.string().optional(),
});

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  banner: jsonb("banner").notNull(),
  sections: jsonb("sections").notNull(),
  sections2: jsonb("sections2").notNull(),
  sections3: jsonb("sections3").notNull(),
  sections4: jsonb("sections4").notNull(),
});

export const insertCollectionSchema = createInsertSchema(collections, {
  banner: bannerSchema,
  sections: z.array(sectionSchema),
  sections2: z.array(sectionSchema),
  sections3: z.array(sectionSchema),
  sections4: z.array(sectionSchema),
});

export const selectCollectionSchema = createSelectSchema(collections, {
  banner: bannerSchema,
  sections: z.array(sectionSchema),
  sections2: z.array(sectionSchema),
  sections3: z.array(sectionSchema),
  sections4: z.array(sectionSchema),
});

export type Collection = InferSelectModel<typeof collections>
export type NewCollection = InferInsertModel<typeof collections>

// Таблица для превью коллекций
export const collectionPreviews = pgTable("collection_previews", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  desc: varchar("desc", { length: 1000 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  flexDirection: varchar("flex_direction", { length: 50 }).notNull()
})

// Схемы для Zod валидации
export const insertPreviewSchema = createInsertSchema(collectionPreviews)
export const selectPreviewSchema = createSelectSchema(collectionPreviews)

// Типы
export type CollectionPreview = InferSelectModel<typeof collectionPreviews>
export type NewCollectionPreview = InferInsertModel<typeof collectionPreviews>


// ДЕТАЛЬНАЯ СТРАНИЦА КОЛЛЕКЦИИ

// Основная таблица детальной страницы коллекции
export const collectionDetails = pgTable('collection_details', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  bannerImage: text('banner_image').notNull(),
  bannerTitle: text('banner_title').notNull(),
  bannerDescription: text('banner_description').notNull(),
  bannerLinkText: text('banner_link_text').default(''),
  bannerLinkUrl: text('banner_link_url').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Секции типа 1 (стандартные секции)
export const collectionSections1 = pgTable('collection_sections_1', {
  id: serial('id').primaryKey(),
  collectionDetailId: integer('collection_detail_id').references(() => collectionDetails.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  linkText: text('link_text').default(''),
  linkUrl: text('link_url').default(''),
  order: integer('order').notNull()
});

// Секции типа 2 (с дополнительным описанием)
export const collectionSections2 = pgTable('collection_sections_2', {
  id: serial('id').primaryKey(),
  collectionDetailId: integer('collection_detail_id').references(() => collectionDetails.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  linkText: text('link_text').notNull(),
  linkUrl: text('link_url').notNull(),
  titleDesc: text('title_desc').notNull(),
  descriptionDesc: text('description_desc').notNull(),
  order: integer('order').notNull(),
})

// Секции типа 3 (с большим отступом для описания)
export const collectionSections3 = pgTable('collection_sections_3', {
  id: serial('id').primaryKey(),
  collectionDetailId: integer('collection_detail_id').references(() => collectionDetails.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  linkText: text('link_text').notNull(),
  linkUrl: text('link_url').notNull(),
  order: integer('order').notNull(),
})

// Секции типа 4 (без ссылки)
export const collectionSections4 = pgTable('collection_sections_4', {
  id: serial('id').primaryKey(),
  collectionDetailId: integer('collection_detail_id').references(() => collectionDetails.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull(),
})

// Изображения для всех типов секций
export const collectionSectionImages = pgTable('collection_section_images', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').notNull(),
  sectionType: text('section_type').notNull(), // 'section1', 'section2', 'section3', 'section4'
  src: text('src').notNull(),
  alt: text('alt').notNull(),
  order: integer('order').notNull(),
})

// Типы для детальной страницы коллекции
export type CollectionDetail = InferSelectModel<typeof collectionDetails>
export type NewCollectionDetail = InferInsertModel<typeof collectionDetails> & {
  sections1: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections2: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    titleDesc: string;
    descriptionDesc: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections3: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections4: Array<{
    title: string;
    description: string;
    order: number;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
};

// Типы для секций
export type Section1 = InferSelectModel<typeof collectionSections1>
export type NewSection1 = InferInsertModel<typeof collectionSections1>

export type Section2 = InferSelectModel<typeof collectionSections2>
export type NewSection2 = InferInsertModel<typeof collectionSections2>

export type Section3 = InferSelectModel<typeof collectionSections3>
export type NewSection3 = InferInsertModel<typeof collectionSections3>

export type Section4 = InferSelectModel<typeof collectionSections4>
export type NewSection4 = InferInsertModel<typeof collectionSections4>

// Тип для изображений секций
export type SectionImage = InferSelectModel<typeof collectionSectionImages>
export type NewSectionImage = InferInsertModel<typeof collectionSectionImages>

// Добавим схемы для секций с изображениями
const sectionImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  order: z.number(),
});

// Обновим схему для детальной страницы
export const insertCollectionDetailSchema = createInsertSchema(collectionDetails).extend({
  sections1: z.array(z.object({
    title: z.string(),
    description: z.string(),
    linkText: z.string(),
    linkUrl: z.string(),
    order: z.number(),
    images: z.array(sectionImageSchema),
  })),
  sections2: z.array(z.object({
    title: z.string(),
    description: z.string(),
    linkText: z.string(),
    linkUrl: z.string(),
    titleDesc: z.string(),
    descriptionDesc: z.string(),
    order: z.number(),
    images: z.array(sectionImageSchema),
  })),
  sections3: z.array(z.object({
    title: z.string(),
    description: z.string(),
    linkText: z.string(),
    linkUrl: z.string(),
    order: z.number(),
    images: z.array(sectionImageSchema),
  })),
  sections4: z.array(z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    images: z.array(sectionImageSchema),
  })),
});

export const selectCollectionDetailSchema = createSelectSchema(collectionDetails)

export const insertSection1Schema = createInsertSchema(collectionSections1)
export const insertSection2Schema = createInsertSchema(collectionSections2)
export const insertSection3Schema = createInsertSchema(collectionSections3)
export const insertSection4Schema = createInsertSchema(collectionSections4)
export const insertSectionImageSchema = createInsertSchema(collectionSectionImages)


// MAIN PAGE

export const mainSections = pgTable('main_sections', {
  id: serial('id').primaryKey(),
  sectionKey: varchar('section_key').notNull(), // section-1, section-2, etc.
  title: text('title'),
  description: text('description'),
  linkName: varchar('link_name'),
  linkUrl: varchar('link_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const mainSectionImages = pgTable('main_section_images', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => mainSections.id, { onDelete: 'cascade' }),
  src: text('src').notNull(),
  alt: varchar('alt'),
  desc: text('description'),
  url: varchar('url'),
  isMain: boolean('is_main').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Добавляем relations
export const mainSectionsRelations = relations(mainSections, ({ many }) => ({
  images: many(mainSectionImages)
}))

export const mainSectionImagesRelations = relations(mainSectionImages, ({ one }) => ({
  section: one(mainSections, {
    fields: [mainSectionImages.sectionId],
    references: [mainSections.id],
  })
}))

export type MainSection = typeof mainSections.$inferSelect
export type NewMainSection = typeof mainSections.$inferInsert
export type MainSectionImage = typeof mainSectionImages.$inferSelect
export type NewMainSectionImage = typeof mainSectionImages.$inferInsert

// BATHROOM PAGE
export const bathroomBanner = pgTable('bathroom_banner', {
  id: serial('id').primaryKey(),
  name: text('name'),
  title: text('title'),
  description: text('description'),
  image: text('image'),
  linkText: varchar('link_text'),
  linkUrl: varchar('link_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const bathroomSections = pgTable('bathroom_sections', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  linkText: varchar('link_text'),
  linkUrl: varchar('link_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const bathroomCollections = pgTable('bathroom_collections', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  linkText: varchar('link_text'),
  linkUrl: varchar('link_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const bathroomImages = pgTable('bathroom_images', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => bathroomSections.id, { onDelete: 'cascade' }),
  collectionId: integer('collection_id').references(() => bathroomCollections.id, { onDelete: 'cascade' }),
  src: text('src').notNull(),
  alt: varchar('alt'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations для ванной
export const bathroomSectionsRelations = relations(bathroomSections, ({ many }) => ({
  images: many(bathroomImages, {
    fields: [bathroomSections.id],
    references: [bathroomImages.sectionId],
  })
}))

export const bathroomCollectionsRelations = relations(bathroomCollections, ({ many }) => ({
  images: many(bathroomImages, {
    fields: [bathroomCollections.id],
    references: [bathroomImages.collectionId],
  })
}))

export const bathroomImagesRelations = relations(bathroomImages, ({ one }) => ({
  section: one(bathroomSections, {
    fields: [bathroomImages.sectionId],
    references: [bathroomSections.id],
  }),
  collection: one(bathroomCollections, {
    fields: [bathroomImages.collectionId],
    references: [bathroomCollections.id],
  })
}))

// Types
export type BathroomSection = typeof bathroomSections.$inferSelect & {
  images: typeof bathroomImages.$inferSelect[]
}

export type BathroomCollection = typeof bathroomCollections.$inferSelect & {
  images: typeof bathroomImages.$inferSelect[]
}

export type BathroomBanner = typeof bathroomBanner.$inferSelect
export type NewBathroomBanner = typeof bathroomBanner.$inferInsert

export type BathroomImage = typeof bathroomImages.$inferSelect
export type NewBathroomImage = typeof bathroomImages.$inferInsert

// Таблицы для страницы кухни
export const kitchenBanner = pgTable('kitchen_banner', {
  id: serial('id').primaryKey(),
  name: text('name'),
  title: text('title'),
  description: text('description'),
  image: text('image'),
  linkText: varchar('link_text'),
  linkUrl: varchar('link_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const kitchenSections = pgTable('kitchen_sections', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  linkText: varchar('link_text'),
  linkUrl: varchar('link_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const kitchenCollections = pgTable('kitchen_collections', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  linkText: varchar('link_text'),
  linkUrl: varchar('link_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const kitchenImages = pgTable('kitchen_images', {
  id: serial('id').primaryKey(),
  sectionId: integer('section_id').references(() => kitchenSections.id, { onDelete: 'cascade' }),
  collectionId: integer('collection_id').references(() => kitchenCollections.id, { onDelete: 'cascade' }),
  src: text('src').notNull(),
  alt: varchar('alt'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations для кухни
export const kitchenSectionsRelations = relations(kitchenSections, ({ many }) => ({
  images: many(kitchenImages, {
    fields: [kitchenSections.id],
    references: [kitchenImages.sectionId],
  })
}))

export const kitchenCollectionsRelations = relations(kitchenCollections, ({ many }) => ({
  images: many(kitchenImages, {
    fields: [kitchenCollections.id],
    references: [kitchenImages.collectionId],
  })
}))

export const kitchenImagesRelations = relations(kitchenImages, ({ one }) => ({
  section: one(kitchenSections, {
    fields: [kitchenImages.sectionId],
    references: [kitchenSections.id],
  }),
  collection: one(kitchenCollections, {
    fields: [kitchenImages.collectionId],
    references: [kitchenCollections.id],
  })
}))
