"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCollectionPreview, updateCollectionPreview } from "@/app/actions/collections"

type Preview = {
  image: string
  title: string
  desc: string
  flexDirection: "xl:flex-row" | "xl:flex-row-reverse"
  link: string
}

export default function EditCollectionPreview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [preview, setPreview] = useState<Preview>({
    image: "",
    title: "",
    desc: "",
    flexDirection: "xl:flex-row",
    link: ""
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPreview = async () => {
      const { collection } = await getCollectionPreview(Number(resolvedParams.id))
      if (collection) {
        setPreview({
          image: collection.image,
          title: collection.title,
          desc: collection.desc,
          flexDirection: collection.flexDirection as "xl:flex-row" | "xl:flex-row-reverse",
          link: collection.link
        })
        setLoading(false)
      }
    }
    loadPreview()
  }, [resolvedParams.id])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await updateCollectionPreview(Number(resolvedParams.id), preview)

    if (response.success) {
      router.push('/admin/collections')
      router.refresh()
    } else {
      console.error('Ошибка:', response.error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(prev => ({
          ...prev,
          image: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование коллекции (превью)</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Редактировать коллекцию</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Заголовок</Label>
            <Input
              value={preview.title}
              onChange={(e) => setPreview(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea
              value={preview.desc}
              onChange={(e) => setPreview(prev => ({ ...prev, desc: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label>Направление flex</Label>
            <Select
              value={preview.flexDirection}
              onValueChange={(value) => setPreview(prev => ({
                ...prev,
                flexDirection: value as "xl:flex-row" | "xl:flex-row-reverse"
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите направление" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xl:flex-row">Слева направо</SelectItem>
                <SelectItem value="xl:flex-row-reverse">Справа налево</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Изображение</Label>
            <div className="space-y-2">
              {preview.image && (
                <Image
                  width={300}
                  height={300}
                  src={preview.image}
                  alt="Предпросмотр"
                  className="w-full h-40 object-contain"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button type="submit">Сохранить изменения</Button>
      </div>
    </form>
  )
}

