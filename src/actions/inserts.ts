"use server";

import { db } from "@/db";
import { heroSection, directions, directionsEn, collections, collectionPages, brandHeroSection, brandContent } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and, ne } from "drizzle-orm";
import { CollectionSection } from "@/types/types";

// Типы данных для бэкенда
export type HeroSectionData = {
  title: string;
  description?: string;
  buttonText?: string;
  imageBase64: string; // Изображение в формате base64
  lang: string;
};

export type DirectionData = {
  title: string | null;
  description: string | null;
  imageBase64: string;
  link: string;
  order?: number;
  lang: string;
};

// Типы для работы с коллекциями
export type CollectionFormData = {
  name: string;
  slug: string;
  description?: string;
  subTitle?: string;
  imageBase64?: string;
};

export type CollectionPageFormData = {
  title: string;
  description?: string;
  subTitle?: string;
  heroImage: string;
  bannerImage?: string;
  content: {
    sections: CollectionSection[];
  };
  lang: string;
};

export type BrandHeroSectionFormData = {
  imageBase64: string;
  lang: string;
};

export type BrandContentFormData = {
  title: string;
  subtitle: string;
  description: string;
  lang: string;
};

/**
 * Преобразует файл в строку base64
 */
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64String = buffer.toString('base64');
  const mimeType = file.type;
  return `data:${mimeType};base64,${base64String}`;
}

/**
 * Обновление или создание данных для Hero Section (баннера)
 */
export async function updateHeroSection(data: HeroSectionData) {
  try {
    // Логируем действие
    console.log("Saving hero section data:", {
      title: data.title,
      description: data.description,
      buttonText: data.buttonText,
      lang: data.lang,
      imageBase64Length: data.imageBase64?.length || 0
    });

    // Убеждаемся, что имеем корректные данные base64
    if (!data.imageBase64.startsWith('data:image/')) {
      console.error('Invalid image data format');
      return { error: 'Invalid image data format. Must start with data:image/' };
    }

    // Проверяем, существует ли запись для данного языка
    const existingRecord = await db.query.heroSection.findFirst({
      where: eq(heroSection.lang, data.lang),
    });

    if (existingRecord) {
      // Обновляем существующую запись
      const result = await db
        .update(heroSection)
        .set({
          title: data.title,
          description: data.description || '',
          buttonText: data.buttonText || '',
          imageBase64: data.imageBase64,
          updatedAt: new Date(),
        })
        .where(eq(heroSection.id, existingRecord.id))
        .returning();

      console.log("Updated hero section:", result);
    } else {
      // Если запись не существует, создаем новую
      const result = await db
        .insert(heroSection)
        .values({
          title: data.title,
          description: data.description || '',
          buttonText: data.buttonText || '',
          imageBase64: data.imageBase64,
          lang: data.lang,
        })
        .returning();

      console.log("Created hero section:", result);
    }

    // Очищаем кэш для всех языковых версий, поскольку при отсутствии перевода
    // может использоваться запасной вариант
    revalidatePath("/");
    revalidatePath("/ru");
    revalidatePath("/en");

    return { success: true };
  } catch (error) {
    console.error("Failed to update hero section:", error);
    return { error: `Failed to update hero section: ${error}` };
  }
}

/**
 * Создание нового направления (direction)
 */
export async function createDirection(data: DirectionData) {
  try {
    const { lang, ...directionData } = data;
    if (lang === "ru") {
      await db.insert(directions).values(directionData);
    } else {
      await db.insert(directionsEn).values(directionData);
    }

    // Очищаем кэш для всех затронутых путей
    revalidatePath("/");
    revalidatePath("/ru");
    revalidatePath("/en");
    revalidatePath("/admin/directions");

    return { success: true };
  } catch (error) {
    console.error("Failed to create direction:", error);
    return { error: "Не удалось создать направление" };
  }
}

/**
 * Обновление существующего направления
 */
export async function updateDirection(id: number, data: DirectionData) {
  try {
    const { lang, ...directionData } = data;
    if (lang === "ru") {
      await db.update(directions).set(directionData).where(eq(directions.id, id));
    } else {
      await db.update(directionsEn).set(directionData).where(eq(directionsEn.id, id));
    }

    // Очищаем кэш для всех затронутых путей
    revalidatePath("/");
    revalidatePath("/ru");
    revalidatePath("/en");
    revalidatePath("/admin/directions");

    return { success: true };
  } catch (error) {
    console.error("Failed to update direction:", error);
    return { error: "Не удалось обновить направление" };
  }
}

/**
 * Удаление направления
 */
export async function deleteDirection(id: number, lang: string = "ru") {
  try {
    if (lang === "ru") {
      await db.delete(directions).where(eq(directions.id, id));
    } else {
      await db.delete(directionsEn).where(eq(directionsEn.id, id));
    }

    // Очищаем кэш для всех затронутых путей
    revalidatePath("/");
    revalidatePath("/ru");
    revalidatePath("/en");
    revalidatePath("/admin/directions");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete direction:", error);
    return { error: "Не удалось удалить направление" };
  }
}

/**
 * Метод для преобразования загруженного файла в Base64
 * Может использоваться на стороне клиента
 */
export async function convertFileToBase64(formData: FormData) {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { error: "No file provided" };
    }

    const base64 = await fileToBase64(file);
    return { data: base64 };
  } catch (error) {
    console.error("Failed to convert file to base64:", error);
    return { error: "Failed to convert file" };
  }
}

/**
 * Создание новой коллекции
 */
export async function createCollection(data: CollectionFormData) {
  try {
    // Проверка уникальности slug
    const existingCollection = await db
      .select()
      .from(collections)
      .where(eq(collections.slug, data.slug))
      .limit(1);

    if (existingCollection.length > 0) {
      return { success: false, error: "Коллекция с таким slug уже существует" };
    }

    const result = await db.insert(collections).values({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      subTitle: data.subTitle || null,
      imageBase64: data.imageBase64 || null,
    }).returning();

    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { success: false, error: "Не удалось создать коллекцию" };
  }
}

/**
 * Обновление коллекции
 */
export async function updateCollection(id: number, data: CollectionFormData) {
  try {
    // Проверка уникальности slug
    const existingCollection = await db
      .select()
      .from(collections)
      .where(and(
        eq(collections.slug, data.slug),
        ne(collections.id, id)
      ))
      .limit(1);

    if (existingCollection.length > 0) {
      return { success: false, error: "Коллекция с таким slug уже существует" };
    }

    await db.update(collections)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        subTitle: data.subTitle || null,
        imageBase64: data.imageBase64 || null,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id));

    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    revalidatePath(`/collections/${data.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating collection:", error);
    return { success: false, error: "Не удалось обновить коллекцию" };
  }
}

/**
 * Создание или обновление страницы коллекции
 */
export async function upsertCollectionPage(collectionId: number, data: CollectionPageFormData) {
  try {
    // Проверяем существование страницы
    const existingPage = await db
      .select()
      .from(collectionPages)
      .where(and(
        eq(collectionPages.collectionId, collectionId),
        eq(collectionPages.lang, data.lang)
      ))
      .limit(1);

    if (existingPage.length > 0) {
      // Обновляем существующую страницу
      await db.update(collectionPages)
        .set({
          title: data.title,
          description: data.description || null,
          subTitle: data.subTitle || null,
          heroImage: data.heroImage,
          bannerImage: data.bannerImage || null,
          content: data.content,
          updatedAt: new Date(),
        })
        .where(eq(collectionPages.id, existingPage[0].id));
    } else {
      // Создаем новую страницу
      await db.insert(collectionPages).values({
        collectionId,
        title: data.title,
        description: data.description || null,
        subTitle: data.subTitle || null,
        heroImage: data.heroImage,
        bannerImage: data.bannerImage || null,
        content: data.content,
        lang: data.lang,
      });
    }

    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("Error upserting collection page:", error);
    return { success: false, error: "Не удалось сохранить страницу коллекции" };
  }
}

/**
 * Удаление коллекции
 */
export async function deleteCollection(id: number) {
  try {
    // Удаляем все страницы коллекции
    await db.delete(collectionPages).where(eq(collectionPages.collectionId, id));
    // Удаляем саму коллекцию
    await db.delete(collections).where(eq(collections.id, id));

    revalidatePath("/admin/collections");
    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "Не удалось удалить коллекцию" };
  }
}

/**
 * Обновление или создание данных для баннера страницы бренда
 */
export async function updateBrandHeroSection(data: BrandHeroSectionFormData) {
  try {
    console.log("Saving brand hero section data:", {
      lang: data.lang,
      imageBase64Length: data.imageBase64?.length || 0
    });

    if (!data.imageBase64.startsWith('data:image/')) {
      console.error('Invalid image data format');
      return { error: 'Invalid image data format. Must start with data:image/' };
    }

    const existingRecord = await db.query.brandHeroSection.findFirst({
      where: eq(brandHeroSection.lang, data.lang),
    });

    if (existingRecord) {
      const result = await db
        .update(brandHeroSection)
        .set({
          imageBase64: data.imageBase64,
          updatedAt: new Date(),
        })
        .where(eq(brandHeroSection.id, existingRecord.id))
        .returning();

      console.log("Updated brand hero section:", result);
    } else {
      const result = await db
        .insert(brandHeroSection)
        .values({
          imageBase64: data.imageBase64,
          lang: data.lang,
        })
        .returning();

      console.log("Created brand hero section:", result);
    }

    revalidatePath("/brand");
    revalidatePath("/ru/brand");
    revalidatePath("/en/brand");

    return { success: true };
  } catch (error) {
    console.error("Failed to update brand hero section:", error);
    return { error: `Failed to update brand hero section: ${error}` };
  }
}

/**
 * Обновление или создание основного контента страницы бренда
 */
export async function updateBrandContent(data: BrandContentFormData) {
  try {
    console.log("Saving brand content data:", {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      lang: data.lang,
    });

    // Проверяем, существует ли запись для данного языка
    const existingRecord = await db.query.brandContent.findFirst({
      where: eq(brandContent.lang, data.lang),
    });

    if (existingRecord) {
      // Обновляем существующую запись
      const result = await db
        .update(brandContent)
        .set({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          updatedAt: new Date(),
        })
        .where(eq(brandContent.id, existingRecord.id))
        .returning();

      console.log("Updated brand content:", result);
    } else {
      // Если запись не существует, создаем новую
      const result = await db
        .insert(brandContent)
        .values({
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          lang: data.lang,
        })
        .returning();

      console.log("Created brand content:", result);
    }

    // Очищаем кэш для всех языковых версий
    revalidatePath("/brand");
    revalidatePath("/ru/brand");
    revalidatePath("/en/brand");

    return { success: true };
  } catch (error) {
    console.error("Failed to update brand content:", error);
    return { error: `Failed to update brand content: ${error}` };
  }
}
