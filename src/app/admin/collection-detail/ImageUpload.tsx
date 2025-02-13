"use client"

import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useFieldArray, Control } from "react-hook-form"
import { X } from "lucide-react"
import { ImageUpload as SingleImageUpload } from "@/components/ui/image-upload"
import type { FormData } from "./CollectionDetailForm"

interface ImageUploadProps {
  name: `sections${number}.${number}.images`
  control: Control<FormData>
}

export function ImageUpload({ name, control }: ImageUploadProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
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
                  <FormLabel>Изображение {index + 1}</FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      value={imageField.value}
                      onChange={imageField.onChange}
                      className="w-full"
                      height={200}
                    />
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
                    <input {...altField} className="w-full p-2 border rounded" />
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
