import { getCollectionDetailWithSections } from "@/db/collection-details"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function CollectionDetailPage({ params }: PageProps) {
  // Дожидаемся получения params
  const resolvedParams = await Promise.resolve(params)

  // Проверяем, что id является числом
  const collectionId = parseInt(resolvedParams.id)
  if (isNaN(collectionId)) {
    notFound()
  }

  const collectionDetail = await getCollectionDetailWithSections(collectionId)

  if (!collectionDetail) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      {/* Баннер */}
      <section className="mb-12">
        <div className="relative">
          <img
            src={collectionDetail.bannerImage}
            alt={collectionDetail.bannerTitle}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">{collectionDetail.bannerTitle}</h1>
              <p className="mb-4">{collectionDetail.bannerDescription}</p>
              <a href={collectionDetail.bannerLinkUrl} className="inline-block px-6 py-2 border-2 border-white">
                {collectionDetail.bannerLinkText}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

