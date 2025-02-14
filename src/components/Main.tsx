import React from "react";
import Link from "next/link";
import Image from "next/image";
import Collections from "./blocks/collections";
import { Button } from "@/components/ui/button";
import ImageBlock from "./blocks/image-block";
import { useSections } from "@/app/admin/contexts/SectionsContext";


export default function Main() {
  const { sections, isLoading } = useSections();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!sections) {
    return <div>Ошибка загрузки данных</div>;
  }

  const section1 = sections["section-1"] || {};
  const section2 = sections["section-2"] || {};
  const section3 = sections["section-3"] || {};
  const section4 = sections["section-4"] || {};
  const section5 = sections["section-5"] || {};

  const imagesForCollections = section4?.images_block?.map((item) => ({
    src: item.src || "",
    alt: item.alt || "",
    desc: item.desc || "",
    url: item.url || ""
  })) || [];

  return (
    <main>
      <section className="container max-w-1440 mx-auto lg:px-24 px-5 py-32">
        <div className="flex xl:flex-row flex-col-reverse gap-20">
          <div className="xl:max-w-[520px] w-full">
            <div className="flex flex-col justify-between">
              <div className="max-w-[520px] flex flex-col gap-14">
                <h2 className="lg:text-h2 text-h2Lg">{section1?.title || ""}</h2>
                <p className="text-desc">{section1?.description || ""}</p>
              </div>
              <div className="flex xl:flex-col flex-col pt-5 gap-10">
                <div>
                  <Link
                    href={`${section1?.link?.url}`}
                    className="text-desc border-b border-black"
                  >
                    {section1?.link?.name}
                  </Link>
                </div>
                <div className="flex justify-between xl:gap-20 gap-5">
                  {section1?.images_block?.map((item, index) => (
                    <div key={index} className="xl:max-w-[270px] w-full xl:max-h-[270px] h-full">
                      <Image
                        src={item.src || "/img/fallback-image.png"}
                        alt={item.alt || "Fallback image"}
                        width={350}
                        height={350}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="w-full h-full  flex justify-center items-center">
              <Image
                src={section1?.images?.[0] || "/img/fallback-image.png"}
                alt=""
                width={570}
                height={500}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="lg:block hidden max-w-1440 mx-auto lg:px-24 px-5 pt-24">
          <div className="relative w-full xl:h-[780px]">
            <Image
              src={section2?.images?.[0] || "/img/fallback-image.png"}
              alt=""
              width={1240}
              height={780}
              className="object-contain "
            />
            <Link href={`${section2?.link?.url}`} className="">
              <div className="absolute top-24 left-0 lg:py-9 py-7 lg:px-[150px] px-24 bg-[#1E1E1E] text-white">
                <h2 className="lg:text-xl font-light border-b border-b-white">
                  {section2?.link?.name}
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
          <div className="flex xl:flex-row flex-col-reverse xl:gap-24 gap-5">
            <div className="xl:max-w-[526px] w-full">
              <Image
                src={section3?.images?.[0] || "/img/fallback-image.png"}
                alt=""
                width={526}
                height={526}
                className="object-contain "
              />
            </div>
            <div className="xl:max-w-[614px] w-full flex flex-col justify-between">
              <div className="flex flex-col gap-11">
                <h2 className="lg:text-h2 text-h2Lg">{section3?.title}</h2>
                <p className="lg:text-desc">{section3?.description}</p>
              </div>
              <div className="xl:pt-0 pt-10">
                <Link href={`${section3?.link?.url}`} className="text-desc border-b border-black">
                  {section3?.link?.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
          <div>
            <h2 className="lg:text-h2 text-h2Lg">{section4?.title}</h2>
            <p className="lg:text-desc py-7">{section4?.description}</p>
          </div>
          <div>
            <Collections images={imagesForCollections} />
          </div>
          <div className="flex justify-center items-center pt-16">
            <Link
              href={`${section4?.link?.url}`}
              className="lg:max-w-[466px] max-w-[325px] w-full lg:h-[89px] h-[55px]"
            >
              <Button className="max-w-[466px] w-full lg:h-[89px] h-[55px] flex justify-center items-center rounded-none bg-[#3E3E3E] text-xl underline">
                {section4?.link?.name}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-24">
          <div className="flex xl:flex-row flex-col-reverse gap-5">
            <ImageBlock images={section5?.images_block ?? []} />
            <div className="xl:max-w-[400px] w-full flex flex-col justify-between">
              <div>
                <h2 className="lg:text-h2 text-h2Lg">{section5?.title}</h2>
                <p className="lg:text-desc pt-[45px]">
                {section5?.description}
                </p>
              </div>
              <div className="xl:pt-0 pt-11">
                <Link href={`${section5?.link?.url}`} className="text-desc border-b">
                {section5?.link?.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
