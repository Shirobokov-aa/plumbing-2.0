import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'

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
