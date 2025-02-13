"use client"

import { useFieldArray, useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { insertCollectionDetailSchema } from "@/db/schema"
import { createCollectionDetail, updateCollectionDetail } from "@/app/actions/collection-detail"
import { useRouter } from "next/navigation"
// import type { CollectionDetail } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionFields } from "./SectionFields"
import type { z } from "zod"
// import Image from "next/image"
import { ImageUpload } from "@/components/ui/image-upload"

interface CollectionDetailFormProps {
  initialData?: {
    id: number;
    name: string;
    bannerImage: string;
    bannerTitle: string;
    bannerDescription: string;
    bannerLinkText: string;
    bannerLinkUrl: string;
    sections1: Array<{
      title: string;
      description: string;
      linkText?: string;
      linkUrl?: string;
      order: number;
      images: Array<{ src: string; alt: string; order: number }>;
    }>;
    sections2: Array<{
      title: string;
      description: string;
      linkText?: string;
      linkUrl?: string;
      titleDesc?: string;
      descriptionDesc?: string;
      order: number;
      images: Array<{ src: string; alt: string; order: number }>;
    }>;
    sections3: Array<{
      title: string;
      description: string;
      linkText?: string;
      linkUrl?: string;
      order: number;
      images: Array<{ src: string; alt: string; order: number }>;
    }>;
    sections4: Array<{
      title: string;
      description: string;
      order: number;
      images: Array<{ src: string; alt: string; order: number }>;
    }>;
  };
  action: "add" | "edit";
}

export type FormData = z.infer<typeof insertCollectionDetailSchema> & {
  [K in 'sections1s' | 'sections2s' | 'sections3s' | 'sections4s']: Array<{
    title: string;
    description: string;
    order: number;
    linkText?: string;
    linkUrl?: string;
    titleDesc?: string;
    descriptionDesc?: string;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
};

// type SectionType = {
//   title: string;
//   description: string;
//   linkText?: string;
//   linkUrl?: string;
//   titleDesc?: string;
//   descriptionDesc?: string;
//   order: number;
//   images: Array<{ src: string; alt: string; order: number }>;
// };

const defaultSection = {
  title: "",
  description: "",
  linkText: "",
  linkUrl: "",
  titleDesc: "",
  descriptionDesc: "",
  order: 0,
  images: []
};

export function CollectionDetailForm({ initialData, action }: CollectionDetailFormProps) {
  const router = useRouter()
  const form = useForm<FormData>({
    defaultValues: {
      name: initialData?.name ?? "",
      bannerImage: initialData?.bannerImage ?? "",
      bannerTitle: initialData?.bannerTitle ?? "",
      bannerDescription: initialData?.bannerDescription ?? "",
      bannerLinkText: initialData?.bannerLinkText ?? "",
      bannerLinkUrl: initialData?.bannerLinkUrl ?? "",
      sections1: initialData?.sections1?.length ? initialData.sections1 : [{ ...defaultSection }],
      sections2: initialData?.sections2?.length ? initialData.sections2 : [{ ...defaultSection }],
      sections3: initialData?.sections3?.length ? initialData.sections3 : [{ ...defaultSection }],
      sections4: initialData?.sections4?.length ? initialData.sections4 : [{ ...defaultSection }]
    }
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

  const onSubmit = async (data: FormData) => {
    try {
      if (action === "edit" && initialData?.id) {
        await updateCollectionDetail(initialData.id, data)
      } else if (action === "add") {
        await createCollectionDetail(data)
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
            <FormField
              control={form.control}
              name="bannerImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображение баннера</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                      height={400}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок баннера</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Введите заголовок баннера" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание баннера</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Введите описание баннера" />
                  </FormControl>
                </FormItem>
              )}
            />
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
              {(form.watch(`${sectionType}s` as keyof FormData) as Array<{
                title: string;
                description: string;
                order: number;
                linkText?: string;
                linkUrl?: string;
                titleDesc?: string;
                descriptionDesc?: string;
                images: Array<{ src: string; alt: string; order: number }>;
              }>)?.map((_, index) => (
                <SectionFields
                  key={index}
                  type={sectionType as "section1" | "section2" | "section3" | "section4"}
                  index={index}
                  control={form.control}
                  remove={() => form.setValue(
                    `${sectionType}s` as keyof FormData,
                    ((form.getValues(`${sectionType}s` as keyof FormData) || []) as Array<{
                      title: string;
                      description: string;
                      order: number;
                      images: Array<{ src: string; alt: string; order: number }>;
                    }>).filter((_, i) => i !== index)
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => form.setValue(`${sectionType}s` as keyof FormData, [
                  ...((form.getValues(`${sectionType}s` as keyof FormData) || []) as Array<{
                    title: string;
                    description: string;
                    order: number;
                    images: Array<{ src: string; alt: string; order: number }>;
                  }>),
                  {
                    title: "",
                    description: "",
                    order: ((form.getValues(`${sectionType}s` as keyof FormData) || []) as Array<{
                      title: string;
                      description: string;
                      order: number;
                      images: Array<{ src: string; alt: string; order: number }>;
                    }>).length + 1,
                    images: []
                  }
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
