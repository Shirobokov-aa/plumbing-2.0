-- Миграция 0005: Добавление критических индексов для производительности
-- Дата создания: 2024-01-XX
-- Описание: Индексы для оптимизации запросов к продуктам

-- Основной составной индекс для фильтрации продуктов (самый важный)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_lang_active_created
ON products (lang, is_active, created_at DESC);

-- Индекс для фильтрации по категории
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_lang_active
ON products (category_id, lang, is_active);

-- Индекс для фильтрации по подкатегории
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_subcategory_lang_active
ON products (subcategory_id, lang, is_active)
WHERE subcategory_id IS NOT NULL;

-- Индекс для категорий по slug (для быстрого поиска категорий)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_categories_slug_lang
ON product_categories (slug, lang);

-- Индексы для связанных таблиц (решает N+1 проблему)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_characteristics_product_id
ON product_characteristics (product_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_to_colors_product_id
ON product_to_colors (product_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_to_technologies_product_id
ON product_to_technologies (product_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_documents_product_id
ON product_documents (product_id);
