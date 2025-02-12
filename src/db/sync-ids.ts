import { db } from "@/db"
import { sql } from "drizzle-orm"

async function syncIds() {
  try {
    console.log('Начинаем синхронизацию ID...')

    // 1. Обновляем ссылки в превью
    await db.execute(sql`
      UPDATE collection_previews
      SET link = CONCAT('/collections/collection-detail/', id)
    `)
    console.log('✅ Ссылки в превью обновлены')

    // 2. Обновляем ссылки в деталях
    await db.execute(sql`
      UPDATE collection_details
      SET banner_link_url = CONCAT('/collections/collection-detail/', id)
    `)
    console.log('✅ Ссылки в деталях обновлены')

    console.log('✅ Синхронизация завершена успешно')

  } catch (error) {
    console.error('❌ Ошибка при синхронизации:', error)
  }
}

syncIds()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
