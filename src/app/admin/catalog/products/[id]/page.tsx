import { getProductForEdit } from "@/app/actions/catalog-admin"
import { getCategories } from "@/app/actions/catalog"
import { ProductForm } from "../../components/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const [product, categories] = await Promise.all([
    getProductForEdit(Number(params.id)),
    getCategories()
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Редактировать товар</h1>
      <ProductForm
        product={product as Product}
        categories={categories}
        isEdit
      />
    </div>
  )
}
