import { db } from '../index';
import { seedAdmin } from './seed-admin';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';

export async function seed(db: PostgresJsDatabase<typeof schema>) {
  try {
    console.log('Starting database seeding...');
    await seedAdmin(db);
    console.log('Database seeding completed.');
    return true;
  } catch (error) {
    console.error('Error during database seeding:', error);
    throw error;
  }
}

// Запускаем только если файл запущен напрямую
if (require.main === module) {
  seed(db).catch((error) => {
    console.error('Fatal error during database seeding:', error);
    process.exit(1);
  });
}
