import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'

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
