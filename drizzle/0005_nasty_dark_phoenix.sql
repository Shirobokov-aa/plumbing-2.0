CREATE TABLE "about_banner" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"title" text,
	"description" text,
	"image" text,
	"link_text" varchar,
	"link_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "about_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bathroom_banner" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"title" text,
	"description" text,
	"image" text,
	"link_text" varchar,
	"link_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bathroom_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"link_text" varchar,
	"link_url" varchar,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bathroom_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer,
	"collection_id" integer,
	"src" text NOT NULL,
	"alt" varchar,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bathroom_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"link_text" varchar,
	"link_url" varchar,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kitchen_banner" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"title" text,
	"description" text,
	"image" text,
	"link_text" varchar,
	"link_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kitchen_collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"link_text" varchar,
	"link_url" varchar,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kitchen_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer,
	"collection_id" integer,
	"src" text NOT NULL,
	"alt" varchar,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kitchen_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"link_text" varchar,
	"link_url" varchar,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "main_section_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer,
	"src" text NOT NULL,
	"alt" varchar,
	"description" text,
	"url" varchar,
	"is_main" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "main_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" varchar NOT NULL,
	"title" text,
	"description" text,
	"link_name" varchar,
	"link_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "collection_details" DROP CONSTRAINT "collection_details_collection_id_collection_previews_id_fk";
--> statement-breakpoint
ALTER TABLE "collection_details" ALTER COLUMN "banner_link_text" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_details" ALTER COLUMN "banner_link_text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_details" ALTER COLUMN "banner_link_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_details" ALTER COLUMN "banner_link_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_sections_1" ALTER COLUMN "link_text" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_sections_1" ALTER COLUMN "link_text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_sections_1" ALTER COLUMN "link_url" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "collection_sections_1" ALTER COLUMN "link_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bathroom_images" ADD CONSTRAINT "bathroom_images_section_id_bathroom_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."bathroom_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bathroom_images" ADD CONSTRAINT "bathroom_images_collection_id_bathroom_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."bathroom_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kitchen_images" ADD CONSTRAINT "kitchen_images_section_id_kitchen_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."kitchen_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kitchen_images" ADD CONSTRAINT "kitchen_images_collection_id_kitchen_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."kitchen_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main_section_images" ADD CONSTRAINT "main_section_images_section_id_main_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."main_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_details" DROP COLUMN "collection_id";