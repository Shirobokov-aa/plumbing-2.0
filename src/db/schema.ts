import { pgTable, integer, text, jsonb, varchar } from 'drizzle-orm/pg-core';

export const sectionsTable = pgTable('sections', {
  id: integer('id').primaryKey().notNull(),
  key: text('key').notNull(),
  data: jsonb('data').notNull()
});

export const collectionsTable = pgTable('collections', {
  id: integer('id').primaryKey().notNull(),
  data: jsonb('data').notNull()
});


export const collectionDetailsTable = pgTable('collection_details', {
  id: integer('id').primaryKey().notNull(),
  data: jsonb('data').notNull()
});

export const bathroomPageTable = pgTable('bathroom_page', {
  id: integer('id').primaryKey().notNull(),
  data: jsonb('data').notNull()
});

export const kitchenPageTable = pgTable('kitchen_page', {
  id: integer('id').primaryKey().notNull(),
  data: jsonb('data').notNull()
});

export const aboutPageTable = pgTable('about_page', {
  id: integer('id').primaryKey().notNull(),
  data: jsonb('data').notNull()
});

export const usersTable = pgTable('users', {
  id: integer('id').primaryKey().notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user')
});
