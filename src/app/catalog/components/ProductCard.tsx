import Image from "next/image"
import Link from "next/link"
import type { Product } from "../types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0]

  return (
    <Link href={`/catalog/${product.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
        {mainImage && (
          <Image
            src={mainImage.src}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}
      </div>

      <div>
        <h3 className="text-sm mb-2 leading-tight">
          {product.name}
        </h3>

        {product.variants.length > 0 && (
          <div className="flex gap-1">
            {product.variants.map((variant) => (
              <div
                key={variant.id}
                className="w-6 h-6 rounded-sm border border-gray-200"
                style={{ backgroundColor: variant.value }}
                title={variant.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
