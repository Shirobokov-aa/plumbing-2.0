import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CollectionDetail } from "@/db/schema"

export const columns: ColumnDef<CollectionDetail>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "bannerTitle",
    header: "Заголовок баннера",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const detail = row.original

      return (
        <div className="flex gap-2">
          <Link href={`/admin/collection-detail/edit/${detail.id}`}>
            <Button variant="outline" size="sm">
              Редактировать
            </Button>
          </Link>
        </div>
      )
    },
  },
]
