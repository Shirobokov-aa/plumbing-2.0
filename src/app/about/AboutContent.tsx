"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import AboutBanner from "@/components/about/AboutBanner";
import AboutShower from "@/components/about/AboutShower";

interface AboutPageData {
  banner: {
    name: string;
    image: string;
    title: string;
    description: string;
    link: {
      text: string;
      url: string;
    };
  };
  sections: Array<{
    id: number;
    title: string;
    description: string;
    order: number;
  }>;
}

interface AboutContentProps {
  data: AboutPageData;
}

export default function AboutContent({ data }: AboutContentProps) {
  return (
    <>
      <section>
        <div className="max-w-1440 mx-auto lg:px-24 px-5 pt-28">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/about">О компании</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      {data.banner && (
        <section>
          <AboutBanner {...data.banner} />
        </section>
      )}
      <section>
        {data.sections.map((section) => (
          <section key={section.id}>
            <AboutShower {...section} />
          </section>
        ))}
      </section>
    </>
  );
}
