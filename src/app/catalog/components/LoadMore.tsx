"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface LoadMoreProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function LoadMore({ currentPage, totalPages, totalItems, itemsPerPage }: LoadMoreProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (currentPage + 1).toString())
    router.push(`/catalog?${params.toString()}`)
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="mt-8 text-center">
      <div className="text-sm text-gray-500 mb-2">
        {startItem} из {totalItems}
      </div>
      <button
        onClick={handleLoadMore}
        className="px-6 py-3 border rounded-full text-sm hover:bg-gray-50"
      >
        Показать еще
      </button>
    </div>
  )
}
