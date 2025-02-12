import { db } from "@/db"
import { collectionPreviews, collectionDetails } from "./schema"

async function checkMigration() {
  try {
    console.log('Проверяем синхронизацию ID...\n')

    const previews = await db.select().from(collectionPreviews)
    const details = await db.select().from(collectionDetails)

    console.log(`Количество превью: ${previews.length}`)
    console.log(`Количество деталей: ${details.length}`)

    for (const preview of previews) {
      const detail = details.find(d => d.id === preview.id)
      console.log('\nПревью:', preview.id)
      console.log('Ссылка превью:', preview.link)

      if (!detail) {
        console.log(`❌ Не найдена детальная страница для превью ${preview.id}`)
      } else {
        console.log('Ссылка детальной:', detail.bannerLinkUrl)
        console.log(`✅ ID ${preview.id}: превью и детальная страница синхронизированы`)
      }
    }
  } catch (error) {
    console.error('Ошибка при проверке:', error)
  }
}

checkMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
