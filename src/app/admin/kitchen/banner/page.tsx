"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { updateKitchenBanner } from "@/app/actions/kitchen"

export default function KitchenBannerAdminPage() {
  const [banner, setBanner] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    linkText: "",
    linkUrl: ""
  })

  const handleSave = async () => {
    const result = await updateKitchenBanner({
      name: banner.name,
      title: banner.title,
      description: banner.description,
      image: banner.image,
      linkText: banner.linkText,
      linkUrl: banner.linkUrl
    })

    if (result.success) {
      console.log('Баннер успешно обновлен')
    }
  }

  const handleChange = (field: string, value: string) => {
    setBanner((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование баннера</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input id="name" value={banner.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="title">Заголовок</Label>
          <Input id="title" value={banner.title} onChange={(e) => handleChange("title", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={banner.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="linkText">Текст ссылки</Label>
          <Input id="linkText" value={banner.linkText} onChange={(e) => handleChange("linkText", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="linkUrl">URL ссылки</Label>
          <Input id="linkUrl" value={banner.linkUrl} onChange={(e) => handleChange("linkUrl", e.target.value)} />
        </div>
        <div>
          <Label>Изображение баннера</Label>
          <Image src={banner.image || "/placeholder.svg"} alt="Banner" width={300} height={150} className="mt-2" />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                  handleChange("image", reader.result as string)
                }
                reader.readAsDataURL(file)
              }
            }}
            className="mt-2"
          />
        </div>
      </div>
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}

