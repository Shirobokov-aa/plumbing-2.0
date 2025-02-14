"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    {
      title: "Главная страница",
      items: [
        { title: "Слайдер", href: "/admin/slider" },
        { title: "Секция 1", href: "/admin/main/section-1" },
        { title: "Секция 2", href: "/admin/main/section-2" },
        { title: "Секция 3", href: "/admin/main/section-3" },
        { title: "Секция 4", href: "/admin/main/section-4" },
        { title: "Секция 5", href: "/admin/main/section-5" },
      ],
    },
    {
      title: "Коллекции",
      items: [
        { title: "Все коллекции", href: "/admin/collections" },
        { title: "Добавить коллекцию", href: "/admin/collections/add" },
        { title: "Обновить ссылки", href: "/admin/collections/update-links" },
      ],
    },
    {
      title: "Детальные страницы",
      items: [
        { title: "Все страницы", href: "/admin/collection-detail" },
        { title: "Добавить страницу", href: "/admin/collection-detail/add" },
      ],
    },
    {
      title: "Ванная",
      items: [
        { title: "Баннер", href: "/admin/bathroom/banner" },
        { title: "Секции", href: "/admin/bathroom/sections" },
        { title: "Коллекции", href: "/admin/bathroom/collections" },
      ],
    },
    {
      title: "Кухня",
      items: [
        { title: "Баннер", href: "/admin/kitchen/banner" },
        { title: "Секции", href: "/admin/kitchen/sections" },
        { title: "Коллекции", href: "/admin/kitchen/collections" },
      ],
    },
    {
      title: "О компании",
      items: [
        { title: "Общие настройки", href: "/admin/about" },
        { title: "Баннер", href: "/admin/about/banner" },
        { title: "Секции", href: "/admin/about/sections" },
      ],
    },
  ]

  return (
    <div className="w-64 bg-gray-100 border-r flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/admin/signin" })}
          title="Выйти"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" className="w-full">
            {sidebarItems.map((section, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  {section.items.map((item, itemIndex) => (
                    <Link href={item.href} key={itemIndex}>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                      >
                        {item.title}
                      </Button>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

