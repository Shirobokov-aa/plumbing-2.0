import { Suspense } from "react"
import { CollectionContent } from "./CollectionContent"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function CollectionDetail({ params }: { params: { id: string } }) {
  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <Suspense fallback={<div>Loading...</div>}>
        <CollectionContent id={parseInt(params.id)} />
      </Suspense>
      <Footer />
    </div>
  )
}

