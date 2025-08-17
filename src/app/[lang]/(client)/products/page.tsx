import { Suspense } from "react";
import { getDictionary } from "@/dictionaries";
import Footer from "@/components/Footer";
import { ProductGrid } from "./components/product-grid";
import { Slash } from "lucide-react";
import { getHeroSection } from "@/actions/query";
import { getProducts } from "@/actions/catalog";
import HeroProducts from "./components/hero-products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DynamicHeader from "@/components/header/DynamicHeader";

interface PageProps {
  params: Promise<{ lang: string }>;
}

interface Dictionary {
  menu: {
    products: string;
    bathroom: {
      title: string;
      sink_mixers: string;
      bath_shower_mixers: string;
      shower_systems: string;
      toilets: string;
    };
    kitchen: {
      title: string;
      kitchen_mixers: string;
      accessories: string;
      dispensers: string;
    };
    collections: string;
    about: string;
    where_to_buy: string;
    warranty_service: string;
    contacts: string;
    close: string;
    close_menu: string;
    open_menu: string;
  };
}

// ОПТИМИЗАЦИЯ: Загружаем продукты на сервере для мгновенного отображения
async function ProductsLoader({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  // Параллельная загрузка hero-секции и первых продуктов
  const [{ data: heroData }, initialProductsResult] = await Promise.all([
    getHeroSection(lang),
    getProducts({
      lang,
      limit: 6, // ОПТИМИЗАЦИЯ: Только 6 продуктов при первой загрузке
      offset: 0
    })
  ]);

  return (
    <>
      <HeroProducts data={heroData} />
      <section className="max-w-[1440px] px-12 pt-12 mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}`}>{dictionary.menu.products}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/products`}>{dictionary.menu.products}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>
            <ProductGrid
        lang={lang}
        initialProducts={initialProductsResult.products}
        initialHasMore={initialProductsResult.hasMore}
      />
    </>
  );
}

// Основной компонент страницы
export default async function ProductsPage(props: PageProps) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang as "en" | "ru");

  return (
    <div>
      <DynamicHeader lang={lang} dictionary={dictionary} />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsLoader lang={lang} dictionary={dictionary} />
        </Suspense>
      </main>
      <Footer lang={lang} dictionary={dictionary} />
    </div>
  );
}
