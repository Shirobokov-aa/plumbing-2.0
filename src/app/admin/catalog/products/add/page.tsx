import { getCategories } from "@/app/actions/catalog"
import { ProductForm } from "../../components/ProductForm"

export default async function AddProductPage() {
  const categories = await getCategories()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Добавить товар</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
