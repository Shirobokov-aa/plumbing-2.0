import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { seedKitchen } from './migrations/0006_kitchen_seed'

const runMigrations = async () => {
  const connection = postgres(process.env.DATABASE_URL!)
  const db = drizzle(connection)

  try {
    // Применяем миграцию
    await migrate(db, {
      migrationsFolder: 'src/db/migrations',
      migrationsTable: 'kitchen_migrations',
    })

    // Заполняем данными
    await seedKitchen()

    console.log('Kitchen migration and seeding completed successfully')
  } catch (error) {
    console.error('Error during kitchen migration:', error)
  } finally {
    await connection.end()
  }
}

runMigrations()
