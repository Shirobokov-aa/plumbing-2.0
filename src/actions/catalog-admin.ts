'use server';

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import {
  products,
  productCategories,
  productCharacteristics,
  productDocuments,
  productToColors,
  productToTechnologies,
  productColors,
  productTechnologies,
  collections
} from "@/db/schema";

// Схемы валидации
const categoryFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  slug: z.string().min(1, "Slug обязателен").regex(/^[a-z0-9-]+$/, "Только латинские буквы, цифры и дефис"),
  parentId: z.number().optional().nullable(),
  order: z.number().default(0),
  lang: z.string().default("ru"),
});

const productFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  article: z.string().min(1, "Артикул обязателен"),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  categoryId: z.number(),
  subcategoryId: z.number().optional().nullable(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lang: z.string().default("ru"),
  collectionId: z.number().optional().nullable(),
  crossCollectionId: z.number().optional().nullable(),
  colors: z.array(z.number()).default([]),
  colorLinks: z.record(z.string(), z.string())
    .transform((val) => {
      const result: Record<number, string> = {};
      Object.entries(val).forEach(([key, value]) => {
        result[parseInt(key)] = value;
      });
      return result;
    })
    .optional(),
  characteristics: z.array(z.object({
    name: z.string(),
    value: z.string(),
    order: z.number().default(0),
  })).default([]),
  technologies: z.array(z.number()).default([]),
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    fileUrl: z.string(),
    fileSize: z.number(),
  })).default([]),
});

// Схема для цветов продуктов
const colorFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  code: z.string().min(1, "Код цвета обязателен"),
  suffix: z.string().min(1, "Суффикс обязателен"),
});

// Схема для технологий
const technologyFormSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  title: z.string().min(1, "Заголовок обязателен"),
  description: z.string().optional(),
  icon: z.string().min(1, "Иконка обязательна"),
});

// Тип для данных формы категории
type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Тип для данных формы продукта
type ProductFormData = z.infer<typeof productFormSchema>;

// Тип для данных формы цвета
type ColorFormData = z.infer<typeof colorFormSchema>;

// Тип для данных формы технологии
type TechnologyFormData = z.infer<typeof technologyFormSchema>;

/**
 * Создание новой категории
 */
export async function createCategory(formData: CategoryFormData) {
  try {
    const validatedFields = categoryFormSchema.parse(formData);

    // Проверка уникальности slug
    const existingCategory = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(and(
        eq(productCategories.slug, validatedFields.slug),
        eq(productCategories.lang, validatedFields.lang)
      ))
      .limit(1);

    if (existingCategory.length > 0) {
      return { success: false, error: "Категория с таким slug уже существует" };
    }

    // Вставка данных в БД
    const result = await db.insert(productCategories).values({
      name: validatedFields.name,
      slug: validatedFields.slug,
      parentId: validatedFields.parentId || null,
      order: validatedFields.order,
      lang: validatedFields.lang,
    }).returning({ id: productCategories.id });

    revalidatePath("/admin/catalog");
    return { success: true, data: { id: result[0].id } };
  } catch (error) {
    console.error("Ошибка при создании категории:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при создании категории" };
  }
}

/**
 * Обновление категории
 */
export async function updateCategory(id: number, formData: CategoryFormData) {
  try {
    const validatedFields = categoryFormSchema.parse(formData);

    // Проверка уникальности slug (исключая текущую категорию)
    const existingCategory = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(and(
        eq(productCategories.slug, validatedFields.slug),
        eq(productCategories.lang, validatedFields.lang)
      ))
      .limit(1);

    if (existingCategory.length > 0 && existingCategory[0].id !== id) {
      return { success: false, error: "Категория с таким slug уже существует" };
    }

    // Обновление данных в БД
    await db.update(productCategories)
      .set({
        name: validatedFields.name,
        slug: validatedFields.slug,
        parentId: validatedFields.parentId || null,
        order: validatedFields.order,
        lang: validatedFields.lang,
        updatedAt: new Date(),
      })
      .where(eq(productCategories.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении категории ID=${id}:`, error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при обновлении категории" };
  }
}

/**
 * Удаление категории
 */
export async function deleteCategory(id: number) {
  try {
    // Проверка наличия подкатегорий
    const subcategories = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(eq(productCategories.parentId, id))
      .limit(1);

    if (subcategories.length > 0) {
      return { success: false, error: "Нельзя удалить категорию, у которой есть подкатегории" };
    }

    // Проверка наличия товаров в категории
    const productsInCategory = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.categoryId, id))
      .limit(1);

    if (productsInCategory.length > 0) {
      return { success: false, error: "Нельзя удалить категорию, в которой есть товары" };
    }

    // Удаление категории
    await db.delete(productCategories).where(eq(productCategories.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении категории ID=${id}:`, error);
    return { success: false, error: "Ошибка при удалении категории" };
  }
}

/**
 * Создание нового продукта
 */
export async function createProduct(formData: ProductFormData) {
  try {
    const validatedFields = productFormSchema.parse(formData);

    // Вставка основных данных продукта
    const productResult = await db.insert(products).values({
      name: validatedFields.name,
      article: validatedFields.article,
      description: validatedFields.description || null,
      price: validatedFields.price,
      categoryId: validatedFields.categoryId,
      subcategoryId: validatedFields.subcategoryId || null,
      images: validatedFields.images,
      featured: validatedFields.featured,
      isActive: validatedFields.isActive,
      lang: validatedFields.lang,
      collectionId: validatedFields.collectionId || null,
      crossCollectionId: validatedFields.crossCollectionId || null,
    }).returning({ id: products.id });

    const productId = productResult[0].id;

    // Добавление цветов продукта
    if (validatedFields.colors.length > 0) {
      const colorValues = validatedFields.colors.map(colorId => ({
        productId,
        colorId,
        linkToProduct: validatedFields.colorLinks?.[colorId] || null,
      }));
      await db.insert(productToColors).values(colorValues);
    }

    // Добавление характеристик продукта
    if (validatedFields.characteristics.length > 0) {
      const characteristicsValues = validatedFields.characteristics.map(char => ({
        productId,
        name: char.name,
        value: char.value,
        order: char.order,
      }));
      await db.insert(productCharacteristics).values(characteristicsValues);
    }

    // Добавление технологий продукта
    if (validatedFields.technologies.length > 0) {
      const techValues = validatedFields.technologies.map(techId => ({
        productId,
        technologyId: techId,
      }));
      await db.insert(productToTechnologies).values(techValues);
    }

    // Добавление документов продукта
    if (validatedFields.documents.length > 0) {
      const documentValues = validatedFields.documents.map(doc => ({
        productId,
        name: doc.name,
        type: doc.type,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
      }));
      await db.insert(productDocuments).values(documentValues);
    }

    revalidatePath("/admin/catalog");
    return { success: true, data: { id: productId } };
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при создании продукта" };
  }
}

/**
 * Обновление продукта
 */
export async function updateProduct(id: number, formData: ProductFormData) {
  try {
    const validatedFields = productFormSchema.parse(formData);

    console.log('Данные после валидации:', {
      colors: validatedFields.colors,
      colorLinks: validatedFields.colorLinks
    });

    // Обновление основных данных продукта
    await db.update(products).set({
      name: validatedFields.name,
      article: validatedFields.article,
      description: validatedFields.description || null,
      price: validatedFields.price,
      categoryId: validatedFields.categoryId,
      subcategoryId: validatedFields.subcategoryId || null,
      images: validatedFields.images,
      featured: validatedFields.featured,
      isActive: validatedFields.isActive,
      lang: validatedFields.lang,
      collectionId: validatedFields.collectionId || null,
      crossCollectionId: validatedFields.crossCollectionId || null,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    // Обновление цветов (удаление старых, добавление новых)
    await db.delete(productToColors).where(eq(productToColors.productId, id));
    if (validatedFields.colors.length > 0) {
      const colorValues = validatedFields.colors.map(colorId => ({
        productId: id,
        colorId,
        linkToProduct: validatedFields.colorLinks?.[colorId] || null,
      }));

      console.log('Значения для вставки в БД:', colorValues);

      await db.insert(productToColors).values(colorValues);
    }

    // Обновление характеристик (удаление старых, добавление новых)
    await db.delete(productCharacteristics).where(eq(productCharacteristics.productId, id));
    if (validatedFields.characteristics.length > 0) {
      const characteristicsValues = validatedFields.characteristics.map(char => ({
        productId: id,
        name: char.name,
        value: char.value,
        order: char.order,
      }));
      await db.insert(productCharacteristics).values(characteristicsValues);
    }

    // Обновление технологий (удаление старых, добавление новых)
    await db.delete(productToTechnologies).where(eq(productToTechnologies.productId, id));
    if (validatedFields.technologies.length > 0) {
      const techValues = validatedFields.technologies.map(techId => ({
        productId: id,
        technologyId: techId,
      }));
      await db.insert(productToTechnologies).values(techValues);
    }

    // Обновление документов (удаление старых, добавление новых)
    await db.delete(productDocuments).where(eq(productDocuments.productId, id));
    if (validatedFields.documents.length > 0) {
      const documentValues = validatedFields.documents.map(doc => ({
        productId: id,
        name: doc.name,
        type: doc.type,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
      }));
      await db.insert(productDocuments).values(documentValues);
    }

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении продукта ID=${id}:`, error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при обновлении продукта" };
  }
}

/**
 * Удаление продукта
 */
export async function deleteProduct(id: number) {
  try {
    // Удаление связанных данных
    await db.delete(productToColors).where(eq(productToColors.productId, id));
    await db.delete(productCharacteristics).where(eq(productCharacteristics.productId, id));
    await db.delete(productToTechnologies).where(eq(productToTechnologies.productId, id));
    await db.delete(productDocuments).where(eq(productDocuments.productId, id));

    // Удаление самого продукта
    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении продукта ID=${id}:`, error);
    return { success: false, error: "Ошибка при удалении продукта" };
  }
}

/**
 * Функции для работы с цветами продуктов
 */

/**
 * Создание нового цвета
 */
export async function createColor(formData: ColorFormData) {
  try {
    const validatedFields = colorFormSchema.parse(formData);

    // Проверка уникальности комбинации имени и суффикса
    const existingColor = await db
      .select({ id: productColors.id })
      .from(productColors)
      .where(and(
        eq(productColors.name, validatedFields.name),
        eq(productColors.suffix, validatedFields.suffix)
      ))
      .limit(1);

    if (existingColor.length > 0) {
      return { success: false, error: "Цвет с таким названием и суффиксом уже существует" };
    }

    // Вставка данных в БД
    const result = await db.insert(productColors).values({
      name: validatedFields.name,
      code: validatedFields.code,
      suffix: validatedFields.suffix,
    }).returning({ id: productColors.id });

    revalidatePath("/admin/catalog");
    return { success: true, data: { id: result[0].id } };
  } catch (error) {
    console.error("Ошибка при создании цвета:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при создании цвета" };
  }
}

/**
 * Обновление цвета
 */
export async function updateColor(id: number, formData: ColorFormData) {
  try {
    const validatedFields = colorFormSchema.parse(formData);

    // Проверка уникальности комбинации имени и суффикса (исключая текущий цвет)
    const existingColor = await db
      .select({ id: productColors.id })
      .from(productColors)
      .where(and(
        eq(productColors.name, validatedFields.name),
        eq(productColors.suffix, validatedFields.suffix)
      ))
      .limit(1);

    if (existingColor.length > 0 && existingColor[0].id !== id) {
      return { success: false, error: "Цвет с таким названием и суффиксом уже существует" };
    }

    // Обновление данных в БД
    await db.update(productColors)
      .set({
        name: validatedFields.name,
        code: validatedFields.code,
        suffix: validatedFields.suffix,
        updatedAt: new Date(),
      })
      .where(eq(productColors.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении цвета ID=${id}:`, error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при обновлении цвета" };
  }
}

/**
 * Удаление цвета
 */
export async function deleteColor(id: number) {
  try {
    // Проверка использования цвета в продуктах
    const productsWithColor = await db
      .select({ id: productToColors.id })
      .from(productToColors)
      .where(eq(productToColors.colorId, id))
      .limit(1);

    if (productsWithColor.length > 0) {
      return { success: false, error: "Нельзя удалить цвет, который используется в продуктах" };
    }

    // Удаление цвета
    await db.delete(productColors).where(eq(productColors.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении цвета ID=${id}:`, error);
    return { success: false, error: "Ошибка при удалении цвета" };
  }
}

/**
 * Функции для работы с технологиями
 */

/**
 * Создание новой технологии
 */
export async function createTechnology(formData: TechnologyFormData) {
  try {
    const validatedFields = technologyFormSchema.parse(formData);

    // Проверка уникальности имени технологии
    const existingTech = await db
      .select({ id: productTechnologies.id })
      .from(productTechnologies)
      .where(eq(productTechnologies.name, validatedFields.name))
      .limit(1);

    if (existingTech.length > 0) {
      return { success: false, error: "Технология с таким названием уже существует" };
    }

    // Вставка данных в БД
    const result = await db.insert(productTechnologies).values({
      name: validatedFields.name,
      title: validatedFields.title,
      description: validatedFields.description || null,
      icon: validatedFields.icon,
    }).returning({ id: productTechnologies.id });

    revalidatePath("/admin/catalog");
    return { success: true, data: { id: result[0].id } };
  } catch (error) {
    console.error("Ошибка при создании технологии:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при создании технологии" };
  }
}

/**
 * Обновление технологии
 */
export async function updateTechnology(id: number, formData: TechnologyFormData) {
  try {
    const validatedFields = technologyFormSchema.parse(formData);

    // Проверка уникальности имени технологии (исключая текущую)
    const existingTech = await db
      .select({ id: productTechnologies.id })
      .from(productTechnologies)
      .where(eq(productTechnologies.name, validatedFields.name))
      .limit(1);

    if (existingTech.length > 0 && existingTech[0].id !== id) {
      return { success: false, error: "Технология с таким названием уже существует" };
    }

    // Обновление данных в БД
    await db.update(productTechnologies)
      .set({
        name: validatedFields.name,
        title: validatedFields.title,
        description: validatedFields.description || null,
        icon: validatedFields.icon,
        updatedAt: new Date(),
      })
      .where(eq(productTechnologies.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении технологии ID=${id}:`, error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Ошибка при обновлении технологии" };
  }
}

/**
 * Удаление технологии
 */
export async function deleteTechnology(id: number) {
  try {
    // Проверка использования технологии в продуктах
    const productsWithTech = await db
      .select({ id: productToTechnologies.id })
      .from(productToTechnologies)
      .where(eq(productToTechnologies.technologyId, id))
      .limit(1);

    if (productsWithTech.length > 0) {
      return { success: false, error: "Нельзя удалить технологию, которая используется в продуктах" };
    }

    // Удаление технологии
    await db.delete(productTechnologies).where(eq(productTechnologies.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении технологии ID=${id}:`, error);
    return { success: false, error: "Ошибка при удалении технологии" };
  }
}

/**
 * Обновление коллекции
 */
export async function updateCollection(id: number, data: {
  name: string;
  slug: string;
  description?: string;
}) {
  try {
    await db.update(collections)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        updatedAt: new Date(),
      })
      .where(eq(collections.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при обновлении коллекции ID=${id}:`, error);
    return { success: false, error: "Ошибка при обновлении коллекции" };
  }
}

/**
 * Удаление коллекции
 */
export async function deleteCollection(id: number) {
  try {
    // Проверяем, есть ли товары в коллекции
    const productsInCollection = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.collectionId, id))
      .limit(1);

    if (productsInCollection.length > 0) {
      return { success: false, error: "Нельзя удалить коллекцию, в которой есть товары" };
    }

    // Проверяем, используется ли коллекция как кросс-коллекция
    const productsWithCrossCollection = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.crossCollectionId, id))
      .limit(1);

    if (productsWithCrossCollection.length > 0) {
      return { success: false, error: "Нельзя удалить коллекцию, которая используется как кросс-коллекция" };
    }

    // Удаляем коллекцию
    await db.delete(collections).where(eq(collections.id, id));

    revalidatePath("/admin/catalog");
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении коллекции ID=${id}:`, error);
    return { success: false, error: "Ошибка при удалении коллекции" };
  }
}
