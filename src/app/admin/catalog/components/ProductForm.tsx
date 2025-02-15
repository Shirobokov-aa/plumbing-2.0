"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, updateProduct } from "@/app/actions/catalog-admin"
import { ProductSpecifications } from "./ProductSpecifications"
import Image from "next/image"

interface ProductFormProps {
  categories: Category[]
  product?: Product
  isEdit?: boolean
}

export function ProductForm({ categories, product, isEdit }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    categoryId: product?.categoryId || categories[0]?.id || null,
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || null,
    article: product?.article || null,
    specifications: product?.specifications || {},
    order: product?.order || 0,
    images: product?.images || [],
    variants: product?.variants || [],
    price: product?.price || 0,
    createdAt: product?.createdAt || null,
    updatedAt: product?.updatedAt || null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit && product) {
        const result = await updateProduct(product.id, formData)
        if (result.success) {
          router.push('/admin/catalog/products')
        }
      } else {
        const result = await createProduct(formData)
        if (result.success) {
          router.push('/admin/catalog/products')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const tempImage: ProductImage = {
        id: -Date.now(), // Временный отрицательный ID
        src: '/temporary-url',
        order: formData.images.length,
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, tempImage]
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="category">Категория</Label>
        <select
          id="category"
          value={formData.categoryId || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
          className="w-full p-2 border rounded"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="name">Название</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">URL (slug)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="article">Артикул</Label>
        <Input
          id="article"
          value={formData.article || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, article: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="price">Цена</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            price: parseInt(e.target.value)
          }))}
          required
        />
      </div>

      <ProductSpecifications
        specifications={formData.specifications}
        onChange={(specs) => setFormData(prev => ({
          ...prev,
          specifications: specs
        }))}
      />

      <div>
        <Label>Изображения</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div className="grid grid-cols-4 gap-4 mt-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image.src}
                alt=""
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  images: prev.images.filter((_, i) => i !== index)
                }))}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Варианты (цвета)</Label>
        <div className="space-y-2">
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={variant.name}
                onChange={(e) => {
                  const newVariants = [...formData.variants]
                  newVariants[index] = { ...variant, name: e.target.value }
                  setFormData(prev => ({ ...prev, variants: newVariants }))
                }}
                placeholder="Название цвета"
              />
              <Input
                type="color"
                value={variant.value}
                onChange={(e) => {
                  const newVariants = [...formData.variants]
                  newVariants[index] = { ...variant, value: e.target.value }
                  setFormData(prev => ({ ...prev, variants: newVariants }))
                }}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    variants: prev.variants.filter((_, i) => i !== index)
                  }))
                }}
              >
                Удалить
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                variants: [...prev.variants, { name: '', value: '#000000', available: true }]
              }))
            }}
          >
            Добавить цвет
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать товар'}
      </Button>
    </form>
  )
}
