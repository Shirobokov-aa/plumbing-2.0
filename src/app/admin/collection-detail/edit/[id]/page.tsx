import { CollectionDetailForm } from "../../CollectionDetailForm"
import { getCollectionDetailWithSections } from "@/db/collection-details"
import { notFound } from "next/navigation"

// Правильное определение типов для параметров страницы
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function EditCollectionPage({ params }: PageProps) {
  const { id } = await params

  if (isNaN(Number(id))) {
    notFound()
  }

  const detail = await getCollectionDetailWithSections(Number(id))
  if (!detail) {
    notFound()
  }

  return (
    <div>
      <CollectionDetailForm initialData={detail} action="edit" />
    </div>
  )
}
