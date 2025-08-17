"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import MobileMenu from "./mobile-menu";
import DesktopMenu from "./desktop-menu";
import SearchDialog from "./search-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dictionary, MenuItem } from "@/types/types";

interface DynamicHeaderClientProps {
  lang: string;
  dictionary: Dictionary;
  theme?: "black" | "white";
  menuData: MenuItem[];
}

export default function DynamicHeaderClient({ lang, dictionary, theme = "white", menuData }: DynamicHeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const safeMenuData = Array.isArray(menuData) ? menuData : [];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const textColor = theme === "black" ? "text-black" : "text-white";
  const logoSrc = theme === "black" ? "/image/logo-black.svg" : "/image/logo-white.svg";

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 rounded-[10px] max-w-[1440px] mx-auto px-2 py-2 my-5">
        <div className={`flex items-center justify-between p-4 ${textColor}`}>
          <div className="burger-menu">
            <button
              className="flex flex-col space-y-1.5 focus:outline-none"
              onClick={() => setIsMenuOpen(true)}
              aria-label={dictionary.menu.open_menu}
            >
              <Menu className={`w-6 h-6 ${textColor}`} />
            </button>
          </div>
          <div className="logo">
            <Link href={`/${lang}`} className={`flex items-center gap-2 ${textColor}`}>
              <Image src={logoSrc} alt="Logo" width={250} height={33} className="object-contain" priority />
            </Link>
          </div>
          <div className="search">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="focus:outline-none"
              aria-label="Поиск"
            >
              <Search className={`w-6 h-6 cursor-pointer ${textColor}`} />
            </button>
          </div>
        </div>
      </header>

      {isMobile ? (
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          menuData={safeMenuData}
          lang={lang}
          dictionary={dictionary}
        />
      ) : (
        <DesktopMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          menuData={safeMenuData}
          lang={lang}
          dictionary={dictionary}
        />
      )}

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
      />
    </>
  );
}
