import { sql } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

export async function up(db: PostgresJsDatabase) {
  // 1. Создаем временную таблицу
  await db.execute(sql`
    CREATE TABLE collection_details_new (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      banner_image TEXT NOT NULL,
      banner_title TEXT NOT NULL,
      banner_description TEXT NOT NULL,
      banner_link_text TEXT NOT NULL,
      banner_link_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // 2. Копируем данные, используя id из collection_previews
  await db.execute(sql`
    INSERT INTO collection_details_new (
      id, name, banner_image, banner_title,
      banner_description, banner_link_text, banner_link_url,
      created_at, updated_at
    )
    SELECT
      cp.id, cd.name, cd.banner_image, cd.banner_title,
      cd.banner_description, cd.banner_link_text, cd.banner_link_url,
      cd.created_at, cd.updated_at
    FROM collection_details cd
    JOIN collection_previews cp ON cd.collection_id = cp.id
  `)

  // 3. Удаляем старую таблицу
  await db.execute(sql`DROP TABLE collection_details`)

  // 4. Переименовываем новую таблицу
  await db.execute(sql`ALTER TABLE collection_details_new RENAME TO collection_details`)

  // 5. Обновляем ссылки в превью
  await db.execute(sql`
    UPDATE collection_previews
    SET link = CONCAT('/collections/collection-detail/', id)
  `)

  // 6. Обновляем ссылки в деталях
  await db.execute(sql`
    UPDATE collection_details
    SET banner_link_url = CONCAT('/collections/collection-detail/', id)
  `)
}

export async function down(db: PostgresJsDatabase) {
  // Откат изменений (если потребуется)
  await db.execute(sql`
    ALTER TABLE collection_details
    ADD COLUMN collection_id INTEGER REFERENCES collection_previews(id)
  `)
}
