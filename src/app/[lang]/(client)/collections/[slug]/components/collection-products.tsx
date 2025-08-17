"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductWithDetails } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

interface CollectionProductsProps {
  products: ProductWithDetails[];
}

export default function CollectionProducts({ products }: CollectionProductsProps) {
  const apiRef = React.useRef<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!apiRef.current) return;
    const interval = setInterval(() => {
      apiRef.current?.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <section className="max-w-[1040px] lg:px-12 px-4 mx-auto">
      <h2 className="text-4xl text-center lg:mb-20 uppercase">Продукты</h2>
      <div className="relative w-full mx-auto">
        <Carousel
          className="w-full"
          opts={{
            align: "center",
            loop: true,
          }}
          nextButtonVariant="custom"
          setApi={(api) => { apiRef.current = api; }}
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id}>
                <div className="flex flex-col lg:flex-row lg:h-[400px] h-[520px] p-1">
                  <div className="flex flex-col justify-center w-full lg:w-1/2  h-fit lg:pt-40 pt-10 gap-5">
                    <h3 className="text-3xl font-medium mb-2">{product.name}</h3>
                    <p className="text-xl text-gray-600 mb-4">Артикул: {product.article}</p>
                    <div>
                      <Link href={`/catalog/${product.id}`}>
                        <Button variant="outline" className="w-fit rounded-full uppercase">
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="relative w-full lg:w-1/2 lg:h-[350px] h-[300px] mb-4 mt-10 overflow-hidden rounded-lg">
                    <Link href={`/catalog/${product.id}`}>
                      <Image
                        src={typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url}
                        alt={product.name}
                        width={0}
                        height={0}
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
