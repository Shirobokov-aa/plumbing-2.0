import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
// Remove this import that's causing the issue
// import { runMigrations } from './migrate'

// Настройки подключения к БД
const isDevelopment = process.env.NODE_ENV === 'development'
const connectionString = process.env.DATABASE_URL || (isDevelopment
  ? 'postgresql://postgres:123@localhost:5436/database_abelsber-2.0'
  : 'postgresql://postgres:123@database:5432/database_abelsber-2.0')

console.log(`[Database] Environment: ${process.env.NODE_ENV}, Connection: ${connectionString.replace(/postgresql:\/\/postgres:(.*)@/, 'postgresql://postgres:*****@')}`);

// Создаем клиент postgres с настройками для повторного использования
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  debug: (connection_id, message) => {
    console.log(`[Database Debug] Connection ${connection_id}: ${message}`);
  },
  onnotice: (notice) => {
    console.log('[Database Notice]', notice);
  }
})

export const db = drizzle(client, { schema })

// Обработчик завершения работы приложения
process.on('beforeExit', async () => {
  await client.end()
})
