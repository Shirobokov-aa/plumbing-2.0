"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Layout, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  items?: {
    title: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  // {
  //   title: "Главная страница",
  //   href: "/admin",
  //   icon: <Home className="h-4 w-4" />,
  // },
  {
    title: "Контент",
    href: "",
    icon: <Layout className="h-4 w-4" />,
    items: [
      {
        title: "Баннер на главной странице",
        href: "/admin/hero",
      },
      {
        title: "Направления",
        href: "/admin/directions",
      },
      {
        title: "Страница бренда",
        href: "/admin/brand",
      },
    ],
  },
  {
    title: "Каталог",
    href: "/admin/catalog",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Коллекции",
    href: "/admin/collections",
    icon: <Layout className="h-4 w-4" />,
    items: [
      {
        title: "Список коллекций",
        href: "/admin/collections",
      },
      // {
      //   title: "Создать коллекцию",
      //   href: "/admin/collections/create",
      // },
    ],
  },
];

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Мобильная версия */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <ScrollArea className="h-full py-6">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold">Админ-панель</h2>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                          pathname === item.href ? "bg-accent" : "transparent"
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                      {item.items && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                                pathname === subItem.href ? "bg-accent" : "transparent"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Десктопная версия */}
      <div className={cn("hidden lg:block", className)}>
        <ScrollArea className="h-full py-6">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Админ-панель</h2>
              <div className="flex items-center gap-4 mt-4 mb-4">
                <Link href="/" className="text-sm text-muted-foreground flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Вернуться на сайт
                </Link>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                        pathname === item.href ? "bg-accent" : "transparent"
                      )}
                    >
                      {item.icon}
                      {!isCollapsed && item.title}
                    </Link>
                    {item.items && !isCollapsed && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                              pathname === subItem.href ? "bg-accent" : "transparent"
                            )}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
