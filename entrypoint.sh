#!/bin/sh
set -e

echo "Starting entrypoint script..."

# Ждем, пока база данных станет доступной
echo "Waiting for PostgreSQL to be available..."
until pg_isready -h database -p 5432 -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - starting database migrations"

# Запускаем миграции с помощью Drizzle вместо удаления всех таблиц
echo "Running database migrations..."
export PGPASSWORD="123"
export DATABASE_URL="postgresql://postgres:123@database:5432/database_abelsber-2.0"
export NODE_ENV="production"
export INIT_DB="true"

# Проверяем существование базы данных и создаем ее, если она не существует
psql -U postgres -h database -d postgres << EOF
SELECT 'CREATE DATABASE "database_abelsber-2.0"' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'database_abelsber-2.0')\\gexec
EOF

echo "Checking DB connection..."
psql -U postgres -h database -d database_abelsber-2.0 -c "SELECT 1" || echo "DB connection failed but continuing..."

# CHECK IF ADMINS TABLE EXISTS - NEW CODE
echo "Checking if database is already initialized..."
ADMINS_EXISTS=$(psql -U postgres -h database -d database_abelsber-2.0 -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admins');" 2>/dev/null || echo "f")

if [ "$ADMINS_EXISTS" = "t" ]; then
  echo "Database already initialized (admins table exists), skipping migrations..."
  ADMIN_COUNT=$(psql -U postgres -h database -d database_abelsber-2.0 -tAc "SELECT COUNT(*) FROM admins;" 2>/dev/null || echo "0")
  echo "Found $ADMIN_COUNT admin(s) in database"
else
  echo "Database not initialized, running migrations..."

  echo "Executing Drizzle migrations..."
  # Запускаем миграции через migrate.ts
  cd /app
  node --input-type=module -e "
  import { drizzle } from 'drizzle-orm/postgres-js';
  import { migrate } from 'drizzle-orm/postgres-js/migrator';
  import postgres from 'postgres';

  async function runMigrations() {
    try {
      const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@database:5432/database_abelsber-2.0';
      console.log('Connecting to database...');
      const client = postgres(connectionString);
      const db = drizzle(client);

      console.log('Running migrations...');
      await migrate(db, { migrationsFolder: 'drizzle' });
      console.log('Migrations completed successfully');

      await client.end();
    } catch (error) {
      console.error('Error running migrations:', error);
      process.exit(1);
    }
  }

  runMigrations();
  "
fi

# Запускаем seed скрипты для заполнения базы начальными данными
echo "Seeding database with initial data..."
cd /app && npx tsx -e "
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { seedAdmin } from './src/db/seed/seed-admin.ts';

async function setupDatabase() {
  try {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@database:5432/database_abelsber-2.0';
    console.log('Connecting to database...');
    const client = postgres(connectionString);
    const db = drizzle(client);

    // Запускаем только сид для админа
    console.log('Running seed script for admin...');
    await seedAdmin(db);

    console.log('Database seeding completed successfully');
    await client.end();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
"

echo "Database initialization completed"

# Запускаем основной процесс
echo "Starting main process..."
exec "$@"
