"use client";

import { BannerSlider } from "@/components/blocks/banner-slider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Main from "@/components/Main";

export default function Home() {

  return (
    <div>
      <Header />
      <BannerSlider />
      <Main
      />
      <Footer />
    </div>
  );
}
