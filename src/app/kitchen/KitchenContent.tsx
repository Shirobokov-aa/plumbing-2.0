"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import { useSections } from "@/app/admin/contexts/SectionsContext";
import KitchenCollection from "@/components/kitchen/KitchenCollection";
import KitchenBanner from "@/components/kitchen/KitchenBanner";
import KitchenShower from "@/components/kitchen/KitchenShower";

export default function KitchenPage() {
  const { kitchenPage } = useSections();

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
                <BreadcrumbLink href="/kitchen">Кухня</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>
      <section>
        <KitchenBanner {...kitchenPage.banner} />
      </section>
      {kitchenPage.sections.map((section, index) => (
        <section key={index}>
          <KitchenShower {...section} />
        </section>
      ))}
      {kitchenPage.collections.map((collection, index) => (
        <section key={index}>
          <KitchenCollection {...collection} />
        </section>
      ))}
    </>
  );
}
