"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CollectionDetail } from "@/db/schema"
import { deleteCollectionDetail } from "./actions"

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
      const id = detail.id

      return (
        <div className="flex gap-2">
          <Link href={`/admin/collection-detail/edit/${detail.id}`}>
            <Button variant="outline" size="sm">
              Редактировать
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteCollectionDetail(id)
            }}
          >
            Удалить
          </Button>
        </div>
      )
    },
  },
]
