// DynamicHeader.tsx
import { getProductCategories } from "@/actions/catalog";
import { Dictionary } from "@/types/types";
import { generateMenuFromCategoriesAndDictionary } from "@/lib/menu-generator";
import DynamicHeaderClient from "./DynamicHeader.client";

interface DynamicHeaderProps {
  lang: string;
  dictionary: Dictionary;
  theme?: "black" | "white";
}

export default async function DynamicHeader({ lang, dictionary, theme = "white" }: DynamicHeaderProps) {
  // Получаем категории из базы данных
  const { data: categories } = await getProductCategories(lang);

  console.log(`Категории для языка ${lang}:`, categories ? categories.length : 0);

  if (!categories || categories.length === 0) {
    console.log("Внимание: категории не получены!");
  }

  // Формируем структуру меню на основе категорий и словаря
  const menuData = generateMenuFromCategoriesAndDictionary(dictionary, categories);

  console.log("Сгенерировано меню:", menuData.length > 0 ? "Да" : "Нет");
  console.log("Первый уровень:", menuData.map(item => item.title).join(", "));

  if (menuData[0]?.children) {
    console.log("Количество категорий:", menuData[0].children.length);
    console.log("Категории:", menuData[0].children.map(item => item.title).join(", "));
  }

  return <DynamicHeaderClient lang={lang} dictionary={dictionary} theme={theme} menuData={menuData} />;
}
