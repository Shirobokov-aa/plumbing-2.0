"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { getSlides, updateSlide } from "@/app/actions/slider"

interface Slide {
  id: number
  desktopImage: string
  mobileImage: string
  title: string
  linkUrl: string
  order: number
}

export default function SliderAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([])

  useEffect(() => {
    const loadData = async () => {
      const data = await getSlides()
      if (data.length > 0) {
        setSlides(data)
      }
    }
    loadData()
  }, [])

  const handleSave = async () => {
    for (const slide of slides) {
      const result = await updateSlide(slide.id, {
        desktopImage: slide.desktopImage,
        mobileImage: slide.mobileImage,
        title: slide.title,
        linkUrl: slide.linkUrl,
        order: slide.order
      })

      if (result.success) {
        console.log('Слайд успешно обновлен')
      }
    }
  }

  const handleSlideChange = (index: number, field: string, value: string | number) => {
    setSlides((prev) => {
      const newSlides = [...prev]
      newSlides[index] = { ...newSlides[index], [field]: value }
      return newSlides
    })
  }

  const handleImageChange = async (index: number, field: 'desktopImage' | 'mobileImage', file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      handleSlideChange(index, field, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление слайдером</h1>
        <Button onClick={handleSave}>Сохранить все изменения</Button>
      </div>

      <div className="grid gap-6">
        {slides.map((slide, index) => (
          <Card key={slide.id}>
            <CardHeader>
              <CardTitle>Слайд {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Десктопное изображение</Label>
                  <div className="mt-2 relative h-[200px]">
                    <Image
                      src={slide.desktopImage}
                      alt={`Слайд ${index + 1} десктоп`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageChange(index, 'desktopImage', file)
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Мобильное изображение</Label>
                  <div className="mt-2 relative h-[200px]">
                    <Image
                      src={slide.mobileImage}
                      alt={`Слайд ${index + 1} мобильный`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageChange(index, 'mobileImage', file)
                      }
                    }}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`title-${index}`}>Заголовок</Label>
                <Input
                  id={`title-${index}`}
                  value={slide.title}
                  onChange={(e) => handleSlideChange(index, "title", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`linkUrl-${index}`}>URL ссылки</Label>
                <Input
                  id={`linkUrl-${index}`}
                  value={slide.linkUrl}
                  onChange={(e) => handleSlideChange(index, "linkUrl", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`order-${index}`}>Порядок</Label>
                <Input
                  id={`order-${index}`}
                  type="number"
                  value={slide.order}
                  onChange={(e) => handleSlideChange(index, "order", parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
