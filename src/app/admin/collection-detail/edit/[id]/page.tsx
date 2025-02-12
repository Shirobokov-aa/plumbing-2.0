import { CollectionDetailForm } from "../../CollectionDetailForm"
import { getCollectionDetailWithSections } from "@/db/collection-details"
import { notFound } from "next/navigation"

export default async function EditCollectionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const detail = await getCollectionDetailWithSections(id)
  if (!detail) {
    notFound()
  }

  return (
    <div>
      <CollectionDetailForm initialData={detail} action="edit" />
    </div>
  )
}
