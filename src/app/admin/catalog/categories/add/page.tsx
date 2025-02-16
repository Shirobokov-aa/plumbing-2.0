import { CategoryForm } from "../../components/CategoryForm"

export default function AddCategoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Добавить категорию</h1>
      <CategoryForm />
    </div>
  )
}
