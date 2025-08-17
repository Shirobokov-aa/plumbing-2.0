'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales } from '@/middleware'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const pathName = usePathname()
  const router = useRouter()

  const currentLocale = pathName.split('/')[1]

  const handleLanguageChange = (newLocale: string) => {
    if (currentLocale === newLocale) return

    // Заменяем текущую локаль в пути на новую
    const newPath = pathName.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe size={17} />
      <div className="flex gap-2">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`${
              currentLocale === locale
                ? 'font-bold'
                : 'text-gray-600'
            } hover:text-gray-900`}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
