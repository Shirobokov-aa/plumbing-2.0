import Footer from "@/components/Footer";
import DynamicHeader from "@/components/header/DynamicHeader";
import HeroSection from "@/components/main/hero-section";
import { getDictionary } from "@/dictionaries";
import { Metadata } from "next";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { getHeroSection } from "@/actions/query";
import { getCollectionBySlug } from "@/actions/collections";
import { getCollectionPage } from "@/actions/query";
import TitleCollection from "./components/title-colection";
import BannerCollection from "./components/banner-collection";
import CollectionProducts from "./components/collection-products";
import { getCollectionProducts } from "@/actions/catalog";
import { notFound } from "next/navigation";

interface CollectionPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: CollectionPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const collectionResult = await getCollectionBySlug(slug);

  if (!collectionResult.success || !collectionResult.data) {
    return {
      title: "Коллекция не найдена",
      description: "Запрашиваемая коллекция не существует",
    };
  }

  return {
    title: collectionResult.data.name,
    description: collectionResult.data.description || "",
  };
}

export default async function CollectionPage(props: CollectionPageProps) {
  const { lang, slug } = await props.params;
  const dictionary = await getDictionary(lang as "en" | "ru");
  const { data: heroData } = await getHeroSection(lang);

  // Получаем данные коллекции
  const collectionResult = await getCollectionBySlug(slug);
  if (!collectionResult.success || !collectionResult.data) {
    notFound();
  }
  const collection = collectionResult.data;

  // Получаем мультиязычный контент коллекции
  const pageResult = await getCollectionPage(collection.id, lang);
  const collectionPage = pageResult.data;

  // Получаем товары коллекции
  const { data: products } = await getCollectionProducts(collection.id, lang);

  // Подготавливаем данные для отображения
  const title = collectionPage?.title || collection.name || "";
  const bannerImage = collectionPage?.bannerImage || undefined;

  return (
    <div>
      <DynamicHeader lang={lang} dictionary={dictionary} />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <HeroSection data={heroData} />
          <section className="max-w-[1440px] lg:px-12 px-4 pt-16 mx-auto">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-black" href={`/${lang}`}>
                    Главная
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-black">
                  <Slash className="text-black" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-black" href={`/${lang}/collections`}>
                    Коллекции
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-black">
                  <Slash className="text-black" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-black" href={`/${lang}/collections/${slug}`}>
                    {collection.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </section>
          <TitleCollection
            title={title}
            subTitle={collectionPage?.subTitle}
            description={collectionPage?.description}
          />
          <BannerCollection
            image={bannerImage}
            content={collectionPage?.content}
          />
          <CollectionProducts
            products={products || []}
          />
        </Suspense>
      </main>
      <Footer lang={lang} dictionary={dictionary} />
    </div>
  );
}
