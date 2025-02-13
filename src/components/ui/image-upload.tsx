"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "./button"
import { Upload, X } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  className?: string
  height?: number
}

export function ImageUpload({ value, onChange, className, height = 200 }: ImageUploadProps) {
  const [preview, setPreview] = useState(value)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          onChange(base64String)
          setPreview(base64String)
        }
        reader.readAsDataURL(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  })

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      {preview ? (
        <div className="relative w-full h-full">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => {
              onChange("")
              setPreview("")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="w-full h-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Перетащите изображение сюда или кликните для выбора
          </p>
        </div>
      )}
    </div>
  )
}
