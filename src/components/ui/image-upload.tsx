"use client"

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ImagePlus, Trash } from 'lucide-react'
import { uploadImage } from '@/app/actions/upload'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove?: (value: string) => void
  value?: string
  className?: string
  height?: number
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
  className = "",
  height = 200
}: ImageUploadProps) {
  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadImage(formData)
      if (result.error) {
        console.error('Upload error:', result.error)
        return
      }
      if (result.url) {
        onChange(result.url)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }, [onChange])

  return (
    <div className={className}>
      <div className="mb-4 flex items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => document.getElementById('imageInput')?.click()}
          disabled={disabled}
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          Загрузить изображение
        </Button>
        {value && onRemove && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => onRemove(value)}
            disabled={disabled}
          >
            <Trash className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        )}
      </div>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      {value && (
        <div className="relative" style={{ height: `${height}px` }}>
          <Image
            src={value}
            alt="Uploaded image"
            className="object-contain"
            fill
          />
        </div>
      )}
    </div>
  )
}
