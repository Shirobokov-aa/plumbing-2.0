"use server";

import { db } from "@/db";
import { desc } from "drizzle-orm";
import { heroSection, directions, directionsEn, brandHeroSection, brandContent } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { collections, collectionPages } from "@/db/schema";
import { Collection, CollectionPage } from "@/types/types";

/**
 * Получение данных для Hero Section (баннера) с учетом языка
 */
export async function getHeroSection(lang: string = 'ru') {
  try {
    console.log(`Fetching hero section for language: ${lang}`);

    // Сначала ищем контент для указанного языка
    let data = await db.query.heroSection.findFirst({
      where: eq(heroSection.lang, lang),
      orderBy: desc(heroSection.createdAt),
    });

    // Если для указанного языка нет данных, используем русский как запасной вариант
    if (!data && lang !== 'ru') {
      console.log('Falling back to Russian language for hero section');
      data = await db.query.heroSection.findFirst({
        where: eq(heroSection.lang, 'ru'),
        orderBy: desc(heroSection.createdAt),
      });
    }

    console.log('Hero section data found:', data ? true : false);
    return { data };
  } catch (error) {
    console.error("Failed to fetch hero section:", error);
    return { error: "Failed to fetch hero section data" };
  }
}

/**
 * Получение данных для секции направлений с учетом языка
 */
export async function getDirections(lang: string = "ru") {
  try {
    console.log(`Fetching directions data for language: ${lang}`);

    const items = lang === "ru"
      ? await db.select().from(directions).orderBy(directions.order)
      : await db.select().from(directionsEn).orderBy(directionsEn.order);

    console.log(`Retrieved ${items.length} directions for ${lang}:`, items);

    return { items: items.map(item => ({ ...item, lang })) };
  } catch (error) {
    console.error("Failed to fetch directions:", error);
    return { error: "Не удалось загрузить направления", items: [] };
  }
}

/**
 * Получение всех коллекций
 */
export async function getCollections(lang: string = 'ru'): Promise<{ success: boolean; data?: Collection[]; error?: string }> {
  try {
    console.log(`[query.getCollections] Запрос коллекций для языка: ${lang}`);

    // Проверим сначала доступ к базе данных
    try {
      const result = await db
        .select()
        .from(collections)
        .orderBy(desc(collections.createdAt));

      console.log(`[query.getCollections] Получено ${result.length} коллекций из базы данных`);

      if (result.length === 0) {
        console.log('[query.getCollections] Коллекции отсутствуют в базе данных');
        return { success: true, data: [] };
      }

      console.log('[query.getCollections] Первая коллекция в базе:', {
        id: result[0].id,
        name: result[0].name,
        slug: result[0].slug,
        hasDescription: !!result[0].description,
        hasImage: !!result[0].imageBase64,
      });

      // Если указан язык, пытаемся загрузить информацию о страницах коллекций для этого языка
      if (lang) {
        // Получаем все страницы коллекций для данного языка
        const pages = await db
          .select()
          .from(collectionPages)
          .where(eq(collectionPages.lang, lang));

        console.log(`[query.getCollections] Получено ${pages.length} страниц коллекций для языка ${lang}`);

        if (pages.length > 0) {
          console.log('[query.getCollections] Первая страница коллекции:', {
            id: pages[0].id,
            collectionId: pages[0].collectionId,
            title: pages[0].title,
            hasHeroImage: !!pages[0].heroImage,
          });
        } else {
          console.log('[query.getCollections] Страницы коллекций отсутствуют для языка', lang);
        }

        // Создаем словарь для страниц коллекций по ID коллекции
        const pagesByCollectionId = pages.reduce((acc, page) => {
          acc[page.collectionId] = page;
          return acc;
        }, {} as Record<number, typeof collectionPages.$inferSelect>);

        // Обогащаем результаты данными со страниц коллекций
        const enrichedResults = result.map(collection => {
          const page = pagesByCollectionId[collection.id];
          return {
            ...collection,
            // Если есть страница коллекции с изображением, используем его
            imageBase64: page?.heroImage || collection.imageBase64,
          } as Collection;
        });

        console.log(`[query.getCollections] Возвращаем ${enrichedResults.length} обогащенных коллекций`);
        return { success: true, data: enrichedResults };
      }

      // Просто возвращаем коллекции без языкового контекста
      console.log(`[query.getCollections] Возвращаем ${result.length} коллекций (без языкового контекста)`);
      return { success: true, data: result as Collection[] };
    } catch (dbError) {
      console.error("[query.getCollections] Ошибка при запросе в базу данных:", dbError);
      return {
        success: false,
        error: `Ошибка базы данных: ${dbError instanceof Error ? dbError.message : String(dbError)}`
      };
    }
  } catch (error) {
    console.error("[query.getCollections] Критическая ошибка при получении коллекций:", error);
    // В случае ошибки возвращаем информацию об ошибке
    return {
      success: false,
      error: `Не удалось получить коллекции: ${error instanceof Error ? error.message : String(error)}`,
      data: []
    };
  }
}

/**
 * Получение коллекции по slug
 */
export async function getCollectionBySlug(slug: string): Promise<{ data: Collection | null }> {
  try {
    const result = await db
      .select()
      .from(collections)
      .where(eq(collections.slug, slug))
      .limit(1);

    return { data: result[0] as Collection || null };
  } catch (error) {
    console.error(`Error fetching collection by slug ${slug}:`, error);
    return { data: null };
  }
}

/**
 * Получение страницы коллекции
 */
export async function getCollectionPage(collectionId: number, lang: string = 'ru'): Promise<{ data: CollectionPage | null }> {
  try {
    const result = await db
      .select()
      .from(collectionPages)
      .where(and(
        eq(collectionPages.collectionId, collectionId),
        eq(collectionPages.lang, lang)
      ))
      .limit(1);

    return { data: result[0] as CollectionPage || null };
  } catch (error) {
    console.error(`Error fetching collection page for collection ${collectionId}:`, error);
    return { data: null };
  }
}

export async function getCollectionById(id: number, lang: string = "ru") {
  try {
    const collection = await db.query.collections.findFirst({
      where: eq(collections.id, id),
    });

    if (!collection) {
      return { error: "Коллекция не найдена" };
    }

    const collectionPage = await db.query.collectionPages.findFirst({
      where: and(
        eq(collectionPages.collectionId, id),
        eq(collectionPages.lang, lang)
      ),
    });

    return {
      data: {
        ...collection,
        ...collectionPage,
      },
    };
  } catch (error) {
    console.error("Error fetching collection by id:", error);
    return { error: "Ошибка при получении данных коллекции" };
  }
}

/**
 * Получение данных для баннера страницы бренда
 */
export async function getBrandHeroSection(lang: string = 'ru') {
  try {
    console.log(`Fetching brand hero section for language: ${lang}`);

    // Сначала ищем контент для указанного языка
    let data = await db.query.brandHeroSection.findFirst({
      where: eq(brandHeroSection.lang, lang),
      orderBy: desc(brandHeroSection.createdAt),
    });

    // Если для указанного языка нет данных, используем русский как запасной вариант
    if (!data && lang !== 'ru') {
      console.log('Falling back to Russian language for brand hero section');
      data = await db.query.brandHeroSection.findFirst({
        where: eq(brandHeroSection.lang, 'ru'),
        orderBy: desc(brandHeroSection.createdAt),
      });
    }

    console.log('Brand hero section data found:', data ? true : false);
    return { data };
  } catch (error) {
    console.error("Failed to fetch brand hero section:", error);
    return { error: "Failed to fetch brand hero section data" };
  }
}

/**
 * Получение основного контента страницы бренда
 */
export async function getBrandContent(lang: string = 'ru') {
  try {
    console.log(`Fetching brand content for language: ${lang}`);

    // Сначала ищем контент для указанного языка
    let data = await db.query.brandContent.findFirst({
      where: eq(brandContent.lang, lang),
      orderBy: desc(brandContent.createdAt),
    });

    // Если для указанного языка нет данных, используем русский как запасной вариант
    if (!data && lang !== 'ru') {
      console.log('Falling back to Russian language for brand content');
      data = await db.query.brandContent.findFirst({
        where: eq(brandContent.lang, 'ru'),
        orderBy: desc(brandContent.createdAt),
      });
    }

    // Если данных нет вообще, возвращаем дефолтные значения
    if (!data) {
      data = {
        id: 0,
        title: "ABELSBERG:",
        subtitle: "АКЦЕНТ НА ГЛАВНОМ",
        description: "Бренд Abelsberg, созданный в Германии, объединяет лучшие проверенные годами технические решения и актуальный дизайн. Применение как эстетичных, так и высокотехнологичных новейших материалов дает нашим продуктам принципиально иной качественный уровень восприятия и эксплуатации. В коллекциях Abelsberg представлены классические гармоничные цветовые решения и яркие акцентные продукты. Наша философия в осознанном подходе к формированию жилой среды, где придается особенное внимание материалам и предметам, с которыми мы контактируем каждый день. Мы создаем не просто оборудование для ванных комнат и кухонь, а продукты, которые визуально и тактильно впечатляют и приносят истинное удовлетворение от использования.",
        lang: lang,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    console.log('Brand content data found:', data ? true : false);
    return { data };
  } catch (error) {
    console.error("Failed to fetch brand content:", error);
    return { error: "Failed to fetch brand content data" };
  }
}
