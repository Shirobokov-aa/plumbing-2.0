"use client";

import { use } from "react";
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
import { useSections } from "@/app/admin/contexts/SectionsContext";
import CollectionDetailBanner from "@/components/collection-detail/CollectionDetailBanner";
import CollectionDetailSection from "@/components/collection-detail/CollectionDetailSection";
import CollectionDetailSection2 from "@/components/collection-detail/CollectionDetailSection2";
import CollectionDetailSection3 from "@/components/collection-detail/CollectionDetailSection3";
import CollectionDetailSection4 from "@/components/collection-detail/CollectionDetailSection4";

interface CollectionContentProps {
  params: Promise<{ name: string }>;
}

export function CollectionContent({ params }: CollectionContentProps) {
  const resolvedParams = use(params);
  const { collectionDetails } = useSections();

  const collection = collectionDetails.find((c) => c.name.toLowerCase() === resolvedParams.name.toLowerCase());

  if (!collection) {
    return <div>Collection not found</div>;
  }

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
                <BreadcrumbLink href={`/collections/collection-detail/${resolvedParams.name.toLowerCase()}`}>
                  {collection.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <CollectionDetailBanner {...collection.banner} name={collection.name} />
      {collection.sections.map((section, index) => (
        <CollectionDetailSection key={index} {...section} reverse={index % 2 !== 0} />
      ))}
      {/* здесь будет другая секция (отдельным компонентом) с другими стилями */}
      {collection.sections2.map((section, index) => (
        <CollectionDetailSection2 key={index} {...section} reverse={index % 2 !== 0} />
      ))}
      {collection.sections3.map((section, index) => (
        <CollectionDetailSection3 key={index} {...section} reverse={index % 2 !== 0} />
      ))}
      {collection.sections4.map((section, index) => (
        <CollectionDetailSection4 key={index} {...section} reverse={index % 2 !== 0} />
      ))}
    </>
  );
}
