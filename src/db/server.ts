import { db } from './index'
import { runMigrations } from './migrate'

export async function initDatabase() {
  try {
    console.log('Starting database initialization...')

    // Запускаем миграции только в production режиме или если указан флаг INIT_DB
    if (process.env.NODE_ENV === 'production' || process.env.INIT_DB === 'true') {
      console.log('Running migrations...')
      await runMigrations(db)
    } else {
      console.log('Skipping migrations in development mode')
    }

    console.log('Database initialization successful')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

// Запускаем инициализацию только если файл запущен напрямую
if (require.main === module) {
  initDatabase().catch((error) => {
    console.error('Fatal error during database initialization:', error)
    process.exit(1)
  })
}
