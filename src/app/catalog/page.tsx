import { getCategories, getProducts } from "@/app/actions/catalog";
import { ProductGrid } from "./components/ProductGrid";
import { CategoryFilter } from "./components/CategoryFilter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogBanner from "./components/CatalogBanner";
import { ProductFilters } from "./components/ProductFilters";
import { Suspense } from "react";
import { LoadMore } from "./components/LoadMore";

interface CatalogPageProps {
  searchParams: {
    category?: string;
    page?: string;
    filters?: string;
    search?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const page = Number(searchParams.page) || 1;
  const filters = searchParams.filters?.split(',') || [];

  const { products, totalCount, currentPage, totalPages } = await getProducts({
    page,
    filters,
    search: searchParams.search
  });

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <div className="container mx-auto px-4 py-8">
        <CatalogBanner
          image="/images/catalog/banner.jpg"
          title="Ванная"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
          link={{ text: "Смесители для кухни", url: "/catalog/kitchen" }}
        />
        <h1 className="text-2xl mb-2">Ванная</h1>
        <p className="text-gray-600 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </p>

        <div className="mb-6">
          <Suspense>
            <ProductFilters
              activeFilters={filters}
              totalProducts={totalCount}
            />
          </Suspense>
        </div>

        <ProductGrid products={products} />

        {currentPage < totalPages && (
          <LoadMore
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={6}
          />
        )}
      </div>
      <Footer/>
    </div>
  );
}
