"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useFieldArray, Control } from "react-hook-form"
import Image from "next/image"
import { X } from "lucide-react"
import type { FormData } from "./CollectionDetailForm"

interface ImageUploadProps {
  name: string
  control: Control<FormData>
}

export function ImageUpload({ name, control }: ImageUploadProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as `sections${number}.${number}.images`,
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            <FormField
              control={control}
              name={`${name}.${index}.src`}
              render={({ field: imageField }) => (
                <FormItem>
                  <FormLabel>URL изображения {index + 1}</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input {...imageField} />
                      {imageField.value && (
                        <div className="relative w-full h-40">
                          <Image
                            src={imageField.value}
                            alt="Preview"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${name}.${index}.alt`}
              render={({ field: altField }) => (
                <FormItem>
                  <FormLabel>Alt текст</FormLabel>
                  <FormControl>
                    <Input {...altField} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ src: "", alt: "", order: fields.length + 1 })}
      >
        Добавить изображение
      </Button>
    </div>
  )
}
