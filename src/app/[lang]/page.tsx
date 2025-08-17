import { getDictionary } from "@/dictionaries";
import Main from "@/components/Main";
import DynamicHeader  from "@/components/header/DynamicHeader";
import Footer from "@/components/Footer";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const validLocales = ['en', 'ru'];

// Генерация метаданных для страницы с поддержкой локализации
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  // Локализованные заголовки
  const titles = {
    'ru': 'Abelsberg - Сантехника и аксессуары для ванных комнат',
    'en': 'Abelsberg - Plumbing and bathroom accessories'
  };

  // Локализованные описания
  const descriptions = {
    'ru': 'Abelsberg - Официальный сайт',
    'en': 'Abelsberg - Official website'
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
  };
}

// Основной компонент страницы
export default async function Home(props: PageProps) {
  const { lang } = await props.params;

  // Проверяем, является ли локаль допустимой
  if (!validLocales.includes(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang as "en" | "ru");

  return (
    <div>
      <DynamicHeader lang={lang} dictionary={dictionary} />
      <Main lang={lang} dictionary={dictionary} />
      <Footer lang={lang} dictionary={dictionary} />
    </div>
  );
}
