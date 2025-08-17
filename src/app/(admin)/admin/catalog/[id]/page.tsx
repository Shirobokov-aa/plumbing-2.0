import ProductForm from "./components/product-form";
import { getProductById, getProductCategories, getProductColors, getProductTechnologies, getCollections } from "@/actions/catalog";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const numericProductId = parseInt(id);

  // Получаем все необходимые данные на сервере
  const { data: productData } = await getProductById(numericProductId);
  const { data: categoriesData } = await getProductCategories();
  const { data: colorsData } = await getProductColors();
  const { data: technologiesData } = await getProductTechnologies();
  const { data: collectionsData } = await getCollections();

  if (!productData) {
    // Можно добавить серверный редирект при необходимости
    // redirect("/admin/catalog");
    return <div>Продукт не найден</div>;
  }

  // Передаем все данные в клиентский компонент
  return (
    <ProductForm
      product={productData}
      categories={categoriesData || []}
      colors={colorsData || []}
      technologies={technologiesData || []}
      collections={collectionsData || []}
    />
  );
}
