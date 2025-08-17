import type { Metadata } from "next";
import "./globals.css";
// import { Geist, Geist_Mono } from "next/font/google";
import localFont from 'next/font/local'

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   display: "swap",
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: "swap",
// });

const myFont = localFont({
  src: [
    {
      path: '../../public/fonts/TT_Norms_Pro_Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Thin_Italic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_ExtraLight_Italic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Light_Italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Normal_Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Medium_Italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_DemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_DemiBold_Italic.woff2',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Bold_Italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_ExtraBold_Italic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_Black_Italic.woff2',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_ExtraBlack.woff2',
      weight: '950',
      style: 'normal',
    },
    {
      path: '../../public/fonts/TT_Norms_Pro_ExtraBlack_Italic.woff2',
      weight: '950',
      style: 'italic',
    }
  ],
  variable: '--font-tt-norms-pro',
  display: 'swap',
})

// Вместо этого используем динамические метаданные
export async function generateMetadata(): Promise<Metadata> {
  // По умолчанию используем русский язык
  return {
    title: {
      template: '%s | Abelsberg',
      default: 'Abelsberg - Сантехника и аксессуары для ванных комнат',
    },
    description: 'Abelsberg - Официальный сайт',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${myFont.className} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
