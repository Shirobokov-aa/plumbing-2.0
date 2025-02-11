"use client"

import BathroomBanner from "@/components/bathroom/BathroomBanner"
import BathShower from "@/components/bathroom/BathShower"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Slash } from "lucide-react"
import { useSections } from "@/app/admin/contexts/SectionsContext"
import BathroomCollection from "@/components/bathroom/BathroomCollection"

export default function BathroomPage() {
  const { bathroomPage } = useSections()

  return (
    <>
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-28">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/bathroom">Ванная</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <section>
        <BathroomBanner {...bathroomPage.banner} />
      </section>
      {bathroomPage.sections.map((section, index) => (
        <section key={index}>
          <BathShower {...section} />
        </section>
      ))}
            {bathroomPage.collections.map((collection, index) => (
        <section key={index}>
          <BathroomCollection {...collection} />
        </section>
      ))}
    </>
  )
}

