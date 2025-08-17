import ClientPage from './client-page';
import { getDictionary } from "@/dictionaries";
import { getBrandHeroSection, getBrandContent } from "@/actions/query";
import { notFound } from "next/navigation";
import DynamicHeader from "@/components/header/DynamicHeader";

type PageProps = {
  params: Promise<{ lang: string }>;
};

const validLocales = ["en", "ru"];

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  if (!validLocales.includes(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang as "en" | "ru");
  const { data: heroData } = await getBrandHeroSection(lang);
  const { data: contentData } = await getBrandContent(lang);

  return (
    <>
      <DynamicHeader lang={lang} dictionary={dictionary} />
      <ClientPage
        lang={lang}
        dictionary={dictionary}
        heroData={heroData || null}
        contentData={contentData || null}
      />
    </>
  );
}
