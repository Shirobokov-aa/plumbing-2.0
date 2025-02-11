"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { insertCollectionDetailSchema } from "@/db/schema"
import { createCollectionDetail, updateCollectionDetail } from "@/app/actions/collection-detail"
import { useRouter } from "next/navigation"
import type { CollectionDetail } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionFields } from "./SectionFields"
import type { z } from "zod"

interface CollectionDetailFormProps {
  initialData?: CollectionDetail
  action: "add" | "edit"
}

export type FormData = z.infer<typeof insertCollectionDetailSchema>

export function CollectionDetailForm({ initialData, action }: CollectionDetailFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(insertCollectionDetailSchema),
    defaultValues: initialData || {
      name: "",
      bannerImage: "",
      bannerTitle: "",
      bannerDescription: "",
      bannerLinkText: "",
      bannerLinkUrl: "",
      sections1: [],
      sections2: [],
      sections3: [],
      sections4: [],
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields: section1Fields, append: appendSection1 } = useFieldArray({
    control: form.control,
    name: "sections1",
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields: section2Fields, append: appendSection2 } = useFieldArray({
    control: form.control,
    name: "sections2",
  })

  // Аналогично для sections3 и sections4

  async function onSubmit(data: FormData) {
    try {
      if (action === "add") {
        await createCollectionDetail(data)
      } else {
        await updateCollectionDetail(initialData!.id, data)
      }
      router.push("/admin/collection-detail")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Поля баннера */}
            <FormField
              control={form.control}
              name="bannerImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение баннера</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Остальные поля баннера */}
          </CardContent>
        </Card>

        <Tabs defaultValue="section1">
          <TabsList>
            <TabsTrigger value="section1">Секция 1</TabsTrigger>
            <TabsTrigger value="section2">Секция 2</TabsTrigger>
            <TabsTrigger value="section3">Секция 3</TabsTrigger>
            <TabsTrigger value="section4">Секция 4</TabsTrigger>
          </TabsList>

          {["section1", "section2", "section3", "section4"].map((sectionType) => (
            <TabsContent key={sectionType} value={sectionType}>
              {(form.watch(`${sectionType}s` as keyof FormData) as any[])?.map((_, index) => (
                <SectionFields
                  key={index}
                  type={sectionType as "section1" | "section2" | "section3" | "section4"}
                  index={index}
                  control={form.control}
                  remove={() => form.setValue(
                    `${sectionType}s` as keyof FormData,
                    (form.getValues(`${sectionType}s` as keyof FormData) || []).filter((_, i) => i !== index)
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue(`${sectionType}s`, [
                  ...form.getValues(`${sectionType}s`),
                  { title: "", description: "", order: form.getValues(`${sectionType}s`).length + 1 }
                ])}
              >
                Добавить секцию {sectionType.replace("section", "")}
              </Button>
            </TabsContent>
          ))}
        </Tabs>

        <Button type="submit">
          {action === "add" ? "Создать" : "Сохранить"}
        </Button>
      </form>
    </Form>
  )
}
