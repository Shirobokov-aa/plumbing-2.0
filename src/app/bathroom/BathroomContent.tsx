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
import BathroomCollection from "@/components/bathroom/BathroomCollection"
import type {
  BathroomBanner as BathroomBannerType,
  BathroomSection,
  BathroomCollection as BathroomCollectionType
} from "@/db/schema"

interface BathroomContentProps {
  initialData: {
    banner: BathroomBannerType
    sections: BathroomSection[]
    collections: BathroomCollectionType[]
  }
}

export default function BathroomContent({ initialData }: BathroomContentProps) {
  const bannerData = {
    name: initialData.banner.name || '',
    title: initialData.banner.title || '',
    description: initialData.banner.description || '',
    image: initialData.banner.image || '',
    link: {
      text: initialData.banner.linkText || '',
      url: initialData.banner.linkUrl || ''
    }
  }

  const sectionsData = initialData.sections.map(section => ({
    title: section.title || '',
    description: section.description || '',
    link: {
      text: section.linkText || '',
      url: section.linkUrl || ''
    },
    images: section.images.map(img => ({
      src: img.src,
      alt: img.alt || '',
      desc: ''
    }))
  }))

  const collectionsData = initialData.collections.map(collection => ({
    title: collection.title || '',
    description: collection.description || '',
    link: {
      text: collection.linkText || '',
      url: collection.linkUrl || ''
    },
    images: collection.images.map(img => ({
      src: img.src,
      alt: img.alt || '',
      desc: ''
    }))
  }))

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
        <BathroomBanner {...bannerData} />
      </section>
      {sectionsData.map((section, index) => (
        <section key={index}>
          <BathShower {...section} />
        </section>
      ))}
      {collectionsData.map((collection, index) => (
        <section key={index}>
          <BathroomCollection {...collection} />
        </section>
      ))}
    </>
  )
}

