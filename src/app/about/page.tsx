import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AboutContent from "./AboutContent"

// { params }: { params: Promise<{ name: string }> }
export default function Kitchen() {
  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <Suspense fallback={<div>Loading...</div>}>
        <AboutContent />
      </Suspense>
      <Footer />
    </div>
  )
}

