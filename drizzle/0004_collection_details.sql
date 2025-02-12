CREATE TABLE "collection_details" (
  "id" serial PRIMARY KEY,
  "collection_id" integer REFERENCES "collection_previews"("id"),
  "name" text NOT NULL,
  "banner_image" text NOT NULL,
  "banner_title" text NOT NULL,
  "banner_description" text NOT NULL,
  "banner_link_text" text NOT NULL,
  "banner_link_url" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "collection_sections_1" (
  "id" serial PRIMARY KEY,
  "collection_detail_id" integer REFERENCES "collection_details"("id"),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "link_text" text NOT NULL,
  "link_url" text NOT NULL,
  "order" integer NOT NULL
);

CREATE TABLE "collection_sections_2" (
  "id" serial PRIMARY KEY,
  "collection_detail_id" integer REFERENCES "collection_details"("id"),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "link_text" text NOT NULL,
  "link_url" text NOT NULL,
  "title_desc" text NOT NULL,
  "description_desc" text NOT NULL,
  "order" integer NOT NULL
);

CREATE TABLE "collection_sections_3" (
  "id" serial PRIMARY KEY,
  "collection_detail_id" integer REFERENCES "collection_details"("id"),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "link_text" text NOT NULL,
  "link_url" text NOT NULL,
  "order" integer NOT NULL
);

CREATE TABLE "collection_sections_4" (
  "id" serial PRIMARY KEY,
  "collection_detail_id" integer REFERENCES "collection_details"("id"),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "order" integer NOT NULL
);

CREATE TABLE "collection_section_images" (
  "id" serial PRIMARY KEY,
  "section_id" integer NOT NULL,
  "section_type" text NOT NULL,
  "src" text NOT NULL,
  "alt" text NOT NULL,
  "order" integer NOT NULL
);
