"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { getCollections } from "@/app/actions/collections"
import { useSections } from "../contexts/SectionsContext"

export default function CollectionsAdmin() {
  const { collections, updateCollections } = useSections()

  useEffect(() => {
    const fetchCollections = async () => {
      const { collections: fetchedCollections } = await getCollections()
      if (fetchedCollections) {
        updateCollections(fetchedCollections)
      }
    }

    fetchCollections()
  }, [updateCollections])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление коллекциями</h1>
        <Link href="/admin/collections/add">
          <Button>Добавить коллекцию</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {collections.map((collection) => (
          <Card key={collection.id}>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

