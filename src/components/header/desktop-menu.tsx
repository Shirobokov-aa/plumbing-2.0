"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from 'lucide-react'
import { MenuItem, Dictionary } from "@/types/types"
import { getLocalizedUrl } from "@/lib/menu-generator"


interface DesktopMenuProps {
  isOpen: boolean
  onClose: () => void
  menuData: MenuItem[]
  lang: string
  dictionary: Dictionary
}

export default function DesktopMenu({ isOpen, onClose, menuData, lang, dictionary }: DesktopMenuProps) {
  const [activeLevel1, setActiveLevel1] = useState<number | null>(null)
  const [activeLevel2, setActiveLevel2] = useState<number | null>(null)
  const [isLevel1Fixed, setIsLevel1Fixed] = useState(false)
  const [isLevel2Fixed, setIsLevel2Fixed] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Reset state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setActiveLevel1(null)
      setActiveLevel2(null)
      setIsLevel1Fixed(false)
      setIsLevel2Fixed(false)
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Если есть зафиксированные уровни, сначала их сбрасываем
        if (isLevel2Fixed) {
          setIsLevel2Fixed(false)
          setActiveLevel2(null)
        } else if (isLevel1Fixed) {
          setIsLevel1Fixed(false)
          setActiveLevel1(null)
          setActiveLevel2(null)
        } else {
          // Если ничего не зафиксировано, закрываем меню
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose, isLevel1Fixed, isLevel2Fixed])

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

  const handleLevel1Hover = (index: number) => {
    setActiveLevel1(index)
    // Сбрасываем состояние второго уровня при наведении на новый элемент первого уровня
    if (!isLevel2Fixed) {
      setActiveLevel2(null)
    }
  }

  const handleLevel1Click = (index: number) => {
    if (activeLevel1 === index && isLevel1Fixed) {
      // Если уже активен и зафиксирован, отменяем фиксацию
      setIsLevel1Fixed(false)
      setActiveLevel1(null)
      setActiveLevel2(null)
      setIsLevel2Fixed(false)
    } else {
      // Иначе активируем и фиксируем
      setActiveLevel1(index)
      setIsLevel1Fixed(true)
      setActiveLevel2(null)
      setIsLevel2Fixed(false)
    }
  }

  const handleLevel2Hover = (index: number) => {
    setActiveLevel2(index)
  }

  const handleLevel2Click = (index: number) => {
    if (activeLevel2 === index && isLevel2Fixed) {
      // Если уже активен и зафиксирован, отменяем фиксацию
      setIsLevel2Fixed(false)
      setActiveLevel2(null)
    } else {
      // Иначе активируем и фиксируем
      setActiveLevel2(index)
      setIsLevel2Fixed(true)
    }
  }

  const handleMenuAreaLeave = () => {
    // Скрываем все незафиксированные уровни при выходе из всей области меню
    if (!isLevel1Fixed) {
      setActiveLevel1(null)
      setActiveLevel2(null)
    } else if (!isLevel2Fixed) {
      setActiveLevel2(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Overlay для клика вне области */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Контейнер меню */}
      <div
        ref={menuRef}
        className="relative flex h-full"
        onMouseLeave={handleMenuAreaLeave}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Level 1 Menu */}
        <div className="w-64 h-full bg-white pt-24 px-6 overflow-y-auto relative">
          {/* Close button */}
          <button
            className="absolute top-6 right-6 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label={dictionary.menu.close_menu}
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="mb-6">
            <Image
              src="/image/logo-white.svg"
              alt="Abelsberg"
              width={180}
              height={24}
              className="object-contain invert"
            />
          </div>
          <ul className="space-y-6">
            {menuData.map((item, index) => (
              <li key={index}>
                {item.children ? (
                  <button
                    className={`text-left font-medium text-lg w-full transition-colors cursor-pointer ${
                      activeLevel1 === index ? "text-black font-bold" : "text-gray-700 hover:text-black"
                    }`}
                    onMouseEnter={() => handleLevel1Hover(index)}
                    onClick={() => handleLevel1Click(index)}
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    href={getLocalizedUrl(item.href || "#", lang)}
                    className="font-medium text-lg text-gray-700 hover:text-black transition-colors"
                    onClick={onClose}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Level 2 Menu */}
        {activeLevel1 !== null && menuData[activeLevel1]?.children && (
          <div className="w-64 h-full bg-gray-100 pt-24 px-6 overflow-y-auto border-l border-gray-200 ml-4">
            <ul className="space-y-6">
              {menuData[activeLevel1].children?.map((subItem, subIndex) => (
                <li key={subIndex}>
                  {subItem.children ? (
                    <button
                      className={`text-left font-medium text-lg w-full transition-colors cursor-pointer ${
                        activeLevel2 === subIndex ? "text-black font-bold" : "text-gray-700 hover:text-black"
                      }`}
                      onMouseEnter={() => handleLevel2Hover(subIndex)}
                      onClick={() => handleLevel2Click(subIndex)}
                    >
                      {subItem.title}
                    </button>
                  ) : (
                    <Link
                      href={getLocalizedUrl(subItem.href || "#", lang)}
                      className="font-medium text-lg text-gray-700 hover:text-black transition-colors"
                      onClick={onClose}
                    >
                      {subItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Level 3 Menu */}
        {activeLevel1 !== null &&
          activeLevel2 !== null &&
          menuData[activeLevel1]?.children?.[activeLevel2]?.children && (
            <div className="w-64 h-full bg-gray-50 pt-24 px-6 overflow-y-auto border-l border-gray-200 ml-4">
              <ul className="space-y-6">
                {menuData[activeLevel1].children?.[activeLevel2].children?.map((subSubItem, subSubIndex) => (
                  <li key={subSubIndex}>
                    <Link
                      href={getLocalizedUrl(subSubItem.href || "#", lang)}
                      className="font-medium text-lg text-gray-700 hover:text-black transition-colors"
                      onClick={onClose}
                    >
                      {subSubItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  )
}
