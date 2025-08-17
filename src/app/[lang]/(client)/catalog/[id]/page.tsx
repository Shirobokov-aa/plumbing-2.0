import { Suspense } from "react";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import { getDictionary } from "@/dictionaries";
import ProductDetails from "./components/product-details";
import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getProductById } from "@/actions/catalog";
import DynamicHeader from "@/components/header/DynamicHeader";

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { lang, id } = resolvedParams;

  const dictionary = await getDictionary(lang as "en" | "ru");
  const { data: product } = await getProductById(parseInt(id), lang);

  if (!product) {
    notFound();
  }

  return (
    <>
      <DynamicHeader lang={lang} dictionary={dictionary} theme="black" />
      <main className="pt-32">
        <div className="max-w-[1440px] mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}`}>Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${lang}/products/${product.category?.slug || ""}`}>
                  {product.category?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {product.subcategory && (
                <>
                  <BreadcrumbSeparator>
                    <Slash className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/${lang}/products/${product.category?.slug || ""}?subcategory=${
                        product.subcategory.slug
                      }`}
                    >
                      {product.subcategory.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>{product.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Suspense>
          <ProductDetails product={product} lang={lang} />
        </Suspense>
      </main>
      <Footer lang={lang} dictionary={dictionary} />
    </>
  );
}
