CREATE TABLE "collection_previews" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"desc" varchar(1000) NOT NULL,
	"link" varchar(255) NOT NULL,
	"flex_direction" varchar(50) NOT NULL
);
