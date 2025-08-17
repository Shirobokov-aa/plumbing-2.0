import React from "react";

import HeroSection from "./main/hero-section";
import DirectionsSection from "./main/directions-section";
import { Dictionary } from "@/types/types";
import { getHeroSection, getDirections } from "@/actions/query";
import { unstable_noStore } from "next/cache";

export default async function Main({ lang, dictionary }: { lang: string, dictionary: Dictionary }) {
  // Отключаем кэширование для этой страницы, чтобы данные всегда запрашивались заново
  unstable_noStore();

  console.log("Main component rendering for language:", lang);

  // Получаем данные с сервера
  const { data: heroData } = await getHeroSection(lang);
  const { items: directionsData } = await getDirections(lang);

  console.log(`Retrieved ${directionsData?.length || 0} directions for Main component`);

  return (
    <main className="">
      <HeroSection data={heroData} />
      <DirectionsSection lang={lang} dictionary={dictionary} serverData={directionsData} />
    </main>
  );
}
