"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { deleteCategory } from "@/app/actions/categories-admin"
import type { Category } from "@/app/catalog/types"

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories: initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories)

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      const result = await deleteCategory(id)
      if (result.success) {
        setCategories(categories.filter(category => category.id !== id))
      }
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Порядок</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.order}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/admin/catalog/categories/${category.id}`}>
                    <Button variant="outline" size="sm">
                      Редактировать
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
