"use client";

import { useEffect, useState } from "react";
// import { useSections } from "@/contexts/SectionsContext"
// import { CollectionDetailBanner } from "@/components/collection-detail/CollectionDetailBanner"
// import { CollectionDetailSection } from "@/components/collection-detail/CollectionDetailSection"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { getCollectionDetailById } from "@/app/actions/collection-detail";
import CollectionDetailBanner from "@/components/collection-detail/CollectionDetailBanner";
import CollectionDetailSection from "@/components/collection-detail/CollectionDetailSection";
import CollectionDetailSection2 from "@/components/collection-detail/CollectionDetailSection2";
import CollectionDetailSection3 from "@/components/collection-detail/CollectionDetailSection3";
import CollectionDetailSection4 from "@/components/collection-detail/CollectionDetailSection4";

interface CollectionDetail {
  id: number;
  name: string;
  banner: {
    image: string;
    title: string;
    description: string;
    link: { text: string; url: string };
  };
  sections: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections2: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    titleDesc: string;
    descriptionDesc: string;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections3: Array<{
    title: string;
    description: string;
    linkText: string;
    linkUrl: string;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
  sections4: Array<{
    title: string;
    description: string;
    images: Array<{ src: string; alt: string; order: number }>;
  }>;
}

interface CollectionContentProps {
  id: number;
}

export function CollectionContent({ id }: CollectionContentProps) {
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      try {
        const data = await getCollectionDetailById(id);
        setCollection(data);
      } catch (error) {
        console.error("Error loading collection:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCollection();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!collection) return <div>Collection not found</div>;

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
                <BreadcrumbLink href="/collections">Коллекции</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/collections/collection-detail/${id}`}>
                  {collection.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <CollectionDetailBanner {...collection.banner} name={collection.name} />
      {collection.sections.map((section: any, index: number) => (
        <CollectionDetailSection key={index} {...section} reverse={index % 2 !== 0} />
      ))}
      {/* здесь будет другая секция (отдельным компонентом) с другими стилями */}
      {collection.sections2.map((section: any, index: number) => (
        <CollectionDetailSection2 key={index} {...section} reverse={index % 2 !== 0} />
      ))}
      {collection.sections3.map((section: any, index: number) => (
        <CollectionDetailSection3 key={index} {...section} reverse={index % 2 !== 0} />
      ))}
      {collection.sections4.map((section: any, index: number) => (
        <CollectionDetailSection4 key={index} {...section} reverse={index % 2 !== 0} />
      ))}
    </>
  );
}
