"use client"

import Image from "next/image"
import { useState } from "react"
import type { ProductImage } from "../types"

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Проверяем наличие изображений
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Изображение отсутствует</span>
      </div>
    )
  }

  // Убеждаемся, что у нас есть действительные изображения
  const validImages = images.filter(img => img && img.src)

  if (validImages.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Изображение отсутствует</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-square w-full relative rounded-lg overflow-hidden">
        <Image
          src={validImages[selectedImage]?.src || ''}
          alt={validImages[selectedImage]?.alt || productName}
          fill
          className="object-cover"
          priority
        />
      </div>

      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {validImages.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square relative rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-black' : ''
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
