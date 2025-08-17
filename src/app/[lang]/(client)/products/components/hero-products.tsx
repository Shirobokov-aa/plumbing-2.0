"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface HeroProductsProps {
  data: {
    id: number;
    lang: string;
    title: string;
    description: string | null;
    imageBase64: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    buttonText: string | null;
  } | undefined;
}

export default function HeroProducts({ data }: HeroProductsProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("/image/hero-baner.jpg");

  useEffect(() => {
    if (data?.imageBase64 && data.imageBase64.startsWith("data:image/")) {
      setImageSrc(data.imageBase64);
    }
  }, [data?.imageBase64]);

  const handleImageError = () => {
    console.error("Image load error");
    setImageError(true);
    setImageSrc("/image/hero-baner.jpg");
  };

  return (
    <section className="relative h-screen max-w-full w-full max-h-[1500px] min-h-[600px] text-white">
      <div className="absolute inset-0">
        <Image
          src={imageError ? "/image/hero-baner.jpg" : imageSrc}
          alt={data?.title || "Hero Banner"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={75}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        {/* <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-12 w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{data?.title || "Продукты"}</h1>
            {data?.description && (
              <p className="text-lg md:text-xl max-w-2xl">{data.description}</p>
            )}
          </div>
        </div> */}
      </div>
    </section>
  );
}
