import { getCategories } from "@/app/actions/catalog"
import { CategoryList } from "../components/CategoryList"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Link href="/admin/catalog/categories/add">
          <Button>Добавить категорию</Button>
        </Link>
      </div>

      <CategoryList categories={categories ?? []} />
    </div>
  )
}
