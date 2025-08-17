"use client";

import Footer from "@/components/Footer";
import HeroSection from "@/components/main/hero-section";
import { getDictionary } from "@/dictionaries";
import { BrandHeroSection, BrandContent } from "@/types/types";

interface ClientPageProps {
  lang: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  heroData: BrandHeroSection | null;
  contentData: BrandContent | null;
}

export default function ClientPage({ lang, dictionary, heroData, contentData }: ClientPageProps) {
  return (
    <div>
      <HeroSection data={heroData} />
      <main>
        <div className="max-w-[1440px] mx-auto px-12 py-16">
          <h1 className="lg:text-4xl text-2xl">{contentData?.title}</h1>
          <span className="lg:text-4xl text-2xl">{contentData?.subtitle}</span>
          <div>
            <p className="lg:text-2xl text-lg text-gray-600 pt-10">
              {contentData?.description}
            </p>
          </div>
        </div>
      </main>
      <Footer lang={lang} dictionary={dictionary} />
    </div>
  );
}
