"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSections } from "../../contexts/SectionsContext"
import Image from "next/image"

export default function Section5Admin() {
  const { sections, updateSection } = useSections()
  const [sectionData, setSectionData] = useState(sections["section-5"])

  useEffect(() => {
    setSectionData(sections["section-5"])
  }, [sections])

  const handleSave = () => {
    updateSection("section-5", sectionData)
    console.log("Изменения сохранены:", sectionData)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSectionData((prev) => {
          const newImagesBlock = [...(prev.images_block || [])]
          newImagesBlock[index] = {
            ...newImagesBlock[index],
            src: reader.result as string,
          }
          return { ...prev, images_block: newImagesBlock }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageDataChange = (index: number, field: "alt" | "desc", value: string) => {
    setSectionData((prev) => {
      const newImagesBlock = [...(prev.images_block || [])]
      newImagesBlock[index] = {
        ...newImagesBlock[index],
        [field]: value,
      }
      return { ...prev, images_block: newImagesBlock }
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование Секции 5</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Заголовок</Label>
          <Input
            id="title"
            value={sectionData.title || ""}
            onChange={(e) => setSectionData((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={sectionData.description || ""}
            onChange={(e) => setSectionData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="linkName">Текст ссылки</Label>
          <Input
            id="linkName"
            value={sectionData.link?.name || ""}
            onChange={(e) => setSectionData(prev => ({
              ...prev,
              link: { name: e.target.value, url: prev.link?.url || "" }
            }))}
          />
        </div>
        <div>
          <Label htmlFor="linkUrl">URL ссылки</Label>
          <Input
            id="linkUrl"
            value={sectionData.link?.url || ""}
            onChange={(e) => setSectionData(prev => ({
              ...prev,
              link: { name: prev.link?.name || "", url: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Изображения блока</Label>
          <div className="grid grid-cols-3 gap-4">
            {sectionData.images_block?.map((image, index) => (
              <div key={index} className="space-y-2 border p-4 rounded">
                <Image
                  width={300}
                  height={300}
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-40 object-contain"
                />
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                <Input
                  placeholder="Alt текст"
                  value={image.alt || ""}
                  onChange={(e) => handleImageDataChange(index, "alt", e.target.value)}
                />
                <Input
                  placeholder="Описание"
                  value={image.desc || ""}
                  onChange={(e) => handleImageDataChange(index, "desc", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}