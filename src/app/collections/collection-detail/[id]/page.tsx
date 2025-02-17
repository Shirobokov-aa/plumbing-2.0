import { getCollectionDetailWithSections } from "@/db/collection-details"
import { notFound } from "next/navigation"
import { CollectionContent } from "@/app/collections/collection-detail/[id]/CollectionContent"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const collectionId = parseInt(id)

  if (isNaN(collectionId)) {
    notFound()
  }

  const collectionDetail = await getCollectionDetailWithSections(collectionId)
  if (!collectionDetail) {
    notFound()
  }

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <div className="container mx-auto">
        <CollectionContent id={collectionId} />
      </div>
      <Footer />
    </div>
  )
}

