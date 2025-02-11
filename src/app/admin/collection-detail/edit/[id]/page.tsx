import { CollectionDetailForm } from "../../CollectionDetailForm"
import { getCollectionDetailById } from "@/db/collection-details"
import { notFound } from "next/navigation"

export default async function EditCollectionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const detail = await getCollectionDetailById(Number(params.id))

  if (!detail) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Редактировать детальную страницу</h1>
      <CollectionDetailForm action="edit" initialData={detail} />
    </div>
  )
}
