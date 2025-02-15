"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function ProductSpecifications({ specifications, onChange }: ProductSpecificationsProps) {
  const [specs, setSpecs] = useState<Record<string, string>>(specifications || {})

  const handleAdd = () => {
    setSpecs(prev => ({
      ...prev,
      "": ""
    }))
  }

  const handleRemove = (key: string) => {
    const newSpecs = { ...specs }
    delete newSpecs[key]
    setSpecs(newSpecs)
    onChange(newSpecs)
  }

  const handleChange = (oldKey: string, newKey: string, value: string) => {
    const newSpecs = { ...specs }
    if (oldKey !== newKey) {
      delete newSpecs[oldKey]
    }
    newSpecs[newKey] = value
    setSpecs(newSpecs)
    onChange(newSpecs)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Характеристики</Label>
        <Button type="button" onClick={handleAdd} variant="outline">
          Добавить характеристику
        </Button>
      </div>

      {Object.entries(specs).map(([key, value], index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Название"
            value={key}
            onChange={(e) => handleChange(key, e.target.value, value)}
          />
          <Input
            placeholder="Значение"
            value={value}
            onChange={(e) => handleChange(key, key, e.target.value)}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRemove(key)}
          >
            Удалить
          </Button>
        </div>
      ))}
    </div>
  )
}
