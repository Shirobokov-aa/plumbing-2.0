"use client"

import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useFieldArray, Control, useFormContext } from "react-hook-form"
import { X } from "lucide-react"
import { ImageUpload as SingleImageUpload } from "@/components/ui/image-upload"

interface ImageUploadProps {
  name: `sections1.${number}.images` | `sections2.${number}.images` | `sections3.${number}.images` | `sections4.${number}.images`
  control: Control<CollectionDetailInput>
}

export function ImageUpload({ name, control }: ImageUploadProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })
  const form = useFormContext()

  const handleImageChange = (index: number, value: string) => {
    const field = fields[index]
    if (field) {
      field.src = value
    }
  }

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
                      onChange={(value) => {
                        imageField.onChange(value)
                        form.setValue(`${name}.${index}.src`, value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                        handleImageChange(index, value)
                      }}
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
                    <input
                      {...altField}
                      className="w-full p-2 border rounded"
                      onChange={(e) => {
                        altField.onChange(e)
                        field.alt = e.target.value
                      }}
                    />
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
