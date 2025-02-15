import type React from "react"
import { Sidebar } from "./components/sidebar"
import { SectionsProvider } from "./contexts/SectionsContext"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { getBathroomPageData } from "@/db/bathroom"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Если нет сессии, показываем только содержимое (форму входа)
  if (!session) {
    return <>{children}</>
  }

  // Получаем данные для инициализации
  const data = await getBathroomPageData()

  const initialData = {
    banner: data.banner,
    sections: data.sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description,
      linkText: section.link.text,
      linkUrl: section.link.url,
      order: section.order,
      createdAt: null,
      updatedAt: null,
      images: section.images.map((img, index) => ({
        id: index + 1,
        src: img.src,
        alt: img.alt,
        order: img.order,
        sectionId: null,
        collectionId: null,
        createdAt: null,
        updatedAt: null
      }))
    })),
    collections: data.collections
  }

  // Если есть сессия, показываем сайдбар и содержимое
  return (
    <SectionsProvider initialData={initialData}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </SectionsProvider>
  )
}

