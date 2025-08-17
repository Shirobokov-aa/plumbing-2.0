import { config } from 'dotenv';
import { exec } from 'child_process';

// Загружаем переменные окружения из .env файла
config();

async function generateMigration() {
  try {
    console.log('Generating migration...');

    const connectionString = process.env.DATABASE_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'postgresql://postgres:123@localhost:5436/database_abelsber-2.0'
        : 'postgresql://postgres:123@database:5432/database_abelsber-2.0');

    console.log(`Connecting to database: ${connectionString}`);

    // Запуск команды drizzle-kit generate
    const command = `npx drizzle-kit generate:pg --schema=./src/db/schema.ts --out=./drizzle`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating migration: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`Migration generated successfully: ${stdout}`);
    });
  } catch (error) {
    console.error('Error generating migration:', error);
    process.exit(1);
  }
}

generateMigration();
