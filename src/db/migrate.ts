import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export async function runMigrations(db: PostgresJsDatabase<typeof schema>) {
  try {
    console.log('Starting database migrations...');

    // Путь к директории с миграциями (должен совпадать с выходным путем, указанным в db:generate)
    await migrate(db, { migrationsFolder: 'drizzle' });

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}
