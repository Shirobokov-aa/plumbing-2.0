import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BathroomContent from "./BathroomContent"
import { getBathroomPageData } from "@/db/bathroom"

// { params }: { params: Promise<{ name: string }> }
export default async function Bathroom() {
  const data = await getBathroomPageData()

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <Suspense fallback={<div>Loading...</div>}>
        <BathroomContent initialData={data} />
      </Suspense>
      <Footer />
    </div>
  )
}

