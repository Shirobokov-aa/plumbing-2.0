"use client"

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./ImageUpload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Control } from "react-hook-form"

type SectionFieldsProps = {
  type: "section1" | "section2" | "section3" | "section4"
  index: number
  control: Control<CollectionDetailInput>
  remove: () => void
}

export function SectionFields({ type, index, control, remove }: SectionFieldsProps) {
  const fieldName = type === "section1" ? "sections1" :
                   type === "section2" ? "sections2" :
                   type === "section3" ? "sections3" : "sections4"

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
        <CardTitle className="flex justify-between">
          <span>Секция {index + 1}</span>
          <Button variant="destructive" size="sm" onClick={remove}>
            Удалить
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name={`${fieldName}.${index}.title`}
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
          name={`${fieldName}.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {type === "section2" && (
          <>
            <FormField
              control={control}
              name={`${fieldName}.${index}.titleDesc` as `sections2.${number}.titleDesc`}
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
              name={`${fieldName}.${index}.descriptionDesc` as `sections2.${number}.descriptionDesc`}
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

        {type !== "section4" && (
          <>
            <FormField
              control={control}
              name={`${fieldName}.${index}.linkText` as `sections1.${number}.linkText`}
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
              name={`${fieldName}.${index}.linkUrl` as `sections1.${number}.linkUrl`}
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
          name={`${fieldName}.${index}.order` as `${typeof fieldName}.${number}.order`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Порядок</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
            </FormItem>
          )}
        />

        <ImageUpload
          name={`${fieldName}.${index}.images` as `${typeof fieldName}.${number}.images`}
          control={control}
        />
      </CardContent>
    </Card>
  )
}
