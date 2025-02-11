import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/app/actions/collections";

// interface CollectionItem {
//   id: number;
//   image: string;
//   title: string;
//   desc: string;
//   link: string;
//   flexDirection: "xl:flex-row" | "xl:flex-row-reverse";
// }

export default async function Collections() {
  const { collections, error } = await getCollections();

  if (error) {
    return <div>Ошибка загрузки коллекций: {error}</div>;
  }

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <section className="max-w-1440 mx-auto lg:px-24 px-5 pt-32">
        <div className="text-center">
          <h2 className="lg:text-h2 text-h2Lg">Коллекции</h2>
        </div>
        <div className="flex flex-col gap-24 pt-24">
          {collections?.map((item) => (
            <div
              key={item.id}
              className={`flex ${item.flexDirection} flex-col-reverse xl:gap-24 gap-5`}
            >
              <div className="xl:max-w-[526px] w-full">
                <Image src={item.image} alt={item.title} width={526} height={526} className="object-contain" />
              </div>
              <div className="xl:max-w-[614px] w-full flex flex-col justify-around">
                <div className="flex flex-col gap-11">
                  <h2 className="lg:text-colH2 text-colH2Lg">{item.title}</h2>
                  <p className="lg:text-desc">{item.desc}</p>
                </div>
                <div className="xl:pt-0 pt-10">
                  <Link href={`/collections/collection-detail/${item.title.toLowerCase()}`} className="text-desc border-b border-black">
                    Посмотреть
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
