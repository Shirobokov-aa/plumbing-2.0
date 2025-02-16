import Link from "next/link"

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
      <p className="text-gray-500 mb-8">
        К сожалению, запрашиваемый товар не существует или был удален.
      </p>
      <Link
        href="/catalog"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Вернуться в каталог
      </Link>
    </div>
  )
}
