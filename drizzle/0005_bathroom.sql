CREATE TABLE IF NOT EXISTS "bathroom_banner" (
  "id" serial PRIMARY KEY,
  "name" text,
  "title" text,
  "description" text,
  "image" text,
  "link_text" varchar,
  "link_url" varchar,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bathroom_sections" (
  "id" serial PRIMARY KEY,
  "title" text,
  "description" text,
  "link_text" varchar,
  "link_url" varchar,
  "order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bathroom_collections" (
  "id" serial PRIMARY KEY,
  "title" text,
  "description" text,
  "link_text" varchar,
  "link_url" varchar,
  "order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bathroom_images" (
  "id" serial PRIMARY KEY,
  "section_id" integer REFERENCES "bathroom_sections"("id") ON DELETE CASCADE,
  "collection_id" integer REFERENCES "bathroom_collections"("id") ON DELETE CASCADE,
  "src" text NOT NULL,
  "alt" varchar,
  "order" integer DEFAULT 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
