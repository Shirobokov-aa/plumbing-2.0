"use server";

import { db } from "@/db";
import { eq, and, ne, desc, sql } from "drizzle-orm";
import { collections, collectionPages } from "@/db/schema";
import { Collection } from "@/types/types";
import { revalidatePath } from "next/cache";

/**
 * Унифицированная логика для работы с коллекциями
 */

/**
 * Тестирование соединения с базой данных
 */
export async function testDatabaseConnection() {
  try {
    // Расширяем логирование ошибок для отладки проблем DNS
    try {
      await db.execute(sql`SELECT 1 as test`);
      return { success: true };
    } catch (dbError) {
      if (dbError instanceof Error) {
        // Проверка на ошибки DNS
        if (
          dbError.message.includes('getaddrinfo') ||
          dbError.message.includes('ENOTFOUND') ||
          dbError.message.includes('connect ETIMEDOUT')
        ) {
          return {
            success: false,
            error: `Ошибка подключения к базе данных: невозможно найти хост. Убедитесь, что база данных запущена и доступна.`
          };
        }

        // Проверка на отказ соединения
        if (
          dbError.message.includes('ECONNREFUSED') ||
          dbError.message.includes('connection refused')
        ) {
          return {
            success: false,
            error: `Ошибка подключения к базе данных: соединение отклонено. Убедитесь, что база данных принимает соединения.`
          };
        }
      }

      // Общая ошибка подключения
      return {
        success: false,
        error: `Ошибка соединения с базой данных: ${dbError instanceof Error ? dbError.message : String(dbError)}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Критическая ошибка при тестировании соединения с базой данных: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Получение всех коллекций с возможной фильтрацией по языку
 */
export async function getCollections(lang?: string): Promise<{
  success: boolean;
  data?: Collection[];
  error?: string
}> {
  let attempts = 0;
  const maxAttempts = 3;
  let lastError: unknown = null;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      // Проверим соединение с БД
      const connectionTest = await testDatabaseConnection();
      if (!connectionTest.success) {
        // Если проблема с соединением, повторим попытку, если не последняя
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Ждем секунду перед повторной попыткой
          lastError = connectionTest.error;
          continue;
        }
        return connectionTest;
      }

      // Получаем основные данные коллекций
      const result = await db
        .select()
        .from(collections)
        .orderBy(desc(collections.createdAt));

      // Если коллекций нет, возвращаем пустой массив
      if (result.length === 0) {
        return { success: true, data: [] };
      }

      // Если язык не указан, возвращаем базовые коллекции
      if (!lang) {
        return { success: true, data: result };
      }

      // Если указан язык, обогащаем данными из collectionPages
      try {
        // Получаем страницы коллекций для указанного языка
        const pages = await db
          .select()
          .from(collectionPages)
          .where(eq(collectionPages.lang, lang));

        // Индексируем страницы по ID коллекции для быстрого доступа
        const pagesByCollectionId = pages.reduce((acc, page) => {
          acc[page.collectionId] = page;
          return acc;
        }, {} as Record<number, typeof collectionPages.$inferSelect>);

        // Обогащаем результаты данными из страниц коллекций
        const enrichedResults = result.map(collection => {
          const page = pagesByCollectionId[collection.id];

          // Если есть страница для коллекции, обогащаем данными из нее
          if (page) {
            return {
              ...collection,
              title: page.title || collection.name,
              description: page.description || collection.description,
              imageBase64: page.heroImage || collection.imageBase64,
            } as Collection;
          }

          // Если страницы нет, используем базовые данные
          return collection as Collection;
        });

        return { success: true, data: enrichedResults };
      } catch {
        // Если была ошибка при получении страниц, возвращаем базовые коллекции
        return { success: true, data: result };
      }
    } catch (error) {
      lastError = error;
      if (attempts < maxAttempts) {
        // Увеличиваем задержку с каждой попыткой
        await new Promise(resolve => setTimeout(resolve, attempts * 1000));
        continue;
      }

      return {
        success: false,
        error: `Не удалось получить список коллекций: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  return {
    success: false,
    error: `Не удалось получить список коллекций после ${maxAttempts} попыток: ${lastError instanceof Error ? lastError.message : String(lastError)}`
  };
}

/**
 * Получение коллекции по её slug
 */
export async function getCollectionBySlug(slug: string, lang?: string) {
  try {
    console.log(`[collections] Запрос коллекции по slug: ${slug}, язык: ${lang || 'не указан'}`);

    // Получение основной информации о коллекции
    const collection = await db
      .select()
      .from(collections)
      .where(eq(collections.slug, slug))
      .limit(1);

    if (collection.length === 0) {
      console.log(`[collections] Коллекция с slug ${slug} не найдена`);
      return { success: false, error: "Коллекция не найдена" };
    }

    const collectionData = collection[0];
    console.log(`[collections] Найдена коллекция: ${collectionData.name} (ID: ${collectionData.id})`);

    // Если язык не указан, возвращаем базовую информацию
    if (!lang) {
      return { success: true, data: collectionData };
    }

    // Получение страницы коллекции для указанного языка
    const page = await db
      .select()
      .from(collectionPages)
      .where(and(
        eq(collectionPages.collectionId, collectionData.id),
        eq(collectionPages.lang, lang)
      ))
      .limit(1);

    // Объединяем данные коллекции и страницы
    if (page.length > 0) {
      const pageData = page[0];
      console.log(`[collections] Найдена страница коллекции для языка ${lang}`);

      return {
        success: true,
        data: {
          ...collectionData,
          title: pageData.title || collectionData.name,
          description: pageData.description || collectionData.description,
          content: pageData.content,
          heroImage: pageData.heroImage || collectionData.imageBase64,
          lang: pageData.lang,
        }
      };
    }

    // Если страницы для указанного языка нет, возвращаем базовую информацию
    console.log(`[collections] Страница для языка ${lang} не найдена, возвращаем базовую информацию`);
    return { success: true, data: collectionData };
  } catch (error) {
    console.error(`[collections] Ошибка при получении коллекции по slug ${slug}:`, error);
    return {
      success: false,
      error: `Не удалось получить коллекцию: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Получение коллекции по её ID
 */
export async function getCollectionById(id: number, lang?: string) {
  try {
    console.log(`[collections] Запрос коллекции по ID: ${id}, язык: ${lang || 'не указан'}`);

    // Получение основной информации о коллекции
    const collection = await db
      .select()
      .from(collections)
      .where(eq(collections.id, id))
      .limit(1);

    if (collection.length === 0) {
      console.log(`[collections] Коллекция с ID ${id} не найдена`);
      return { success: false, error: "Коллекция не найдена" };
    }

    const collectionData = collection[0];
    console.log(`[collections] Найдена коллекция: ${collectionData.name} (ID: ${collectionData.id})`);

    // Если язык не указан, возвращаем базовую информацию
    if (!lang) {
      return { success: true, data: collectionData };
    }

    // Получение страницы коллекции для указанного языка
    const page = await db
      .select()
      .from(collectionPages)
      .where(and(
        eq(collectionPages.collectionId, id),
        eq(collectionPages.lang, lang)
      ))
      .limit(1);

    // Объединяем данные коллекции и страницы
    if (page.length > 0) {
      const pageData = page[0];
      console.log(`[collections] Найдена страница коллекции для языка ${lang}`);

      return {
        success: true,
        data: {
          ...collectionData,
          title: pageData.title || collectionData.name,
          description: pageData.description || collectionData.description,
          content: pageData.content,
          heroImage: pageData.heroImage || collectionData.imageBase64,
          lang: pageData.lang,
        }
      };
    }

    // Если страницы для указанного языка нет, возвращаем базовую информацию
    console.log(`[collections] Страница для языка ${lang} не найдена, возвращаем базовую информацию`);
    return { success: true, data: collectionData };
  } catch (error) {
    console.error(`[collections] Ошибка при получении коллекции по ID ${id}:`, error);
    return {
      success: false,
      error: `Не удалось получить коллекцию: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Создание новой коллекции
 */
export async function createCollection(data: {
  name: string;
  slug: string;
  description?: string;
  subTitle?: string;
  imageBase64?: string;
}) {
  try {
    console.log(`[collections] Создание новой коллекции: ${data.name} (${data.slug})`);

    // Проверяем уникальность slug
    const existingCollection = await db
      .select()
      .from(collections)
      .where(eq(collections.slug, data.slug))
      .limit(1);

    if (existingCollection.length > 0) {
      console.log(`[collections] Коллекция с slug ${data.slug} уже существует`);
      return { success: false, error: "Коллекция с таким slug уже существует" };
    }

    // Создаем новую коллекцию
    const result = await db
      .insert(collections)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        subTitle: data.subTitle || null,
        imageBase64: data.imageBase64 || null,
      })
      .returning();

    console.log(`[collections] Коллекция создана успешно, ID: ${result[0].id}`);

    // Обновляем кеш страниц
    revalidatePath("/admin/collections");
    revalidatePath("/collections");

    return { success: true, data: result[0] };
  } catch (error) {
    console.error(`[collections] Ошибка при создании коллекции:`, error);
    return {
      success: false,
      error: `Не удалось создать коллекцию: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Обновление существующей коллекции
 */
export async function updateCollection(id: number, data: {
  name: string;
  slug: string;
  description?: string;
  subTitle?: string;
  imageBase64?: string;
}) {
  try {
    console.log(`[collections] Обновление коллекции ID ${id}: ${data.name} (${data.slug})`);

    // Проверяем уникальность slug
    const existingCollection = await db
      .select()
      .from(collections)
      .where(and(
        eq(collections.slug, data.slug),
        ne(collections.id, id)
      ))
      .limit(1);

    if (existingCollection.length > 0) {
      console.log(`[collections] Коллекция с slug ${data.slug} уже существует`);
      return { success: false, error: "Коллекция с таким slug уже существует" };
    }

    // Обновляем коллекцию
    await db
      .update(collections)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        subTitle: data.subTitle || null,
        imageBase64: data.imageBase64 || null,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id));

    console.log(`[collections] Коллекция обновлена успешно`);

    // Обновляем кеш страниц
    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    revalidatePath(`/collections/${data.slug}`);

    return { success: true };
  } catch (error) {
    console.error(`[collections] Ошибка при обновлении коллекции:`, error);
    return {
      success: false,
      error: `Не удалось обновить коллекцию: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Создание или обновление страницы коллекции
 */
export async function upsertCollectionPage(collectionId: number, data: {
  title: string;
  description?: string;
  subTitle?: string;
  heroImage: string;
  content: {
    sections: Array<{
      type: 'banner' | 'text' | 'image';
      title?: string;
      description?: string;
      image?: string;
      layout?: 'left' | 'right' | 'center';
    }>;
  };
  lang: string;
}) {
  try {
    console.log(`[collections] Создание/обновление страницы коллекции ID ${collectionId} для языка ${data.lang}`);

    // Проверяем существование коллекции
    const collection = await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))
      .limit(1);

    if (collection.length === 0) {
      console.log(`[collections] Коллекция с ID ${collectionId} не найдена`);
      return { success: false, error: "Коллекция не найдена" };
    }

    // Проверяем существование страницы
    const existingPage = await db
      .select()
      .from(collectionPages)
      .where(and(
        eq(collectionPages.collectionId, collectionId),
        eq(collectionPages.lang, data.lang)
      ))
      .limit(1);

    // Обновляем или создаем страницу
    if (existingPage.length > 0) {
      console.log(`[collections] Обновление существующей страницы ID ${existingPage[0].id}`);

      await db
        .update(collectionPages)
        .set({
          title: data.title,
          description: data.description || null,
          subTitle: data.subTitle || null,
          heroImage: data.heroImage,
          content: data.content,
          updatedAt: new Date(),
        })
        .where(eq(collectionPages.id, existingPage[0].id));
    } else {
      console.log(`[collections] Создание новой страницы коллекции`);

      await db
        .insert(collectionPages)
        .values({
          collectionId,
          title: data.title,
          description: data.description || null,
          subTitle: data.subTitle || null,
          heroImage: data.heroImage,
          content: data.content,
          lang: data.lang,
        });
    }

    console.log(`[collections] Страница коллекции сохранена успешно`);

    // Обновляем кеш страниц
    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    revalidatePath(`/collections/${collection[0].slug}`);

    return { success: true };
  } catch (error) {
    console.error(`[collections] Ошибка при сохранении страницы коллекции:`, error);
    return {
      success: false,
      error: `Не удалось сохранить страницу коллекции: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Удаление коллекции
 */
export async function deleteCollection(id: number) {
  try {
    console.log(`[collections] Удаление коллекции ID ${id}`);

    // Получаем информацию о коллекции перед удалением
    const collection = await db
      .select()
      .from(collections)
      .where(eq(collections.id, id))
      .limit(1);

    if (collection.length === 0) {
      console.log(`[collections] Коллекция с ID ${id} не найдена`);
      return { success: false, error: "Коллекция не найдена" };
    }

    const slug = collection[0].slug;

    // Удаляем все страницы коллекции
    await db
      .delete(collectionPages)
      .where(eq(collectionPages.collectionId, id));

    console.log(`[collections] Удалены страницы коллекции ID ${id}`);

    // Удаляем саму коллекцию
    await db
      .delete(collections)
      .where(eq(collections.id, id));

    console.log(`[collections] Коллекция ID ${id} удалена успешно`);

    // Обновляем кеш страниц
    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    revalidatePath(`/collections/${slug}`);

    return { success: true };
  } catch (error) {
    console.error(`[collections] Ошибка при удалении коллекции:`, error);
    return {
      success: false,
      error: `Не удалось удалить коллекцию: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
