"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface ProductFiltersProps {
  activeFilters: string[]
  totalProducts: number
}

const AVAILABLE_FILTERS = [
  { id: 'kitchen', label: 'Смесители для кухни' },
  { id: 'bath', label: 'Смесители для ванной' },
  // Добавьте другие фильтры по необходимости
]

export function ProductFilters({ activeFilters, totalProducts }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const toggleFilter = (filterId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentFilters = params.get('filters')?.split(',') || []

    let newFilters: string[]
    if (currentFilters.includes(filterId)) {
      newFilters = currentFilters.filter(f => f !== filterId)
    } else {
      newFilters = [...currentFilters, filterId]
    }

    if (newFilters.length > 0) {
      params.set('filters', newFilters.join(','))
    } else {
      params.delete('filters')
    }

    // Сбрасываем страницу при изменении фильтров
    params.delete('page')

    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 border rounded-full text-sm hover:bg-gray-50"
        >
          Фильтры
        </button>

        {AVAILABLE_FILTERS.map(filter => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`px-4 py-2 border rounded-full text-sm ${
              activeFilters.includes(filter.id)
                ? 'bg-black text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-2 text-sm text-gray-500">
        {totalProducts} товара
      </div>
    </div>
  )
}
