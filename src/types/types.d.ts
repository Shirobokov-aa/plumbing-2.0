interface Category {
  id: number
  name: string
  slug: string
  description?: string
  order: number
}

interface ProductVariant {
  id: number
  name: string
  value: string
  available: boolean
}

interface ProductImage {
  id: number
  src: string
  alt?: string
  order: number
}

interface Product {
  id: number
  categoryId: number
  name: string
  slug: string
  description?: string
  article?: string
  specifications?: Record<string, any>
  order: number
  images: ProductImage[]
  variants: ProductVariant[]
}
