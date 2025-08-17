'use server';

import { db } from "@/db";
import { eq, and, sql, asc, desc, ilike, or, ne } from "drizzle-orm";
import {
  products,
  productCategories,
  productCharacteristics,
  productColors,
  productDocuments,
  productTechnologies,
  productToColors,
  productToTechnologies,
  collections,
  collectionPages
} from "@/db/schema";

import {
  Product,
  ProductCategory,
  ProductCharacteristic,
  ProductColor,
  ProductDocument,
  ProductTechnology,
  ProductWithDetails,
  ProductsQueryParams,
  ProductsQueryResult,
  Collection
} from "@/types/catalog";

/**
 * Получает список категорий продуктов
 */
export async function getProductCategories(lang: string = 'ru'): Promise<{ data: ProductCategory[] }> {
  try {
    const categories = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.lang, lang))
      .orderBy(asc(productCategories.order));

    return {
      data: categories as ProductCategory[]
    };
  } catch (error) {
    console.error("Ошибка при получении категорий продуктов:", error);
    return { data: [] };
  }
}

/**
 * Получает категорию продуктов по slug
 */
export async function getProductCategoryBySlug(slug: string, lang: string = 'ru'): Promise<{ data: ProductCategory | null }> {
  try {
    const category = await db
      .select()
      .from(productCategories)
      .where(and(
        eq(productCategories.slug, slug),
        eq(productCategories.lang, lang)
      ))
      .limit(1);

    return {
      data: category.length > 0 ? category[0] as ProductCategory : null
    };
  } catch (error) {
    console.error(`Ошибка при получении категории '${slug}':`, error);
    return { data: null };
  }
}

/**
 * Получает список продуктов с возможностью фильтрации и пагинации
 */
export async function getProducts(params: ProductsQueryParams = {}): Promise<ProductsQueryResult> {
  const {
    categoryId,
    subcategoryId,
    categorySlug,
    subcategorySlug,
    featured,
    lang = 'ru',
    limit = 12,
    offset = 0
  } = params;

  try {
    // Условия для фильтрации
    const conditions = [eq(products.lang, lang), eq(products.isActive, true)];

    // --- Обработка фильтрации по категории ---
    let usedCategoryId: number | undefined = categoryId;

    // Если указан slug категории, найдем соответствующий ID
    if (categorySlug) {
      console.log(`Поиск категории по слагу: ${categorySlug}`);

      // Прямой поиск по слагу в базе данных
      const categoryResult = await db
        .select()
        .from(productCategories)
        .where(
          and(
            eq(productCategories.slug, categorySlug),
            eq(productCategories.lang, lang)
          )
        )
        .limit(1);

      if (categoryResult.length > 0) {
        usedCategoryId = categoryResult[0].id;
        console.log(`Найдена категория: ${categoryResult[0].name} (ID: ${usedCategoryId})`);
      } else {
        console.log(`Категория со слагом ${categorySlug} не найдена`);
      }
    }

    if (usedCategoryId !== undefined) {
      conditions.push(eq(products.categoryId, usedCategoryId));
    }

    // --- Обработка фильтрации по подкатегории ---
    let usedSubcategoryId: number | undefined = subcategoryId;

    // Если указан slug подкатегории, найдем соответствующий ID
    if (subcategorySlug) {
      console.log(`Поиск подкатегории по слагу: ${subcategorySlug}`);

      // Если известен ID родительской категории, добавляем его в условие
      let subcategoryResult;
      if (usedCategoryId !== undefined) {
        subcategoryResult = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.slug, subcategorySlug),
              eq(productCategories.lang, lang),
              eq(productCategories.parentId, usedCategoryId)
            )
          )
          .limit(1);
      } else {
        subcategoryResult = await db
          .select()
          .from(productCategories)
          .where(
            and(
              eq(productCategories.slug, subcategorySlug),
              eq(productCategories.lang, lang)
            )
          )
          .limit(1);
      }

      if (subcategoryResult.length > 0) {
        usedSubcategoryId = subcategoryResult[0].id;
        console.log(`Найдена подкатегория: ${subcategoryResult[0].name} (ID: ${usedSubcategoryId})`);
      } else {
        // Если подкатегория не найдена с учетом родительской категории,
        // попробуем найти ее без учета родительской категории
        if (usedCategoryId !== undefined) {
          console.log(`Подкатегория не найдена в указанной категории, пробуем поиск без привязки к категории`);

          const altResult = await db
            .select()
            .from(productCategories)
            .where(
              and(
                eq(productCategories.slug, subcategorySlug),
                eq(productCategories.lang, lang)
              )
            )
            .limit(1);

          if (altResult.length > 0) {
            usedSubcategoryId = altResult[0].id;
            // Если нашли подкатегорию, но она принадлежит другой категории,
            // обновляем usedCategoryId и условие фильтрации
            const parentId = altResult[0].parentId;
            if (parentId !== null && parentId !== usedCategoryId) {
              console.log(`Подкатегория найдена, но принадлежит другой категории (ID: ${parentId})`);

              // Обновляем ID категории
              usedCategoryId = parentId;

              // Обновляем условие фильтрации по категории
              // Ищем существующее условие по categoryId и заменяем его
              let categoryConditionIndex = -1;
              for (let i = 0; i < conditions.length; i++) {
                if (String(conditions[i]).includes(`${products.categoryId.name}`)) {
                  categoryConditionIndex = i;
                  break;
                }
              }

              if (categoryConditionIndex !== -1) {
                // Заменяем существующее условие
                conditions[categoryConditionIndex] = eq(products.categoryId, parentId);
              } else {
                // Добавляем новое условие
                conditions.push(eq(products.categoryId, parentId));
              }
            }

            console.log(`Найдена подкатегория: ${altResult[0].name} (ID: ${usedSubcategoryId})`);
          } else {
            console.log(`Подкатегория со слагом ${subcategorySlug} не найдена`);
          }
        } else {
          console.log(`Подкатегория со слагом ${subcategorySlug} не найдена`);
        }
      }
    }

    if (usedSubcategoryId !== undefined) {
      conditions.push(eq(products.subcategoryId, usedSubcategoryId));
    }

    // Если нужны только избранные товары
    if (featured) {
      conditions.push(eq(products.featured, featured));
    }

    console.log(`Поиск продуктов: категория ID=${usedCategoryId}, подкатегория ID=${usedSubcategoryId}`);
    console.log('Условия фильтрации:', conditions.map(c => String(c)).join(', '));

    // Запрос списка продуктов
    const productsList = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(products.createdAt));

    console.log(`Найдено продуктов: ${productsList.length}`);

    // Запрос для подсчета общего количества
    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));

    const total = countQuery[0]?.count || 0;
    const page = Math.floor(offset / limit) + 1;
    const pageSize = limit;
    const hasMore = offset + productsList.length < total;

    return {
      products: productsList as Product[],
      total,
      page,
      pageSize,
      hasMore
    };
  } catch (error) {
    console.error("Ошибка при получении списка продуктов:", error);
    return {
      products: [],
      total: 0,
      page: 1,
      pageSize: limit,
      hasMore: false
    };
  }
}

/**
 * Получает детальную информацию о продукте по ID
 */
export async function getProductById(id: number, lang: string = 'ru'): Promise<{ data: ProductWithDetails | null }> {
  try {
    // Получаем базовую информацию о продукте
    const productResult = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, id),
        eq(products.lang, lang)
      ))
      .limit(1);

    if (productResult.length === 0) {
      return { data: null };
    }

    const productData = productResult[0] as Product;

    // ОПТИМИЗАЦИЯ: Выполняем все запросы параллельно вместо последовательно
    const [
      categoryResult,
      subcategoryResult,
      colorsResult,
      characteristicsResult,
      technologiesResult,
      documentsResult
    ] = await Promise.all([
      // Категория
      db
        .select()
        .from(productCategories)
        .where(eq(productCategories.id, productData.categoryId))
        .limit(1),

      // Подкатегория (только если есть subcategoryId)
      productData.subcategoryId
        ? db
            .select()
            .from(productCategories)
            .where(eq(productCategories.id, productData.subcategoryId))
            .limit(1)
        : Promise.resolve([]),

      // Цвета
      db
        .select({
          color: productColors,
          linkToProduct: productToColors.linkToProduct
        })
        .from(productToColors)
        .innerJoin(productColors, eq(productToColors.colorId, productColors.id))
        .where(eq(productToColors.productId, id)),

      // Характеристики
      db
        .select()
        .from(productCharacteristics)
        .where(eq(productCharacteristics.productId, id))
        .orderBy(asc(productCharacteristics.order)),

      // Технологии
      db
        .select({
          technology: productTechnologies
        })
        .from(productToTechnologies)
        .innerJoin(productTechnologies, eq(productToTechnologies.technologyId, productTechnologies.id))
        .where(eq(productToTechnologies.productId, id)),

      // Документы
      db
        .select()
        .from(productDocuments)
        .where(eq(productDocuments.productId, id))
    ]);

    // Обработка результатов
    const category = categoryResult.length > 0 ? categoryResult[0] as ProductCategory : undefined;
    const subcategory = subcategoryResult.length > 0 ? subcategoryResult[0] as ProductCategory : undefined;
    const colors = colorsResult.map(item => item.color) as ProductColor[];
    const productToColorsData = colorsResult.map(item => ({
      colorId: item.color.id,
      linkToProduct: item.linkToProduct
    }));
    const characteristics = characteristicsResult as ProductCharacteristic[];
    const technologies = technologiesResult.map(item => item.technology) as ProductTechnology[];
    const documents = documentsResult as ProductDocument[];

    // Возвращаем полную информацию о продукте
    return {
      data: {
        ...productData,
        category,
        subcategory,
        colors,
        characteristics,
        technologies,
        documents,
        productToColors: productToColorsData
      }
    };
  } catch (error) {
    console.error(`Ошибка при получении информации о продукте ID=${id}:`, error);
    return { data: null };
  }
}

/**
 * Поиск продуктов по названию
 */
export async function searchProducts(
  query: string,
  lang: string = 'ru',
  limit: number = 10
): Promise<{ data: Product[] }> {
  try {
    if (!query || query.trim().length < 2) {
      return { data: [] };
    }

    const searchQuery = `%${query.trim()}%`;

    const searchResults = await db
      .select()
      .from(products)
      .where(and(
        eq(products.lang, lang),
        eq(products.isActive, true),
        or(
          ilike(products.name, searchQuery),
          ilike(products.article, searchQuery),
          ilike(products.description || '', searchQuery)
        )
      ))
      .limit(limit)
      .orderBy(desc(products.createdAt));

    return {
      data: searchResults as Product[]
    };
  } catch (error) {
    console.error(`Ошибка при поиске продуктов по запросу '${query}':`, error);
    return { data: [] };
  }
}

/**
 * Получает список технологий
 */
export async function getProductTechnologies(): Promise<{ data: ProductTechnology[] }> {
  try {
    const technologiesData = await db
      .select()
      .from(productTechnologies);

    return {
      data: technologiesData as ProductTechnology[]
    };
  } catch (error) {
    console.error("Ошибка при получении технологий:", error);
    return { data: [] };
  }
}

/**
 * Получает список доступных цветов продуктов
 */
export async function getProductColors(): Promise<{ data: ProductColor[] }> {
  try {
    const colorsData = await db
      .select()
      .from(productColors)
      .orderBy(asc(productColors.name));

    return {
      data: colorsData as ProductColor[]
    };
  } catch (error) {
    console.error("Ошибка при получении цветов:", error);
    return { data: [] };
  }
}

/**
 * Получает все категории с подкатегориями
 */
export async function getCategoriesWithSubcategories(lang: string = 'ru'): Promise<{
  categories: ProductCategory[];
  subcategoriesByParent: Record<number, ProductCategory[]>;
}> {
  try {
    const { data: allCategories } = await getProductCategories(lang);

    // Разделяем категории на основные и подкатегории
    const parentCategories = allCategories.filter(cat => !cat.parentId);

    // Группируем подкатегории по ID родительской категории
    const subcategoriesByParent: Record<number, ProductCategory[]> = {};

    allCategories.forEach(category => {
      if (category.parentId) {
        if (!subcategoriesByParent[category.parentId]) {
          subcategoriesByParent[category.parentId] = [];
        }
        subcategoriesByParent[category.parentId].push(category);
      }
    });

    // Сортируем подкатегории по порядку отображения
    for (const parentId in subcategoriesByParent) {
      subcategoriesByParent[parentId].sort((a, b) => a.order - b.order);
    }

    return {
      categories: parentCategories.sort((a, b) => a.order - b.order),
      subcategoriesByParent
    };
  } catch (error) {
    console.error('Ошибка при получении категорий с подкатегориями:', error);
    return {
      categories: [],
      subcategoriesByParent: {}
    };
  }
}

/**
 * Получает все продукты для подкатегории
 */
export async function getProductsBySubcategory(
  subcategorySlug: string,
  lang: string = 'ru',
  limit: number = 100
): Promise<{
  products: Product[];
  subcategory: ProductCategory | null;
  parentCategory: ProductCategory | null;
}> {
  try {
    // Получаем информацию о подкатегории
    const { data: subcategory } = await getProductCategoryBySlug(subcategorySlug, lang);

    if (!subcategory) {
      return { products: [], subcategory: null, parentCategory: null };
    }

    // Получаем информацию о родительской категории
    let parentCategory = null;
    if (subcategory.parentId) {
      const parentResult = await db
        .select()
        .from(productCategories)
        .where(eq(productCategories.id, subcategory.parentId))
        .limit(1);

      if (parentResult.length > 0) {
        parentCategory = parentResult[0] as ProductCategory;
      }
    }

    // Получаем продукты для этой подкатегории
    const result = await getProducts({
      subcategoryId: subcategory.id,
      lang,
      limit
    });

    return {
      products: result.products,
      subcategory,
      parentCategory
    };
  } catch (error) {
    console.error(`Ошибка при получении продуктов для подкатегории '${subcategorySlug}':`, error);
    return {
      products: [],
      subcategory: null,
      parentCategory: null
    };
  }
}

/**
 * Модифицированная функция getProducts для улучшенной поддержки фильтрации по категориям и подкатегориям
 */
export async function getProductsQuery(params: ProductsQueryParams = {}): Promise<ProductsQueryResult> {
  const {
    categoryId,
    subcategoryId,
    categorySlug,
    subcategorySlug,
    featured,
    lang = 'ru',
    limit = 100,
    offset = 0
  } = params;

  try {
    // Условия для фильтрации
    const conditions = [eq(products.lang, lang), eq(products.isActive, true)];

    // Обрабатываем фильтрацию по категории
    let usedCategoryId = categoryId;

    // Если указан slug категории, найдем соответствующий ID
    if (categorySlug) {
      const categoryResult = await getProductCategoryBySlug(categorySlug, lang);
      if (categoryResult.data?.id) {
        usedCategoryId = categoryResult.data.id;
      }
    }

    if (usedCategoryId) {
      conditions.push(eq(products.categoryId, usedCategoryId));
    }

    // Обрабатываем фильтрацию по подкатегории
    let usedSubcategoryId = subcategoryId;

    // Если указан slug подкатегории, найдем соответствующий ID
    if (subcategorySlug) {
      const subcategoryResult = await getProductCategoryBySlug(subcategorySlug, lang);
      if (subcategoryResult.data?.id) {
        usedSubcategoryId = subcategoryResult.data.id;
      }
    }

    if (usedSubcategoryId) {
      conditions.push(eq(products.subcategoryId, usedSubcategoryId));
    }

    // Если нужны только избранные
    if (featured) {
      conditions.push(eq(products.featured, featured));
    }

    // Запрос списка продуктов
    const productsList = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(products.createdAt));

    // Запрос для подсчета общего количества
    const countQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions));

    const total = countQuery[0]?.count || 0;
    const page = Math.floor(offset / limit) + 1;
    const pageSize = limit;
    const hasMore = offset + productsList.length < total;

    return {
      products: productsList as Product[],
      total,
      page,
      pageSize,
      hasMore
    };
  } catch (error) {
    console.error("Ошибка при получении списка продуктов:", error);
    return {
      products: [],
      total: 0,
      page: 1,
      pageSize: limit,
      hasMore: false
    };
  }
}

/**
 * Получает товары из той же коллекции (исключая текущий товар)
 */
export async function getRelatedProductsByCollection(
  productId: number,
  limit: number = 4,
  lang: string = "ru"
): Promise<{ data: Product[]; collectionName: string | null }> {
  try {
    // Получаем текущий продукт, чтобы узнать его коллекцию
    const productResult = await db.select({
      id: products.id,
      collectionId: products.collectionId
    }).from(products).where(eq(products.id, productId)).limit(1);

    if (productResult.length === 0 || !productResult[0].collectionId) {
      return { data: [], collectionName: null };
    }

    const collectionId = productResult[0].collectionId;

    // Получаем информацию о коллекции
    const collectionResult = await db.select().from(collections).where(eq(collections.id, collectionId)).limit(1);
    const collectionName = collectionResult[0]?.name || null;

    // Получаем связанные товары
    const relatedProducts = await db.select()
      .from(products)
      .where(
        and(
          eq(products.collectionId, collectionId),
          eq(products.lang, lang),
          eq(products.isActive, true),
          ne(products.id, productId)
        )
      )
      .limit(limit);

    return {
      data: relatedProducts.map(product => ({
        ...product,
        images: product.images || [],
        featured: product.featured || false,
        isActive: product.isActive || false
      })),
      collectionName
    };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { data: [], collectionName: null };
  }
}

// Функция создания коллекции
export async function createCollection(data: {
  name: string;
  slug: string;
  description?: string;
  subTitle?: string;
  imageBase64?: string;
}) {
  try {
    const result = await db.insert(collections).values({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      subTitle: data.subTitle || null,
      imageBase64: data.imageBase64 || null
    }).returning();

    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      error: "Не удалось создать коллекцию"
    };
  }
}

// Функция получения всех коллекций
export async function getCollections(lang?: string) {
  try {
    console.log(`[catalog] Запрос коллекций из catalog.ts, язык: ${lang || 'не указан'}`);

    try {
      // Тест подключения к БД - проверка, что соединение работает
      const testConnection = await db.execute(sql`SELECT 1 as test`);
      console.log(`[catalog] Тест подключения к БД успешен:`, testConnection);
    } catch (connectionError) {
      console.error('[catalog] Ошибка при тестировании подключения к БД:', connectionError);
      return {
        success: false,
        error: `Ошибка подключения к базе данных: ${connectionError instanceof Error ? connectionError.message : String(connectionError)}`
      };
    }

    // Получаем основные данные коллекций
    const result = await db.select().from(collections);
    console.log(`[catalog] Получено ${result.length} коллекций`);

    // Если указан язык, дополняем данными из collectionPages
    if (lang && result.length > 0) {
      console.log(`[catalog] Запрашиваем дополнительные данные для языка: ${lang}`);

      try {
        // Получаем данные страниц коллекций для указанного языка
        const collectionPagesData = await db
          .select()
          .from(collectionPages)
          .where(eq(collectionPages.lang, lang));

        console.log(`[catalog] Получено ${collectionPagesData.length} страниц коллекций`);

        // Создаем словарь страниц коллекций по ID коллекции
        const pagesDict: Record<number, typeof collectionPages.$inferSelect> = {};
        collectionPagesData.forEach(page => {
          pagesDict[page.collectionId] = page;
        });

        // Обогащаем результаты данными со страниц коллекций
        const enrichedResults = result.map(collection => {
          const page = pagesDict[collection.id];
          return {
            ...collection,
            // Используем данные из страницы коллекции, если они есть
            title: page?.title || collection.name,
            description: page?.description || collection.description,
            imageBase64: page?.heroImage || collection.imageBase64
          };
        });

        if (enrichedResults.length > 0) {
          console.log('[catalog] Пример первой обогащенной коллекции:', JSON.stringify({
            id: enrichedResults[0].id,
            name: enrichedResults[0].name,
            slug: enrichedResults[0].slug,
            hasDescription: !!enrichedResults[0].description,
            hasImage: !!enrichedResults[0].imageBase64,
          }, null, 2));
        }

        return {
          success: true,
          data: enrichedResults
        };
      } catch (pagesError) {
        console.error('[catalog] Ошибка при получении страниц коллекций:', pagesError);
        // Если ошибка в получении страниц, всё равно возвращаем базовые коллекции
        console.log('[catalog] Возвращаем базовые коллекции без обогащения данными страниц');
      }
    }

    if (result.length > 0) {
      console.log('[catalog] Пример первой коллекции:', JSON.stringify({
        id: result[0].id,
        name: result[0].name,
        slug: result[0].slug,
        hasDescription: !!result[0].description,
        hasImage: !!result[0].imageBase64,
      }, null, 2));
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[catalog] Ошибка при получении коллекций:", error);
    console.error("[catalog] Детали ошибки:", errorMessage);

    return {
      success: false,
      error: `Не удалось получить список коллекций: ${errorMessage}`
    };
  }
}

// Функция получения товаров по ID коллекции
export async function getProductsByCollectionId(collectionId: number) {
  try {
    const result = await db.select().from(products).where(eq(products.collectionId, collectionId));
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    return {
      success: false,
      error: "Не удалось получить товары коллекции"
    };
  }
}

// Функция получения связанных товаров по кросс-коллекции
export async function getRelatedProductsByCrossCollection(productId: number, limit: number = 4, lang: string = "ru") {
  try {
    // Сначала получаем информацию о текущем товаре
    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);

    if (!product[0] || !product[0].crossCollectionId) {
      return {
        success: true,
        data: [],
        collectionName: null
      };
    }

    // Получаем информацию о коллекции
    const collection = await db.select().from(collections).where(eq(collections.id, product[0].crossCollectionId)).limit(1);

    // Получаем связанные товары из кросс-коллекции
    const relatedProducts = await db.select()
      .from(products)
      .where(
        and(
          eq(products.collectionId, product[0].crossCollectionId),
          eq(products.lang, lang),
          eq(products.isActive, true),
          ne(products.id, productId)
        )
      )
      .limit(limit);

    return {
      success: true,
      data: relatedProducts,
      collectionName: collection[0]?.name || null
    };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return {
      success: false,
      error: "Не удалось получить связанные товары",
      data: [],
      collectionName: null
    };
  }
}

/**
 * Получает товары коллекции с детальной информацией
 */
export async function getCollectionProducts(collectionId: number, lang: string = 'ru'): Promise<{
  data: ProductWithDetails[];
  collection: Collection | null;
}> {
  try {
    // Получаем информацию о коллекции
    const collectionResult = await db
      .select()
      .from(collections)
      .where(eq(collections.id, collectionId))
      .limit(1);

    const collection = collectionResult[0] || null;

    // Получаем товары коллекции
    const productsResult = await db
      .select()
      .from(products)
      .where(and(
        eq(products.collectionId, collectionId),
        eq(products.lang, lang),
        eq(products.isActive, true)
      ))
      .orderBy(desc(products.createdAt));

    // Для каждого продукта получаем дополнительную информацию
    const productsWithDetails = await Promise.all(
      productsResult.map(async (product) => {
        const { data } = await getProductById(product.id, lang);
        return data;
      })
    );

    return {
      data: productsWithDetails.filter((p): p is ProductWithDetails => p !== null),
      collection
    };
  } catch (error) {
    console.error(`Ошибка при получении товаров коллекции ID=${collectionId}:`, error);
    return { data: [], collection: null };
  }
}
