import Footer from "@/components/Footer";
import DynamicHeader from "@/components/header/DynamicHeader";
import { Suspense } from "react";
import { getDictionary } from "@/dictionaries";
import { getHeroSection } from "@/actions/query";
import HeroSection from "@/components/main/hero-section";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import ClientCollectionsGrid from "./components/client-collections-grid";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionsPage(props: PageProps) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as "en" | "ru");
  const { data: heroData } = await getHeroSection(lang);

  console.log(`[CollectionsPage] Рендеринг страницы коллекций для языка: ${lang}`);

  return (
    <div>
      <DynamicHeader lang={lang} dictionary={dictionary} />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <HeroSection data={heroData} />
          <section className="max-w-[1440px] px-12 pt-16 mx-auto">
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
              </BreadcrumbList>
            </Breadcrumb>
          </section>
          <ClientCollectionsGrid lang={lang} />
        </Suspense>
      </main>
      <Footer lang={lang} dictionary={dictionary} />
    </div>
  );
}
