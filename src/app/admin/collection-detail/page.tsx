import { getAllCollectionDetails } from "@/db/collection-details"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function CollectionDetailPage() {
  const details = await getAllCollectionDetails()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Детальные страницы коллекций</h1>
        <Link href="/admin/collection-detail/add">
          <Button>Добавить страницу</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={details} />
    </div>
  )
}
