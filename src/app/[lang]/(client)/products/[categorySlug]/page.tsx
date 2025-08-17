// /app/[lang]/products/[categorySlug]/page.tsx
import { Suspense } from "react";
import { getDictionary } from "@/dictionaries";
import Footer from "@/components/Footer";
import { getHeroSection } from "@/actions/query";
import { ProductGrid } from "../components/product-grid";
import { Slash } from "lucide-react";
import { getProductCategoryBySlug } from "@/actions/catalog";
import { notFound } from "next/navigation";

// Импортируем компоненты Hero для разных категорий
import HeroBathroom from "../bathroom/components/hero-bathroom";
import HeroKitchen from "../kitchen/components/hero-kitchen";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DynamicHeader from "@/components/header/DynamicHeader";

interface PageProps {
  params: Promise<{ lang: string; categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Компонент для загрузки и отображения контента категории
async function CategoryLoader({
  lang,
  categorySlug,
  subcategorySlug
}: {
    lang: string;
    categorySlug: string;
  subcategorySlug?: string
}) {
  const { data: heroData } = await getHeroSection(lang);
  const { data: category } = await getProductCategoryBySlug(categorySlug, lang);
  const { data: subcategory } = subcategorySlug ? await getProductCategoryBySlug(subcategorySlug, lang) : { data: null };

  if (!category) {
    console.log(`Категория не найдена: ${categorySlug}`);
    notFound();
  }

  // Функция для получения заголовка категории
  const getCategoryTitle = () => {
    return category?.name || categorySlug;
  };

  // Функция для получения заголовка подкатегории
  const getSubcategoryTitle = () => {
    return subcategory?.name || subcategorySlug;
  };

  // Функция для выбора правильного Hero-компонента
  const renderHeroSection = () => {
    const bathroomSlugs = ["bathroom", "vannaya", "vannaya-komnata", "ванная"];
    const kitchenSlugs = ["kitchen", "kuhnya", "kukhnya", "кухня"];

    if (bathroomSlugs.includes(categorySlug)) {
      return <HeroBathroom data={heroData} />;
    } else if (kitchenSlugs.includes(categorySlug)) {
      return <HeroKitchen data={heroData} />;
    } else {
      return (
        <div className="w-full py-16">
          <div className="max-w-[1440px] mx-auto px-12">
            <h1 className="text-4xl font-bold">{getCategoryTitle()}</h1>
          </div>
        </div>
      );
    }
  };

  return (
    <>
        {renderHeroSection()}
        <section className="max-w-[1440px] px-12 pt-12 mx-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}`}>Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}/products`}>Продукты</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}/products/${categorySlug}`}>
                  {getCategoryTitle()}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {subcategorySlug && (
                <>
                  <BreadcrumbSeparator>
                    <Slash />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${lang}/products/${categorySlug}?subcategory=${subcategorySlug}`}>
                      {getSubcategoryTitle()}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </section>
        <ProductGrid
          categorySlug={categorySlug}
          subcategorySlug={subcategorySlug}
          lang={lang}
        />
    </>
  );
}

// Основной компонент страницы
export default async function CategoryPage(props: PageProps) {
  const { lang, categorySlug } = await props.params;
  const searchParams = await props.searchParams;
  const subcategorySlug = searchParams.subcategory as string | undefined;
  const dictionary = await getDictionary(lang as "en" | "ru");

  return (
    <div>
      <DynamicHeader lang={lang} dictionary={dictionary} />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <CategoryLoader
            lang={lang}
            categorySlug={categorySlug}
            subcategorySlug={subcategorySlug}
          />
        </Suspense>
      </main>
      <Footer lang={lang} dictionary={dictionary} />
    </div>
  );
}
