"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/catalog";
import { getProducts } from "@/actions/catalog";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

interface ProductGridProps {
  categorySlug?: string;
  subcategorySlug?: string;
  lang: string;
  // ОПТИМИЗАЦИЯ: Поддержка начальных данных с сервера
  initialProducts?: Product[];
  initialHasMore?: boolean;
}

export function ProductGrid({
  categorySlug,
  subcategorySlug,
  lang,
  initialProducts,
  initialHasMore
}: ProductGridProps) {
  // ОПТИМИЗАЦИЯ: Используем начальные данные с сервера если есть
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts); // Не загружаем если есть начальные данные
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore ?? true);
  const [debug, setDebug] = useState<string>("");

  // Автоскролл к товарам только на главной странице продуктов
  const shouldAutoScroll = !categorySlug && !subcategorySlug;
  useAutoScroll({
    targetId: 'products-grid',
    enabled: shouldAutoScroll,
    delay: 800,
    offset: 100
  });

  const INITIAL_LIMIT = 6; // ОПТИМИЗАЦИЯ: Уменьшили начальное количество товаров
  const LOAD_MORE_LIMIT = 6; // Количество товаров для "Показать еще"

  // Функция для загрузки товаров
  const loadProducts = useCallback(async (offset: number = 0, limit: number = INITIAL_LIMIT, append: boolean = false) => {
    try {
      console.log(`ProductGrid: Запрашиваем товары для категории=${categorySlug}, подкатегории=${subcategorySlug}, offset=${offset}, limit=${limit}`);

      const debugInfo = `Запрос:
        categorySlug=${categorySlug},
        subcategorySlug=${subcategorySlug},
        lang=${lang},
        offset=${offset},
        limit=${limit}`;

      if (!append) {
        setDebug(debugInfo);
      }

      // Если мы на странице /products, запрашиваем все товары
      if (!categorySlug && !subcategorySlug) {
        const result = await getProducts({
          lang,
          limit,
          offset
        });
        console.log(`ProductGrid: Найдено ${result.products.length} товаров, всего: ${result.total}, hasMore: ${result.hasMore}`);

        if (append) {
          setProducts(prev => [...prev, ...result.products]);
        } else {
          setProducts(result.products);
        }
        setHasMore(result.hasMore);

        if (!append) {
          setDebug(prev => `${prev}\nПолучено товаров: ${result.products.length}, всего: ${result.total}`);
        }
        return;
      }

      // Проверяем соответствие категории и подкатегории
      const checkCategoryContext = () => {
        const bathroomSubcategories = ["sink-mixers", "bath-shower-mixers", "shower-systems", "toilets"];
        const kitchenSubcategories = ["kitchen-mixers", "dispensers"];

        if (categorySlug === "bathroom" && subcategorySlug && kitchenSubcategories.includes(subcategorySlug)) {
          return false;
        }
        if (categorySlug === "kitchen" && subcategorySlug && bathroomSubcategories.includes(subcategorySlug)) {
          return false;
        }
        return true;
      };

      let result;

      if (!checkCategoryContext() && subcategorySlug) {
        console.log("Обнаружено несоответствие категории и подкатегории, выполняем запрос только по подкатегории");
        result = await getProducts({
          subcategorySlug,
          lang,
          limit,
          offset
        });
      } else {
        result = await getProducts({
          categorySlug,
          subcategorySlug,
          lang,
          limit,
          offset
        });
      }

      console.log(`ProductGrid: Найдено ${result.products.length} товаров, всего: ${result.total}, hasMore: ${result.hasMore}`);

      if (append) {
        setProducts(prev => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }
      setHasMore(result.hasMore);

      if (!append) {
        setDebug(prev => `${prev}\nПолучено товаров: ${result.products.length}, всего: ${result.total}`);
      }
    } catch (error) {
      console.error("Ошибка при получении товаров:", error);
      if (!append) {
        setProducts([]);
        setDebug(prev => `${prev}\nОшибка: ${error}`);
      }
      setHasMore(false);
    }
  }, [categorySlug, subcategorySlug, lang]);

  // Начальная загрузка товаров (только если нет начальных данных)
  useEffect(() => {
    // Пропускаем загрузку если уже есть начальные данные с сервера
    if (initialProducts && initialProducts.length > 0) {
      return;
    }

    const fetchInitialProducts = async () => {
      setLoading(true);
      await loadProducts(0, INITIAL_LIMIT, false);
      setLoading(false);
    };

    fetchInitialProducts();
  }, [categorySlug, subcategorySlug, lang, loadProducts, initialProducts]);

  // Функция "Показать еще"
  const handleLoadMore = async () => {
    setLoadingMore(true);
    const newOffset = products.length; // Используем текущее количество загруженных товаров как offset
    await loadProducts(newOffset, LOAD_MORE_LIMIT, true);
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <section className="max-w-[1440px] px-12 pt-12 mx-auto">
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4">Загрузка...</p>
          {categorySlug && (
            <p className="mt-2 text-gray-500">
              Категория: {categorySlug}, Подкатегория: {subcategorySlug}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="max-w-[1440px] px-12 pt-12 mx-auto">
        <div className="text-center py-16">
          <p>Товары не найдены</p>
          {categorySlug && (
            <p className="mt-2 text-gray-500">
              Категория: {categorySlug}, Подкатегория: {subcategorySlug}
            </p>
          )}
          <pre className="mt-4 p-4 bg-gray-100 text-xs text-left whitespace-pre-wrap rounded-md">
            {debug}
          </pre>
        </div>
      </section>
    );
  }

  return (
    <section id="products-grid" className="max-w-[1440px] px-12 pt-12 pb-24 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          // ОПТИМИЗАЦИЯ: Получаем URL изображения безопасно
          const imageUrl = product.images?.[0]
            ? (typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url)
            : "/image/placeholder.svg";

          // ОПТИМИЗАЦИЯ: Все изображения первой загрузки (6 шт) с приоритетом
          const isPriority = index < 6;

          return (
            <Link key={product.id} href={`/${lang}/catalog/${product.id}`} className="group">
              <div className="aspect-square mb-4 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  priority={isPriority} // Приоритет для первых изображений
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" // Адаптивные размеры
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading={isPriority ? "eager" : "lazy"} // Ленивая загрузка для изображений вне экрана
                />
              </div>
              <h3 className="text-sm mb-2 text-gray-900">{product.name}</h3>
              <div className="mt-2 text-lg font-medium text-gray-900">
                {product.price.toLocaleString("ru-RU")} руб.
              </div>
            </Link>
          );
        })}
      </div>

      {/* Кнопка "Показать еще" */}
      {hasMore && (
        <div className="text-center mt-12">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="px-8 py-3"
          >
            {loadingMore ? (
              <>
                <div className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                Загрузка...
              </>
            ) : (
              "Показать еще"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}

// Важно для понимания нового подхода:

// Названия подкатегорий и их слаги должны быть уникальными в системе
// Связь между категорией и подкатегорией определяется полем parentId в таблице productCategories
// При добавлении новых категорий и подкатегорий через админку, используемые слаги будут напрямую отображаться в URL
