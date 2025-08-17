-- Добавляем поле image_base64 в таблицу collections
ALTER TABLE collections ADD COLUMN image_base64 TEXT;

-- Обновляем существующие записи, если они есть
UPDATE collections SET image_base64 = '' WHERE image_base64 IS NULL;
