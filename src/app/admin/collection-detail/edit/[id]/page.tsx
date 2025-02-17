import { CollectionDetailForm } from "../../CollectionDetailForm"
import { getCollectionDetailWithSections } from "@/db/collection-details"
import { notFound } from "next/navigation"

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
