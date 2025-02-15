import { getProducts } from "@/app/actions/catalog"
import { ProductList } from "../components/ProductList"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ProductsPage() {
  const { products } = await getProducts({})

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Link href="/admin/catalog/products/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Button>
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  )
}
