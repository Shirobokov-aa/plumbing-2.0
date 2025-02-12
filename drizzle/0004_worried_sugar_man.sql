CREATE TABLE "collection_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer,
	"name" text NOT NULL,
	"banner_image" text NOT NULL,
	"banner_title" text NOT NULL,
	"banner_description" text NOT NULL,
	"banner_link_text" text NOT NULL,
	"banner_link_url" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "collection_section_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"section_type" text NOT NULL,
	"src" text NOT NULL,
	"alt" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_sections_1" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_detail_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link_text" text NOT NULL,
	"link_url" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_sections_2" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_detail_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link_text" text NOT NULL,
	"link_url" text NOT NULL,
	"title_desc" text NOT NULL,
	"description_desc" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_sections_3" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_detail_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link_text" text NOT NULL,
	"link_url" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_sections_4" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_detail_id" integer,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_details" ADD CONSTRAINT "collection_details_collection_id_collection_previews_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collection_previews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_sections_1" ADD CONSTRAINT "collection_sections_1_collection_detail_id_collection_details_id_fk" FOREIGN KEY ("collection_detail_id") REFERENCES "public"."collection_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_sections_2" ADD CONSTRAINT "collection_sections_2_collection_detail_id_collection_details_id_fk" FOREIGN KEY ("collection_detail_id") REFERENCES "public"."collection_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_sections_3" ADD CONSTRAINT "collection_sections_3_collection_detail_id_collection_details_id_fk" FOREIGN KEY ("collection_detail_id") REFERENCES "public"."collection_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_sections_4" ADD CONSTRAINT "collection_sections_4_collection_detail_id_collection_details_id_fk" FOREIGN KEY ("collection_detail_id") REFERENCES "public"."collection_details"("id") ON DELETE no action ON UPDATE no action;