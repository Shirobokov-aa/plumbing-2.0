'use server'

import { db } from "@/db"
import { productCategories } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  order: number
}) {
  try {
    await db.insert(productCategories).values(data)
    revalidatePath('/admin/catalog/categories')
    revalidatePath('/catalog')
    return { success: true }
  } catch (error) {
    console.error('Error creating category:', error)
    return { success: false, error: 'Ошибка при создании категории' }
  }
}

export async function updateCategory(id: number, data: {
  name: string
  slug: string
  description?: string
  order: number
}) {
  try {
    await db.update(productCategories)
      .set(data)
      .where(eq(productCategories.id, id))

    revalidatePath('/admin/catalog/categories')
    revalidatePath('/catalog')
    return { success: true }
  } catch (error) {
    console.error('Error updating category:', error)
    return { success: false, error: 'Ошибка при обновлении категории' }
  }
}

export async function deleteCategory(id: number) {
  try {
    await db.delete(productCategories)
      .where(eq(productCategories.id, id))

    revalidatePath('/admin/catalog/categories')
    revalidatePath('/catalog')
    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Ошибка при удалении категории' }
  }
}
