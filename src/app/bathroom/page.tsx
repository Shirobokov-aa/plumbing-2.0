import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BathroomContent from "./BathroomContent"
import { getBathroomPageData } from "@/db/bathroom"

export default async function Bathroom() {
  const data = await getBathroomPageData()

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <Suspense fallback={<div>Loading...</div>}>
        <BathroomContent
          initialData={{
            banner: {
              id: data.banner?.id ?? 0,
              name: data.banner?.name ?? null,
              title: data.banner?.title ?? null,
              description: data.banner?.description ?? null,
              image: data.banner?.image ?? null,
              linkText: data.banner?.link?.text ?? null,
              linkUrl: data.banner?.link?.url ?? null,
              createdAt: data.banner?.createdAt ?? null,
              updatedAt: data.banner?.updatedAt ?? null
            },
            sections: data.sections.map(section => ({
              id: section.id,
              title: section.title,
              description: section.description,
              linkText: section.link.text,
              linkUrl: section.link.url,
              order: section.order,
              createdAt: null,
              updatedAt: null,
              images: section.images.map((img, index) => ({
                id: index + 1,
                src: img.src,
                alt: img.alt,
                order: img.order,
                sectionId: null,
                collectionId: null,
                createdAt: null,
                updatedAt: null
              }))
            })),
            collections: data.collections.map(collection => ({
              id: collection.id,
              title: collection.title,
              description: collection.description,
              linkText: collection.link.text,
              linkUrl: collection.link.url,
              order: collection.order,
              createdAt: null,
              updatedAt: null,
              images: collection.images.map((img, index) => ({
                id: index + 1,
                src: img.src,
                alt: img.alt,
                order: img.order,
                sectionId: null,
                collectionId: null,
                createdAt: null,
                updatedAt: null
              }))
            }))
          }}
        />
      </Suspense>
      <Footer />
    </div>
  )
}

