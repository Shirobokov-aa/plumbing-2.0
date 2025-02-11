import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

async function testConnection() {
  try {
    const result = await db.execute(`SELECT 1+1 AS result`);
    console.log("Успешное подключение к БД:", result);
  } catch (error) {
    console.error("Ошибка подключения к БД:", error);
  } finally {
    await pool.end();
  }
}

testConnection();
