// menu-generator.ts
import { getProductCategories } from "@/actions/catalog";
import { MenuItem, Dictionary } from "@/types/types";
import { ProductCategory } from "@/types/catalog";

/**
 * Создает локализованный URL, добавляя префикс языка
 * @param url Базовый URL
 * @param lang Текущий язык
 * @returns Локализованный URL
 */
export function getLocalizedUrl(url: string, lang: string): string {
  if (!url) return `/${lang}`;

  // Если URL начинается с /, добавляем язык
  if (url.startsWith("/")) {
    return `/${lang}${url}`;
  }

  return `/${lang}/${url}`;
}

/**
 * Генерирует гибридную структуру меню:
 * - Первый уровень статический из словаря
 * - Категории и подкатегории товаров динамические из БД
 * @param dictionary Словарь с локализованными строками
 * @param categories Массив категорий из БД
 * @returns Массив элементов меню
 */
export function generateMenuFromCategoriesAndDictionary(
  dictionary: Dictionary,
  categories: ProductCategory[] = []
): MenuItem[] {
  if (!dictionary || !dictionary.menu) {
    console.log("Предупреждение: dictionary или dictionary.menu не определены");
    return [];
  }

  const { menu } = dictionary;

  // Определяем наличие вложенных объектов в меню
  const hasBathroom = typeof menu.bathroom === 'object' && menu.bathroom !== null;
  const hasKitchen = typeof menu.kitchen === 'object' && menu.kitchen !== null;

  // Создаем базовую структуру меню
  const baseMenu: MenuItem[] = [
    {
      title: menu.products,
      children: [
        // Здесь будут динамические категории
      ],
    },
    { title: menu.collections, href: "/collections" },
    { title: menu.about, href: "/brand" },
    // { title: menu.warranty_service, href: "/warranty-service" },
    // { title: menu.where_to_buy, href: "/where-to-buy" },
    // { title: menu.contacts, href: "/contacts" },
  ];

  // Безопасное извлечение значений из словаря
  const getBathValue = (key: string, defaultVal: string): string => {
    if (hasBathroom && typeof menu.bathroom === 'object' && menu.bathroom !== null) {
      const bathroom = menu.bathroom as Record<string, string>;
      return bathroom[key] || defaultVal;
    }
    return defaultVal;
  };

  const getKitchenValue = (key: string, defaultVal: string): string => {
    if (hasKitchen && typeof menu.kitchen === 'object' && menu.kitchen !== null) {
      const kitchen = menu.kitchen as Record<string, string>;
      return kitchen[key] || defaultVal;
    }
    return defaultVal;
  };

  // Если категории отсутствуют или их нет, вернем статическую структуру меню
  if (!categories || categories.length === 0) {
    console.log("Используем статическую структуру меню, так как категории отсутствуют");

    // Здесь используем дефолтные значения для слагов
    const bathroomSlug = "vannaya-komnata"; // Слаг для ванной
    const kitchenSlug = "kuhnya";           // Слаг для кухни

    // Добавляем статические подпункты для раздела "Продукты"
    baseMenu[0].children = [
      {
        title: getBathValue("title", "Ванная комната"),
        href: `/products/${bathroomSlug}`,
        children: [
          { title: getBathValue("sink_mixers", "Смесители для раковины"), href: `/products/${bathroomSlug}?subcategory=smesiteli-dlya-rakoviny` },
          { title: getBathValue("bath_shower_mixers", "Смесители для ванны и душа"), href: `/products/${bathroomSlug}?subcategory=smesiteli-dlya-vanny-i-dusha` },
          { title: getBathValue("shower_systems", "Душевые системы"), href: `/products/${bathroomSlug}?subcategory=dushevye-sistemy` },
          { title: getBathValue("toilets", "Унитазы"), href: `/products/${bathroomSlug}?subcategory=unitazy` },
        ],
      },
      {
        title: getKitchenValue("title", "Кухня"),
        href: `/products/${kitchenSlug}`,
        children: [
          { title: getKitchenValue("kitchen_mixers", "Кухонные смесители"), href: `/products/${kitchenSlug}?subcategory=smesiteli-dlya-kuhni` },
          {
            title: getKitchenValue("accessories", "Аксессуары"),
            href: `/products/${kitchenSlug}?category=aksessuary`,
            children: [
              { title: getKitchenValue("dispensers", "Дозаторы"), href: `/products/${kitchenSlug}?subcategory=dozatory` }
            ],
          },
        ],
      },
    ];

    return baseMenu;
  }

  // Фильтруем и сортируем родительские категории
  const parentCategories = categories
    .filter(cat => !cat.parentId)
    .sort((a, b) => a.order - b.order);

  console.log(`Найдено ${parentCategories.length} родительских категорий`);

  // Создаем массив для категорий продуктов
  const productCategories: MenuItem[] = [];

  // Преобразуем категории из БД в пункты меню
  for (const category of parentCategories) {
    // Напрямую используем слаг категории
    const categorySlug = category.slug;
    console.log(`Категория: ${category.name}, слаг: ${categorySlug}`);

    // Найдем все подкатегории для данной категории
    const subcategories = categories
      .filter(cat => cat.parentId === category.id)
      .sort((a, b) => a.order - b.order);

    console.log(`Категория ${category.name} имеет ${subcategories.length} подкатегорий`);

    // Создаем пункт меню для категории
    const categoryMenuItem: MenuItem = {
      title: category.name,
      href: `/products/${categorySlug}`,
      children: []
    };

    // Добавляем подкатегории, если они есть
    if (subcategories.length > 0) {
      categoryMenuItem.children = subcategories.map(subcat => {
        // Напрямую используем слаг подкатегории
        const subcategorySlug = subcat.slug;
        console.log(`Подкатегория: ${subcat.name}, слаг: ${subcategorySlug}`);

        return {
          title: subcat.name,
          href: `/products/${categorySlug}?subcategory=${subcategorySlug}`
        };
      });
    }

    // Добавляем категорию в массив категорий
    productCategories.push(categoryMenuItem);
  }

  // Если у нас есть категории из БД, используем их
  if (productCategories.length > 0) {
    console.log(`Используем ${productCategories.length} категорий из БД для меню`);
    baseMenu[0].children = productCategories;
  } else {
    console.log("Используем статическую структуру меню, так как категории из БД пусты");

    // Здесь используем дефолтные значения для слагов
    const bathroomSlug = "vannaya-komnata"; // Слаг для ванной
    const kitchenSlug = "kuhnya";           // Слаг для кухни

    // Добавляем статические подпункты для раздела "Продукты"
    baseMenu[0].children = [
      {
        title: getBathValue("title", "Ванная комната"),
        href: `/products/${bathroomSlug}`,
        children: [
          { title: getBathValue("sink_mixers", "Смесители для раковины"), href: `/products/${bathroomSlug}?subcategory=smesiteli-dlya-rakoviny` },
          { title: getBathValue("bath_shower_mixers", "Смесители для ванны и душа"), href: `/products/${bathroomSlug}?subcategory=smesiteli-dlya-vanny-i-dusha` },
          { title: getBathValue("shower_systems", "Душевые системы"), href: `/products/${bathroomSlug}?subcategory=dushevye-sistemy` },
          { title: getBathValue("toilets", "Унитазы"), href: `/products/${bathroomSlug}?subcategory=unitazy` },
        ],
      },
      {
        title: getKitchenValue("title", "Кухня"),
        href: `/products/${kitchenSlug}`,
        children: [
          { title: getKitchenValue("kitchen_mixers", "Кухонные смесители"), href: `/products/${kitchenSlug}?subcategory=smesiteli-dlya-kuhni` },
          {
            title: getKitchenValue("accessories", "Аксессуары"),
            href: `/products/${kitchenSlug}?category=aksessuary`,
            children: [
              { title: getKitchenValue("dispensers", "Дозаторы"), href: `/products/${kitchenSlug}?subcategory=dozatory` }
            ],
          },
        ],
      },
    ];
  }

  return baseMenu;
}

/**
 * Асинхронная функция для получения динамического меню
 * @param lang Язык контента
 * @param dictionary Словарь с локализованными строками
 * @returns Promise с массивом элементов меню
 */
export async function getDynamicMenu(lang: string, dictionary: Dictionary): Promise<MenuItem[]> {
  try {
    // Получаем все категории из базы данных
    const { data: categories } = await getProductCategories(lang);

    console.log("Категории получены:", categories?.length);

    // Генерируем меню с категориями из БД
    const menuData = generateMenuFromCategoriesAndDictionary(dictionary, categories);

    console.log("Сгенерировано меню, количество пунктов:", menuData?.length);

    return menuData;
  } catch (error) {
    console.error("Ошибка при получении динамического меню:", error);
    // В случае ошибки используем только статическую часть меню
    return generateMenuFromCategoriesAndDictionary(dictionary, []);
  }
}
