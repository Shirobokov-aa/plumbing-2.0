"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { DirectionsDictionary } from "@/types/types";

interface Direction {
  id: number;
  title: string | null;
  description: string | null;
  imageBase64: string;
  link: string;
  order: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  lang?: string;
}

type DirectionsSectionProps = {
  lang: string;
  dictionary: DirectionsDictionary;
  serverData?: Direction[];
};

// Пример base64 изображения-заглушки
const placeholderBase64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM3Nzc3NzciPnBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==";

export default function DirectionsSection({ lang, dictionary, serverData = [] }: DirectionsSectionProps) {
  console.log(`Rendering DirectionsSection with ${serverData.length} items:`, serverData);

  // Если есть данные с сервера, используем их
  // Иначе используем данные из словаря для резервного отображения
  const directionsToShow = serverData.length > 0
    ? serverData // Используем данные с сервера, если они есть
    : [
        {
          id: 1,
          title: dictionary.directions.bathroom.title,
          description: dictionary.directions.bathroom.description,
          imageBase64: placeholderBase64,
          link: `/${lang}/bathroom`,
          order: 0,
          lang
        },
        {
          id: 2,
          title: dictionary.directions.kitchen.title,
          description: dictionary.directions.kitchen.description,
          imageBase64: placeholderBase64,
          link: `/${lang}/kitchen`,
          order: 1,
          lang
        },
        {
          id: 3,
          title: dictionary.directions.collections.title,
          description: dictionary.directions.collections.description,
          imageBase64: placeholderBase64,
          link: `/${lang}/collections`,
          order: 2,
          lang
        },
      ];

  return (
    <section className="max-w-[1440px] px-12 pt-12 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {directionsToShow.map((item) => (
          <div key={item.id} className="flex flex-col">
            <Link href={item.link}>
              <div className="relative aspect-square mb-4 overflow-hidden group">
                <Image
                  src={item.imageBase64 && item.imageBase64.startsWith('data:image/')
                    ? item.imageBase64
                    : placeholderBase64}
                  alt={item.title || ''}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Если изображение не загружается, заменяем на плейсхолдер
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM3Nzc3NzciPnBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <h3 className="text-2xl font-normal mb-2 uppercase">{item.title || ''}</h3>
              <p className="text-xl text-gray-800 mb-4">{item.description || ''}</p>
              <span className="text-gray-700 flex items-center mt-auto border-b-black border-b w-fit">
                {dictionary.directions.details}
                <span className="pl-2">
                  <MoveRight />
                </span>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
