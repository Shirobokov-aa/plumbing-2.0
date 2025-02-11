"use client"

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./ImageUpload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SectionFieldsProps {
  type: "section1" | "section2" | "section3" | "section4"
  index: number
  control: any
  remove: () => void
}

export function SectionFields({ type, index, control, remove }: SectionFieldsProps) {
  const basePath = `${type}s.${index}`

  return (
    <Card className="relative mb-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={remove}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle>Секция {type.replace("section", "")} - {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name={`${basePath}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${basePath}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Дополнительные поля для section2 */}
        {type === "section2" && (
          <>
            <FormField
              control={control}
              name={`${basePath}.titleDesc`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительный заголовок</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${basePath}.descriptionDesc`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительное описание</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {/* Поля для ссылок (кроме section4) */}
        {type !== "section4" && (
          <>
            <FormField
              control={control}
              name={`${basePath}.linkText`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текст ссылки</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`${basePath}.linkUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL ссылки</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={control}
          name={`${basePath}.order`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Порядок</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <ImageUpload
          name={`${basePath}.images`}
          control={control}
          label="Изображения секции"
        />
      </CardContent>
    </Card>
  )
}
