"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateAboutSection, getAboutPageData, deleteAboutSection } from "@/app/actions/about"

export default function AboutSectionsAdminPage() {
  const [sections, setSections] = useState<Array<{
    id: number;
    title: string;
    description: string;
    order: number;
  }>>([])

  useEffect(() => {
    const loadData = async () => {
      const data = await getAboutPageData()
      if (data.sections) {
        setSections(data.sections)
      }
    }
    loadData()
  }, [])

  const handleSave = async () => {
    for (const section of sections) {
      const result = await updateAboutSection(section.id, {
        title: section.title,
        description: section.description,
        order: section.order
      })

      if (result.success) {
        console.log('Секция успешно обновлена')
      }
    }
  }

  const handleDelete = async (id: number) => {
    const result = await deleteAboutSection(id)
    if (result.success) {
      setSections(sections.filter(section => section.id !== id))
      console.log('Секция успешно удалена')
    }
  }

  const handleSectionChange = (index: number, field: string, value: string | number) => {
    setSections((prev) => {
      const newSections = [...prev]
      newSections[index] = { ...newSections[index], [field]: value }
      return newSections
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование секций О компании</h1>
      {sections.map((section, index) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>Секция {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`title-${index}`}>Заголовок</Label>
              <Input
                id={`title-${index}`}
                value={section.title}
                onChange={(e) => handleSectionChange(index, "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`description-${index}`}>Описание</Label>
              <Textarea
                id={`description-${index}`}
                value={section.description}
                onChange={(e) => handleSectionChange(index, "description", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`order-${index}`}>Порядок</Label>
              <Input
                id={`order-${index}`}
                type="number"
                value={section.order}
                onChange={(e) => handleSectionChange(index, "order", parseInt(e.target.value))}
              />
            </div>
            <Button variant="destructive" onClick={() => handleDelete(section.id)}>
              Удалить секцию
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSave}>Сохранить изменения</Button>
    </div>
  )
}

