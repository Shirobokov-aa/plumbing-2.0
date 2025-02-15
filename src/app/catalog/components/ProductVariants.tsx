"use client"

import { useState } from "react"
import type { ProductVariant } from "../types"

interface ProductVariantsProps {
  variants: ProductVariant[]
  onSelect?: (variant: ProductVariant) => void
}

export function ProductVariants({ variants, onSelect }: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const handleSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    onSelect?.(variant)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Доступные цвета</h3>
      <div className="flex gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => handleSelect(variant)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedVariant?.id === variant.id
                ? "border-black"
                : "border-gray-200"
            }`}
            style={{ backgroundColor: variant.value }}
            title={variant.name}
          />
        ))}
      </div>
    </div>
  )
}
