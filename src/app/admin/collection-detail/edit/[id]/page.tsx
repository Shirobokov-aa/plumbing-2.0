import { CollectionDetailForm } from "../../CollectionDetailForm"
import { getCollectionDetailWithSections } from "@/db/collection-details"
import { notFound } from "next/navigation"

// Правильное определение типов для параметров страницы
type Props = {
  params: {
    id: string;
  };
};

export default async function EditCollectionPage({ params }: Props) {
  const id = Number(await params.id)

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
