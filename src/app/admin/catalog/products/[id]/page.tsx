import { getProductForEdit } from "@/app/actions/catalog-admin"
import { getCategories } from "@/app/actions/catalog"
import { ProductForm } from "../../components/ProductForm"
import { notFound } from "next/navigation"


type PageProps = {
  params: { id: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function EditProductPage({
  params,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams
}: PageProps) {
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
