"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type HeroBathroomSectionProps = {
  data?: {
    id?: number;
    imageBase64: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  };
};

export default function HeroBathroom({ data }: HeroBathroomSectionProps) {
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
          alt="Hero Banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={75}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>
    </section>
  );
}
