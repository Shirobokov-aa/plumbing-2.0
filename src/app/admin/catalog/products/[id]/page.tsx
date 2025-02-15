import { getProductForEdit } from "@/app/actions/catalog-admin"
import { getCategories } from "@/app/actions/catalog"
import { ProductForm } from "../../components/ProductForm"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
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
        product={product}
        categories={categories}
        isEdit
      />
    </div>
  )
}
