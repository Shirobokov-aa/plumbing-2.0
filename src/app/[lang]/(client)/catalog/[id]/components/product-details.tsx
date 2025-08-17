"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import TechnologiesTab from "./technologies-tab";
import { ProductColor, ProductImage, ProductWithDetails } from "@/types/catalog";
import { RelatedProducts } from "./related-product";
import Link from "next/link";

interface ProductDetailsProps {
  product: ProductWithDetails;
  lang: string;
}

export default function ProductDetails({ product, lang }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");

  // Определяем текущий цвет на основе URL
  useEffect(() => {
    const getCurrentColor = () => {
      // Получаем текущий ID продукта из URL
      const currentUrl = window.location.pathname;
      const currentId = currentUrl.split('/').pop();

      // Ищем цвет, который соответствует текущему URL
      const currentColor = product.colors?.find(color => {
        const productToColor = product.productToColors?.find(ptc => ptc.colorId === color.id);
        return productToColor?.linkToProduct?.includes(currentId || '');
      });

      // Если нашли цвет, возвращаем его, иначе первый цвет из списка
      return currentColor || product.colors?.[0];
    };

    const currentColor = getCurrentColor();
    if (currentColor?.name) {
      setSelectedColor(currentColor.name);
    }
  }, [product.colors, product.productToColors]);

  // Функция для получения суффикса по названию цвета
  const getColorSuffix = (colorName: string) => {
    const color = product.colors?.find((c) => c.name === colorName);
    return color?.suffix || "";
  };

  // Получаем актуальный артикул в зависимости от цвета
  const getCurrentArticle = () => {
    return `${product.article}${getColorSuffix(selectedColor)}`;
  };

  // Фильтруем изображения по выбранному цвету
  const getFilteredImages = (): string[] => {
    if (!product.images || !Array.isArray(product.images)) {
      console.log("No images found or images is not an array");
      return [];
    }

    const selectedColorId = product.colors?.find((c) => c.name === selectedColor)?.id;

    // Преобразуем все изображения в формат ProductImage
    const normalizedImages = product.images.map((img): ProductImage => {
      if (typeof img === "string") {
        return {
          url: img,
          colorId: null,
        };
      }
      return img;
    });

    // Возвращаем только URL изображений
    return normalizedImages
      .filter((img) => !selectedColorId || img.colorId === selectedColorId || img.colorId === null)
      .map((img) => img.url);
  };

  // Обработка ошибок изображений
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/image/placeholder.svg";
  };

  const filteredImages = getFilteredImages();

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="relative">
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {filteredImages.length > 0 ? (
                filteredImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square">
                      <Image
                        src={image || "/image/placeholder.svg"}
                        alt={`${product.name} - ${selectedColor || "Стандартный"} - изображение ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        priority={index === 0} // Приоритет только для первого изображения
                        sizes="(max-width: 768px) 100vw, 50vw" // Адаптивные размеры для детальной страницы
                        loading={index === 0 ? "eager" : "lazy"} // Ленивая загрузка для остальных изображений
                        onError={handleImageError}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="relative aspect-square">
                    <Image
                      src="/image/placeholder.svg"
                      alt="Изображение отсутствует"
                      fill
                      className="object-cover rounded-lg"
                      priority
                    />
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {filteredImages.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>

        <div>
          <h1 className="text-3xl mb-4">{product.name}</h1>
          <div className="text-gray-500 mb-8">Артикул {getCurrentArticle()}</div>
          <div className="text-2xl mb-8">{product.price.toLocaleString("ru-RU")} руб.</div>

          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm mb-4">Доступные цвета:</h3>
              <div className="flex gap-4">
                {product.colors.map((color: ProductColor) => {
                  const productToColor = product.productToColors?.find(ptc => ptc.colorId === color.id);
                  const isCurrentColor = color.name === selectedColor;

                  return (
                    <div key={color.id}>
                      {productToColor?.linkToProduct ? (
                        <Link href={productToColor.linkToProduct}>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-12 h-12 rounded-full p-0 relative",
                              isCurrentColor && "ring-2 ring-offset-2 ring-black"
                            )}
                            style={{ backgroundColor: color.code }}
                          >
                            <span className="sr-only">{color.name}</span>
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          className={cn(
                            "w-12 h-12 rounded-full p-0 relative opacity-50 cursor-not-allowed",
                            isCurrentColor && "ring-2 ring-offset-2 ring-black"
                          )}
                          style={{ backgroundColor: color.code }}
                          disabled
                        >
                          <span className="sr-only">{color.name}</span>
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {product.description && <p className="text-gray-600 mb-8">{product.description}</p>}
        </div>
      </div>
      <div className="mt-12">
        <Tabs defaultValue="characteristics" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="flex w-full justify-start space-x-4 md:space-x-12 bg-white min-w-max">
              <TabsTrigger
                value="characteristics"
                className="pb-2 font-medium text-base md:text-xl text-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-bold border-t-0 border-l-0 border-r-0 rounded-none whitespace-nowrap"
              >
                ХАРАКТЕРИСТИКИ ПРОДУКТА
              </TabsTrigger>
              <TabsTrigger
                value="technologies"
                className="pb-2 font-medium text-base md:text-xl text-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-bold border-t-0 border-l-0 border-r-0 rounded-none whitespace-nowrap"
              >
                ТЕХНОЛОГИИ
              </TabsTrigger>
              <TabsTrigger
                value="documentation"
                className="pb-2 font-medium text-base md:text-xl text-gray-800 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-bold border-t-0 border-l-0 border-r-0 rounded-none whitespace-nowrap"
              >
                ДОКУМЕНТАЦИЯ
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="characteristics" className="mt-8">
            <div className="space-y-5">
              {product.characteristics && product.characteristics.length > 0 ? (
                product.characteristics
                  .sort((a, b) => a.order - b.order)
                  .map((char) => (
                    <div key={char.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                      <div className="text-gray-600">{char.name}</div>
                      <div>{char.value}</div>
                    </div>
                  ))
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                    <div className="text-gray-600">Материал</div>
                    <div>Латунь</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                    <div className="text-gray-600">Покрытие</div>
                    <div>{product.colors?.map((c) => c.name).join(", ") || "Не указано"}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                    <div className="text-gray-600">Тип управления</div>
                    <div>Однорычажный</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                    <div className="text-gray-600">Высота</div>
                    <div>150 мм</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                    <div className="text-gray-600">Глубина</div>
                    <div>200 мм</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1">
                    <div className="text-gray-600">Артикул</div>
                    <div>{getCurrentArticle()}</div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="technologies" className="mt-0">
            <TechnologiesTab technologies={product.technologies || []} />
          </TabsContent>
          <TabsContent value="documentation" className="mt-8">
            <div className="space-y-6">
              <h3 className="font-medium text-lg mb-4">Материалы для скачивания</h3>
              <div className="space-y-4">
                {product.documents && product.documents.length > 0 ? (
                  product.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                    >
                      <span>{doc.name}</span>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-4">{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                        <a
                          href={doc.fileUrl}
                          download={`${doc.name}.${doc.type}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Скачать
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">Для данного продукта документы не загружены</div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <RelatedProducts productId={product.id} lang={lang} />
      </div>
    </div>
  );
}
