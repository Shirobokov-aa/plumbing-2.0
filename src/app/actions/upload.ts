'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { mkdir } from 'fs/promises'

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { error: 'Файл не загружен' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя файла
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`

    // Убедимся, что директория существует
    const uploadDir = join(process.cwd(), 'public', 'images', 'catalog')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.log('Directory exists or cannot be created:', error)
    }

    const path = join(uploadDir, uniqueFilename)
    await writeFile(path, buffer)

    return { url: `/images/catalog/${uniqueFilename}` }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { error: 'Ошибка при загрузке файла' }
  }
}
