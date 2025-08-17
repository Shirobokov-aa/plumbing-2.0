import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema';
import { config } from 'dotenv';

// Загружаем переменные окружения из .env файла, если он существует
config();

async function main() {
  try {
    console.log('Starting migrations...');

    const connectionString = process.env.DATABASE_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'postgresql://postgres:123@localhost:5436/database_abelsber-2.0'
        : 'postgresql://postgres:123@database:5432/database_abelsber-2.0');

    console.log(`Connecting to database: ${connectionString}`);

    const client = postgres(connectionString, {
      max: 1,
      idle_timeout: 10
    });

    const db = drizzle(client, { schema });

    console.log('Running migrations from drizzle folder...');
    await migrate(db, { migrationsFolder: 'drizzle' });

    console.log('Migrations completed successfully');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main();
