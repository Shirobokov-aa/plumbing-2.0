import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AboutContent from "./AboutContent"
import { getAboutPageData } from "@/app/actions/about"

// { params }: { params: Promise<{ name: string }> }
export default async function AboutPage() {
  const aboutData = await getAboutPageData()

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <Suspense fallback={<div>Loading...</div>}>
        <AboutContent data={aboutData as AboutPageData} />
      </Suspense>
      <Footer />
    </div>
  )
}

