"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { getCollectionPreviews, deleteCollectionPreview } from "@/app/actions/collections"
import { useRouter } from "next/navigation"

type Collection = {
  id: number
  image: string
  link: string
  title: string
  desc: string
  flexDirection: string
}

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState<Collection[]>([])
  const router = useRouter()

  useEffect(() => {
    const loadCollections = async () => {
      const { collections: data } = await getCollectionPreviews()
      if (data) setCollections(data)
    }
    loadCollections()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту коллекцию?')) {
      const response = await deleteCollectionPreview(id)
      if (response.success) {
        router.refresh()
      } else {
        console.error('Ошибка при удалении:', response.error)
      }
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление коллекциями</h1>
        <Link href="/admin/collections/add">
          <Button>Добавить коллекцию</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-6">
        {collections?.map((collection) => (
          <Card key={collection.id} className="w-full lg:w-[30%]">
            <CardHeader>
              <CardTitle>{collection.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video relative">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <p className="text-gray-600">{collection.desc}</p>
              <div className="flex justify-end space-x-2">
                <Link href={`/admin/collections/edit/${collection.id}`}>
                  <Button variant="outline">Редактировать</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(collection.id)}
                >
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

