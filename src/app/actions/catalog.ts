'use server'

import { db } from "@/db"
import { products, productCategories, productImages, productVariants } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq, sql } from "drizzle-orm"

// Получение категорий
export async function getCategories (): Promise<Category[]> {
  try {
    const categories = await db.select().from(productCategories)
      .orderBy(productCategories.order)
    return categories
  } catch (error) {
    console.error('Error getting categories:', error)
    return []
  }
}

interface GetProductsParams {
  page?: number
  filters?: string[]
  search?: string
}

// Получение продуктов
export async function getProducts({ page = 1, search }: GetProductsParams) {
  try {
    const itemsPerPage = 6
    const offset = (page - 1) * itemsPerPage

    const query = db.query.products.findMany({
      with: {
        images: true,
        variants: true,
        category: true
      },
      limit: itemsPerPage,
      offset,
      orderBy: [products.order],
      where: search ? sql`name ILIKE ${`%${search}%`}` : undefined
    })

    const [productsData, totalCount] = await Promise.all([
      query,
      db.select({ count: sql<number>`count(*)` }).from(products)
    ])

    return {
      products: productsData.map(product => ({
        ...product,
        images: product.images.map(image => ({
          ...image,
          src: `/images/catalog/${image.src}` // Добавляем префикс пути
        })).sort((a, b) => a.order - b.order),
        variants: product.variants
      })),
      totalCount: totalCount[0]?.count || 0,
      currentPage: page,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / itemsPerPage)
    }
  } catch (error) {
    console.error('Error getting products:', error)
    return { products: [], totalCount: 0, currentPage: 1, totalPages: 0 }
  }
}

// Получение деталей продукта
export async function getProductDetails(slug: string) {
  try {
    const [product] = await db.select().from(products)
      .where(eq(products.slug, slug))

    if (!product) {
      return null
    }

    const images = await db.select().from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.order)

    const variants = await db.select().from(productVariants)
      .where(eq(productVariants.productId, product.id))

    return {
      ...product,
      images,
      variants
    }
  } catch (error) {
    console.error('Error getting product details:', error)
    return null
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        images: true,
        variants: true
      }
    })

    if (!product) return null

    return {
      ...product,
      images: product.images.sort((a, b) => a.order - b.order),
      variants: product.variants
    }
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

export async function createProduct(data: {
  categoryId: number
  name: string
  slug: string
  description?: string
  article?: string
  specifications?: Record<string, string>
  price: number
  order: number
  images: { src: string; alt: string; order: number }[]
  variants?: { name: string; value: string; available: boolean }[]
}) {
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
          src: image.src.replace('/images/catalog/', ''), // Убираем префикс при сохранении
          alt: image.alt,
          order: image.order
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
