import { CollectionDetailForm } from "../CollectionDetailForm"

export default function AddCollectionDetailPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Добавить детальную страницу</h1>
      <CollectionDetailForm action="add" />
    </div>
  )
}
