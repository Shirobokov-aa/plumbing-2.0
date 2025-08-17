// // lib/category-mapper.ts

// /**
//  * Маппинг слагов категорий из БД на предопределенные слаги для роутинга
//  */
// export const categorySlugMappings: Record<string, string> = {
//   // Русские слаги -> Английские слаги для роутинга
//   "vannaya": "bathroom",
//   "кухня": "kitchen",
//   "ванная": "bathroom",
//   "kuhnya": "kitchen",
//   "vannaya-komnata": "bathroom",
//   "kukhnya": "kitchen"
// };

// /**
//  * Маппинг слагов подкатегорий из БД на предопределенные слаги для роутинга
//  */
// export const subcategorySlugMappings: Record<string, string> = {
//   // Слаги подкатегорий из БД -> Слаги для роутинга
//   "смесители-для-раковины": "sink-mixers",
//   "smesiteli-dlya-rakoviny": "sink-mixers",
//   "смесители-для-ванны-и-душа": "bath-shower-mixers",
//   "smesiteli-dlya-vanny-i-dusha": "bath-shower-mixers",
//   "душевые-системы": "shower-systems",
//   "dushevye-sistemy": "shower-systems",
//   "унитазы": "toilets",
//   "unitazy": "toilets",
//   "смесители-для-кухни": "kitchen-mixers",
//   "smesiteli-dlya-kuhni": "kitchen-mixers",
//   "дозаторы": "dispensers",
//   "dozatory": "dispensers"
// };

// /**
//  * Преобразует слаг категории в предопределенный слаг для маршрутизации
//  * @param slug Оригинальный слаг категории
//  * @returns Маппированный слаг для маршрутизации или оригинальный слаг
//  */
// export function mapCategorySlugToRoute(slug: string): string {
//   return categorySlugMappings[slug.toLowerCase()] || slug;
// }

// /**
//  * Преобразует слаг подкатегории в предопределенный слаг для маршрутизации
//  * @param slug Оригинальный слаг подкатегории
//  * @returns Маппированный слаг для маршрутизации или оригинальный слаг
//  */
// export function mapSubcategorySlugToRoute(slug: string): string {
//   return subcategorySlugMappings[slug.toLowerCase()] || slug;
// }

// /**
//  * Обратное преобразование предопределенного слага маршрутизации в слаг из БД
//  * @param routeSlug Предопределенный слаг маршрутизации
//  * @returns Массив возможных слагов из БД для данного маршрута
//  */
// export function mapRouteToDbSlug(routeSlug: string): string[] {
//   const reverseMappings: string[] = [];

//   // Сначала добавляем сам routeSlug (он может быть и прямым слагом из БД)
//   reverseMappings.push(routeSlug);

//   // Затем добавляем все слаги из БД, которые маппятся на данный routeSlug
//   Object.entries(categorySlugMappings).forEach(([dbSlug, mappedRouteSlug]) => {
//     if (mappedRouteSlug.toLowerCase() === routeSlug.toLowerCase()) {
//       reverseMappings.push(dbSlug);
//     }
//   });

//   return reverseMappings;
// }

// /**
//  * Обратное преобразование предопределенного слага подкатегории в слаг из БД
//  * @param routeSlug Предопределенный слаг подкатегории для маршрутизации
//  * @returns Массив возможных слагов подкатегорий из БД для данного маршрута
//  */
// export function mapRouteToDbSubcategorySlug(routeSlug: string): string[] {
//   if (!routeSlug) return [];

//   const reverseMappings: string[] = [];

//   // Сначала добавляем сам routeSlug
//   reverseMappings.push(routeSlug);

//   // Затем добавляем все слаги из БД, которые маппятся на данный routeSlug
//   Object.entries(subcategorySlugMappings).forEach(([dbSlug, mappedRouteSlug]) => {
//     if (mappedRouteSlug.toLowerCase() === routeSlug.toLowerCase()) {
//       reverseMappings.push(dbSlug);
//     }
//   });

//   return reverseMappings;
// }


// lib/category-mapper.ts
// Файл-заглушка для обратной совместимости
// В будущем рекомендуется удалить этот файл и все зависимости от него

// Просто возвращаем тот же слаг без преобразований
export function mapCategorySlugToRoute(slug: string): string {
  return slug;
}

// Просто возвращаем тот же слаг без преобразований
export function mapSubcategorySlugToRoute(slug: string): string {
  return slug;
}

// Возвращаем массив с одним элементом - исходным слагом
export function mapRouteToDbSlug(routeSlug: string): string[] {
  return [routeSlug];
}

// Возвращаем массив с одним элементом - исходным слагом
export function mapRouteToDbSubcategorySlug(routeSlug: string): string[] {
  return routeSlug ? [routeSlug] : [];
}

// Пустые маппинги для обратной совместимости
export const categorySlugMappings: Record<string, string> = {};
export const subcategorySlugMappings: Record<string, string> = {};
