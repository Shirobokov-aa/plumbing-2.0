"use client"

import { ProductCard } from "./ProductCard"

// Компонент пустой карточки
function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-[300px] rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  )
}

export function ProductGrid({ products }: ProductGridProps) {
  // Создаем массив из 6 скелетонов с уникальными ключами
  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <ProductCardSkeleton key={`skeleton-${index}`} />
  ))

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length === 0 && skeletons}
    </div>
  )
}
