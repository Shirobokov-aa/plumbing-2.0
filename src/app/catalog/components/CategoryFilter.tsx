"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Category } from "../types"

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams)
    if (currentCategory === slug) {
      params.delete("category")
    } else {
      params.set("category", slug)
    }
    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="font-medium text-lg">Категории</h2>
      <div className="space-y-2">
        <Button
          variant={!currentCategory ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleCategoryClick("")}
        >
          Все товары
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.slug ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleCategoryClick(category.slug)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
