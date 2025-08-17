import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';
import { seedAdmin } from './seed-admin';

/**
 * Основная функция заполнения базы данных
 * Вызывает все отдельные seed-функции
 */
export async function seed(db: PostgresJsDatabase<typeof schema>) {
  console.log('Starting database seeding...');

  try {
    // Создаем администратора
    await seedAdmin(db);

    console.log('Database seeding completed successfully');
    return true;
  } catch (error) {
    console.error('Error during database seeding:', error);
    return false;
  }
}
