"use client";
// import { useState } from "react";

import { BannerSlider } from "@/components/blocks/banner-slider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Main from "@/components/Main";
// import mockData from "./data/mockData";

export default function Home() {
  // const [data] = useState(mockData);
  return (
    <div>
      <Header />
      <BannerSlider />
      <Main
      // data={data}
      />
      <Footer />
    </div>
  );
}
