// import { getDictionary } from '@/dictionaries'

// import Header from '@/components/Header';
// import Main from '@/components/Main';
// import Footer from "@/components/Footer";


// export default function Home({ params: { lang } }: { params: { lang: 'en' | 'ru' } }) {
//   const dictionary = await getDictionary(lang)

//   return (
//     <div>
//       <Header />
//       <Main lang={lang} dictionary={dictionary} />
//       <Footer lang={lang} dictionary={dictionary} />
//     </div>
//   );
// }

export default function RootPage() {
  return null; // Эта страница перенаправляется middleware
}
