import { db } from "@/db"
import {
  collectionSectionImages,
  collectionSections1,
  collectionSections2,
  collectionSections3,
  collectionSections4,
  collectionDetails,
  collectionPreviews
} from "./schema"

async function clearTables() {
  try {
    console.log('Начинаем очистку таблиц...')

    // 1. Сначала удаляем зависимые таблицы
    await db.delete(collectionSectionImages)
    console.log('Очищена таблица collectionSectionImages')

    await db.delete(collectionSections1)
    await db.delete(collectionSections2)
    await db.delete(collectionSections3)
    await db.delete(collectionSections4)
    console.log('Очищены таблицы секций')

    // 2. Удаляем детальные страницы
    await db.delete(collectionDetails)
    console.log('Очищена таблица collectionDetails')

    // 3. Удаляем превью
    await db.delete(collectionPreviews)
    console.log('Очищена таблица collectionPreviews')

    console.log('Все таблицы успешно очищены')
  } catch (error) {
    console.error('Ошибка при очистке таблиц:', error)
  }
}

clearTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
