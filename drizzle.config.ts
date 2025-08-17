import { defineConfig } from 'drizzle-kit';

// Определяем URL для подключения к базе данных
// Используем разные URL для разработки и для Docker
// Проверяем, запущен ли скрипт внутри Docker, проверяя переменную окружения
const isInsideDocker = process.env.INSIDE_DOCKER === 'true';
const dbUrl = isInsideDocker
  ? 'postgresql://postgres:123@database:5432/database_abelsber-2.0'
  : 'postgresql://postgres:123@localhost:5436/database_abelsber-2.0';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || dbUrl,
  },
  // Настройка для автоматического создания таблиц
  strict: true,
  verbose: true,
});
