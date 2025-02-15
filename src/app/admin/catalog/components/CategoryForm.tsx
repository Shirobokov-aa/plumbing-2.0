"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCategory, updateCategory } from "@/app/actions/categories-admin"

interface CategoryFormProps {
  category?: Category
  isEdit?: boolean
}

export function CategoryForm({ category, isEdit }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    order: category?.order || 0
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit && category) {
        const result = await updateCategory(category.id, formData)
        if (result.success) {
          router.push('/admin/catalog/categories')
          router.refresh()
        }
      } else {
        const result = await createCategory(formData)
        if (result.success) {
          router.push('/admin/catalog/categories')
          router.refresh()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Название категории</Label>
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
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="order">Порядок сортировки</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать категорию'}
      </Button>
    </form>
  )
}
