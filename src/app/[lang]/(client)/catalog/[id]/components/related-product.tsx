"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductImage } from "@/types/catalog";
import { getRelatedProductsByCrossCollection } from "@/actions/catalog";

interface RelatedProductsProps {
  productId: number;
  lang: string;
  customTitle?: string;
}

interface APIProduct {
  id: number;
  name: string;
  article: string;
  description: string | null;
  price: number;
  categoryId: number;
  subcategoryId: number | null;
  images: (string | ProductImage)[] | null;
  featured: boolean | null;
  isActive: boolean | null;
  lang: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export function RelatedProducts({ productId, lang, customTitle }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [collectionName, setCollectionName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      setLoading(true);
      try {
        const { data, collectionName } = await getRelatedProductsByCrossCollection(productId, 4, lang);
        // Преобразуем данные в правильный формат
        const formattedProducts = (data as APIProduct[] || []).map(product => ({
          ...product,
          images: product.images?.map(img => typeof img === 'string' ? img : img.url) || [],
          featured: product.featured || false,
          isActive: product.isActive || false
        }));
        setProducts(formattedProducts);
        setCollectionName(collectionName);
      } catch (error) {
        console.error("Ошибка при получении связанных товаров:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [productId, lang]);

  // Если нет связанных товаров, не отображаем компонент
  if (!loading && products.length === 0) {
    return null;
  }

  // Определяем заголовок
  const title = customTitle || (collectionName ? `Другие товары из коллекции "${collectionName}"` : "Похожие товары");

  return (
    <div className="mt-10 mb-16">
      <h2 className="text-2xl font-medium mb-6">{title}</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/${lang}/catalog/${product.id}`} className="group">
              <div className="aspect-square mb-4 overflow-hidden">
                <Image
                  src={product.images?.[0] ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) : "/images/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm mb-2">{product.name}</h3>
              <div className="mt-2 text-lg font-medium">{product.price.toLocaleString("ru-RU")} руб.</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
