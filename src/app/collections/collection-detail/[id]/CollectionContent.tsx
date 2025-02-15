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

export function CollectionContent({ id }: CollectionContentProps) {
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      try {
        const data = await getCollectionDetailById(id);
        if (data) {
          setCollection(data);
        }
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
      <CollectionDetailBanner
        name={collection.name}
        image={collection.banner.image || ''}
        title={collection.banner.title || ''}
        description={collection.banner.description || ''}
        link={collection.banner.link.text && collection.banner.link.url ? {
          text: collection.banner.link.text,
          url: collection.banner.link.url
        } : { text: '', url: '' }}
      />
      {collection.sections?.map((section, index) => (
        <CollectionDetailSection
          key={index}
          {...section}
          linkUrl={section.linkUrl || '#'}
          reverse={index % 2 !== 0}
        />
      ))}
      {/* здесь будет другая секция (отдельным компонентом) с другими стилями */}
      {collection.sections2?.map((section, index) => (
        <CollectionDetailSection2
          key={index}
          {...section}
          linkUrl={section.linkUrl || '#'}
        />
      ))}
      {collection.sections3?.map((section, index) => (
        <CollectionDetailSection3
          key={index}
          {...section}
          linkUrl={section.linkUrl || '#'}
        />
      ))}
      {collection.sections4?.map((section, index) => (
        <CollectionDetailSection4
          key={index}
          {...section}
        />
      ))}
    </>
  );
}
