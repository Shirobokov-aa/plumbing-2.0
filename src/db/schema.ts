import { integer, pgTable, varchar, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

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
