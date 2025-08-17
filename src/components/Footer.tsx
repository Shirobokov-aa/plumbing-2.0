"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDirections } from "@/actions/query";
import LanguageSwitcher from "./LanguageSwitcher";

interface Dictionary {
  navigation: {
    about: string;
    contacts: string;
    warranty: string;
    wheretobuy: string;
  };
  categories: {
    bathroom: string;
    kitchen: string;
    collection: string;
  };
  footer: {
    social: string;
    language: string;
  };
}

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

export default function Footer({ lang, dictionary }: { lang: string; dictionary: Dictionary }) {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const { items } = await getDirections(lang);
        setDirections(items || []);
      } catch (error) {
        console.error("Ошибка при загрузке направлений:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirections();
  }, [lang]);

  return (
    <footer>
      <div className="max-w-[1440px] px-6 md:px-12 pt-12 md:pt-24 pb-16 md:pb-32 mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-0">
          <div>
            <Link href={`/${lang}`} className="flex gap-2 text-white">
              <Image src="/image/logo-black.svg" alt="Logo" width={240} height={32} className="object-contain" />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-48 text-lg md:text-xl">
            {/* <div>
              <ul className="flex flex-col gap-2 text-gray-800">
                <li>
                  <Link href={`/${lang}/about`}>{dictionary.navigation.about}</Link>
                </li>
                <li>
                  <Link href={`/${lang}/contacts`}>{dictionary.navigation.contacts}</Link>
                </li>
                <li>
                  <Link href={`/${lang}/warranty`}>{dictionary.navigation.warranty}</Link>
                </li>
                <li>
                  <Link href={`/${lang}/wheretobuy`}>{dictionary.navigation.wheretobuy}</Link>
                </li>
              </ul>
            </div> */}
            <div>
              <ul className="flex flex-col gap-2 text-gray-800">
                {isLoading ? (
                  // Показываем заглушку во время загрузки
                  <>
                    <li>
                      <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                    </li>
                    <li>
                      <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                    </li>
                    <li>
                      <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                    </li>
                  </>
                ) : directions.length > 0 ? (
                  directions.map((direction) => (
                    <li key={direction.id}>
                      <Link href={`/${lang}${direction.link}`}>{direction.title}</Link>
                    </li>
                  ))
                ) : (
                  // Показываем статические ссылки, если нет данных
                  <>
                    <li>
                      <Link href={`/${lang}/products/vannaya-komnata`}>{dictionary.categories.bathroom}</Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/products/kuhnya`}>{dictionary.categories.kitchen}</Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/collections`}>{dictionary.categories.collection}</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <div className="flex flex-col gap-4 md:gap-2 text-gray-800">
                <div>
                  {dictionary.footer.social}
                  <div className="flex items-center gap-4 mt-2">
                    <Link href={"https://vk.com/club229951898"} target="_blank">
                      <Image src="/image/social/vk.svg" alt="VK" width={17} height={17} className="object-contain" />
                    </Link>
                    <Link href={"https://www.youtube.com/channel/UC5cKScTDJl0o3KDZU77VPLw"} target="_blank">
                      <Image
                        src="/image/social/youtube.svg"
                        alt="Youtube"
                        width={17}
                        height={17}
                        className="object-contain"
                      />
                    </Link>
                    <Link href={"https://www.pinterest.com/Abelsberg_official/"} target="_blank">
                      <Image
                        src="/image/social/pinterest.svg"
                        alt="Pinterest"
                        width={17}
                        height={17}
                        className="object-contain"
                      />
                    </Link>
                  </div>
                </div>
                <div className="pt-4 md:pt-4 hidden">
                  <div>{dictionary.footer.language}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-gray-200 w-full">
        <div className="max-w-[1440px] px-6 md:px-12 pt-12 md:pt-12 pb-16 md:pb-16 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-0">
            <p className="text-gray-800 text-lg">
              Пулковское шоссе 40, к. 4
              <br />
              196146 Санкт-Петербург
              <br />
              Российская Федерация
              <br />
              <span>@: </span>
              <a href="mailto:info@abelsberg.com">info@abelsberg.com</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
