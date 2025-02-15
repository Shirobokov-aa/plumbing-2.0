"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addCollectionPreview } from "@/app/actions/collections"

export default function AddCollectionAdmin() {
  const router = useRouter()
  const [preview, setPreview] = useState({
    image: "",
    title: "",
    desc: "",
    flexDirection: "xl:flex-row" as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    Object.entries(preview).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const response = await addCollectionPreview(formData)

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
      <h1 className="text-3xl font-bold">Добавление новой коллекции (превью)</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Новая коллекция</CardTitle>
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
              onValueChange={(value) => setPreview(prev => ({
                ...prev,
                flexDirection: value as "xl:flex-row" | "xl:flex-row-reverse"
              }))}
              defaultValue={preview.flexDirection}
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
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button type="submit">Добавить коллекцию</Button>
      </div>
    </form>
  )
}

