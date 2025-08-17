import { ReactNode } from 'react'
import { locales } from '@/middleware'
import { AuthProvider } from "@/components/providers/session-provider";
import { Metadata } from 'next';
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    {
      path: '../../../public/fonts/TT_Norms_Pro_Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Thin_Italic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_ExtraLight_Italic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Light_Italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Normal_Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Medium_Italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_DemiBold_Italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Bold_Italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_ExtraBold_Italic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_Black_Italic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_ExtraBlack.woff2',
      weight: '950',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/TT_Norms_Pro_ExtraBlack_Italic.woff2',
      weight: '950',
      style: 'italic',
    }
  ],
  variable: '--font-tt-norms-pro',
  display: 'swap',
})

// Вспомогательная функция для безопасного получения параметра lang
async function getLangParam(params: Promise<{ lang: string }> | { lang: string }) {
  const resolvedParams = await Promise.resolve(params);
  return resolvedParams.lang as "en" | "ru";
}

// Генерация метаданных для макета с поддержкой локализации
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}): Promise<Metadata> {
  const lang = await getLangParam(params);

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
    title: titles[lang],
    description: descriptions[lang],
  };
}

// Предварительная генерация параметров для статических маршрутов
export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

// Основной макет для языкового сегмента
export default async function LangLayout({
  children,
  // params, // Добавляем params, чтобы получить доступ к языку при необходимости
}: {
  children: ReactNode,
  params: Promise<{ lang: string }> | { lang: string };
}) {
  // Макет не использует параметр lang напрямую в рендеринге
  // Язык используется в метаданных и доступен дочерним компонентам

  return (
    <div id="root" className={myFont.className}>
      <AuthProvider>{children}</AuthProvider>
    </div>
  )
}

// import { ReactNode } from 'react'
// import { locales } from '@/middleware'
// import { AuthProvider } from "@/components/providers/session-provider";



// export async function generateStaticParams() {
//   return locales.map(lang => ({ lang }))
// }

// export default async function LangLayout({
//   children,
// }: {
//   children: ReactNode
// }) {
//   // Макет не использует параметр lang напрямую
//   // Язык используется в дочерних компонентах

//   return (
//     <div id="root">
//       <AuthProvider>{children}</AuthProvider>
//     </div>
//   )
// }
