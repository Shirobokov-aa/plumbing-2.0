ALTER TABLE "collection_pages" ALTER COLUMN "hero_image" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_pages" ADD COLUMN "banner_image" text;