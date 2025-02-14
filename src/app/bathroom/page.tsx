import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BathroomContent from "./BathroomContent"

// { params }: { params: Promise<{ name: string }> }
export default function Bathroom() {
  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <Suspense fallback={<div>Loading...</div>}>
        <BathroomContent />
      </Suspense>
      <Footer />
    </div>
  )
}

