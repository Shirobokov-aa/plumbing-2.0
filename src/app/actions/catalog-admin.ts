'use server'

import { db } from "@/db"
import { products, productCategories, productImages, productVariants } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

// Создание категории
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

// Создание продукта
export async function createProduct(data: Omit<Product, 'id'>) {
  try {
    const [product] = await db.insert(products).values({
      categoryId: data.categoryId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      article: data.article,
      specifications: data.specifications,
      price: data.price,
      order: data.order
    }).returning()

    if (data.images?.length) {
      await db.insert(productImages).values(
        data.images.map(image => ({
          productId: product.id,
          ...image
        }))
      )
    }

    if (data.variants?.length) {
      await db.insert(productVariants).values(
        data.variants.map(variant => ({
          productId: product.id,
          ...variant
        }))
      )
    }

    revalidatePath('/admin/catalog/products')
    revalidatePath('/catalog')
    return { success: true, productId: product.id }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Ошибка при создании товара' }
  }
}

// Получение продукта для редактирования
export async function getProductForEdit(id: number) {
  try {
    const [product] = await db.select().from(products).where(eq(products.id, id))
    const images = await db.select().from(productImages).where(eq(productImages.productId, id))
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id))

    return {
      ...product,
      images,
      variants
    }
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

// Обновление продукта
export async function updateProduct(
  id: number,
  data: Omit<Product, 'id'> & { categoryId: number | null }
) {
  try {
    await db.transaction(async (tx) => {
      // Обновляем основные данные продукта
      await tx.update(products)
        .set({
          categoryId: data.categoryId,
          name: data.name,
          slug: data.slug,
          description: data.description,
          article: data.article,
          specifications: data.specifications,
          order: data.order
        })
        .where(eq(products.id, id))

      // Удаляем старые изображения и варианты
      await tx.delete(productImages).where(eq(productImages.productId, id))
      await tx.delete(productVariants).where(eq(productVariants.productId, id))

      // Добавляем новые изображения и варианты
      if (data.images.length > 0) {
        await tx.insert(productImages).values(
          data.images.map(img => ({ src: img.src, alt: img.alt, order: img.order, productId: id }))
        )
      }

      if (data.variants.length > 0) {
        await tx.insert(productVariants).values(
          data.variants.map(variant => ({
            name: variant.name,
            value: variant.value,
            available: variant.available,
            productId: id
          }))
        )
      }
    })

    revalidatePath('/admin/catalog/products')
    revalidatePath(`/catalog/${data.slug}`)
    revalidatePath('/catalog')
    return { success: true }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Ошибка при обновлении товара' }
  }
}

// Удаление продукта
export async function deleteProduct(id: number) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(productImages).where(eq(productImages.productId, id))
      await tx.delete(productVariants).where(eq(productVariants.productId, id))
      await tx.delete(products).where(eq(products.id, id))
    })

    revalidatePath('/admin/catalog/products')
    revalidatePath('/catalog')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Ошибка при удалении товара' }
  }
}

export async function getProduct(id: number) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        images: true,
        variants: true,
        category: true
      }
    })
    console.log('Product with images:', JSON.stringify(product, null, 2))
    return product
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}
