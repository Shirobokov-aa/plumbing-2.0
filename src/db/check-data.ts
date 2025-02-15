import { db } from "@/db"
import { collectionPreviews, collectionDetails } from "./schema"

async function checkData() {
  try {
    console.log('Проверяем данные в таблицах...\n')

    // Проверяем превью коллекций
    const previews = await db.select().from(collectionPreviews)
    console.log('Collection Previews:')
    previews.forEach(preview => {
      console.log({
        id: preview.id,
        title: preview.title,
        link: preview.link,
        image: preview.image,
        desc: preview.desc,
        flexDirection: preview.flexDirection
      })
    })

    console.log('\n-------------------\n')

    // Проверяем детальные страницы
    const details = await db.select().from(collectionDetails)
    console.log('Collection Details:')
    details.forEach(detail => {
      console.log({
        id: detail.id,
        name: detail.name,
        bannerTitle: detail.bannerTitle,
        bannerImage: detail.bannerImage,
        bannerLinkUrl: detail.bannerLinkUrl
      })
    })

  } catch (error) {
    console.error('Ошибка при проверке данных:', error)
  }
}

checkData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
