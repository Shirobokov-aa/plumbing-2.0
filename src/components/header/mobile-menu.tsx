"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { MenuItem, Dictionary } from "@/types/types"
import { getLocalizedUrl } from "@/lib/menu-generator"

// type MenuItem = {
//   title: string
//   href?: string
//   children?: MenuItem[]
// }

// interface MobileMenuProps {
//   isOpen: boolean
//   onClose: () => void
//   menuData: MenuItem[]
// }

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  menuData: MenuItem[]
  lang: string
  dictionary: Dictionary
}

export default function MobileMenu({ isOpen, onClose, menuData, lang, dictionary }: MobileMenuProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [activeLevel1Index, setActiveLevel1Index] = useState<number | null>(null)
  const [activeLevel2Index, setActiveLevel2Index] = useState<number | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentLevel(1)
      setActiveLevel1Index(null)
      setActiveLevel2Index(null)
      setBreadcrumbs([])
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // const goToLevel1 = () => {
  //   setCurrentLevel(1)
  //   setActiveLevel1Index(null)
  //   setActiveLevel2Index(null)
  //   setBreadcrumbs([])
  // }

  const goToLevel2 = (index: number, title: string) => {
    setCurrentLevel(2)
    setActiveLevel1Index(index)
    setActiveLevel2Index(null)
    setBreadcrumbs([title])
  }

  const goToLevel3 = (index: number, title: string) => {
    setCurrentLevel(3)
    setActiveLevel2Index(index)
    setBreadcrumbs([breadcrumbs[0], title])
  }

  const goBack = () => {
    if (currentLevel === 3) {
      setCurrentLevel(2)
      setActiveLevel2Index(null)
      setBreadcrumbs([breadcrumbs[0]])
    } else if (currentLevel === 2) {
      setCurrentLevel(1)
      setActiveLevel1Index(null)
      setBreadcrumbs([])
    }
  }

  if (!isOpen) return null

  return (
    <div ref={menuRef} className="fixed inset-0 z-50 bg-white overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {currentLevel > 1 && (
              <button onClick={goBack} className="mr-2 p-2">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="logo">
              <Image src="/image/logo-white.svg" alt="Logo" width={150} height={25} className="object-contain invert" />
            </div>
          </div>
          <button onClick={onClose} className="p-2">
            <span className="sr-only">{dictionary.menu.close}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="px-4 py-2 bg-gray-100 text-sm text-gray-600">{breadcrumbs.join(" / ")}</div>
        )}

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {currentLevel === 1 && (
            <ul className="p-4 space-y-4">
              {menuData.map((item, index) => (
                <li key={index} className="border-b pb-3">
                  {item.children ? (
                    <button
                      className="flex items-center justify-between w-full text-left py-2 font-medium"
                      onClick={() => goToLevel2(index, item.title)}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ) : (
                    <Link href={getLocalizedUrl(item.href || "#", lang)} className="block py-2 font-medium" onClick={onClose}>
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}

          {currentLevel === 2 && activeLevel1Index !== null && (
            <ul className="p-4 space-y-4">
              {menuData[activeLevel1Index].children?.map((item, index) => (
                <li key={index} className="border-b pb-3">
                  {item.children ? (
                    <button
                      className="flex items-center justify-between w-full text-left py-2 font-medium"
                      onClick={() => goToLevel3(index, item.title)}
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ) : (
                    <Link href={getLocalizedUrl(item.href || "#", lang)} className="block py-2 font-medium" onClick={onClose}>
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}

          {currentLevel === 3 && activeLevel1Index !== null && activeLevel2Index !== null && (
            <ul className="p-4 space-y-4">
              {menuData[activeLevel1Index].children?.[activeLevel2Index].children?.map((item, index) => (
                <li key={index} className="border-b pb-3">
                  <Link href={getLocalizedUrl(item.href || "#", lang)} className="block py-2 font-medium" onClick={onClose}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
