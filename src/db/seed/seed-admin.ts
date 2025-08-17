import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { hash } from 'bcrypt-ts';
import { admins } from '../schema';
import * as schema from '../schema';

const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@example.com',
  password: 'admin123', // Это будет захешировано перед сохранением
};

/**
 * Создает администратора по умолчанию, если он не существует
 */
export async function seedAdmin(db: PostgresJsDatabase<typeof schema>) {
  console.log('Checking for admin account...');

  try {
    // Проверяем, существует ли уже админ
    const existingAdmin = await db.select().from(admins).limit(1);

    if (existingAdmin.length === 0) {
      // Создаем первого админа только если админов еще нет
      const hashedPassword = await hash(DEFAULT_ADMIN.password, 10);

      await db.insert(admins).values({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
      });

      console.log('Default admin created successfully');
      return true;
    } else {
      console.log('Admin already exists, skipping seed');
      return false;
    }
  } catch (error) {
    console.error('Error seeding admin account:', error);
    throw error;
  }
}

// Экспортируем функцию seed для совместимости с импортами
export async function seed(db: PostgresJsDatabase<typeof schema>) {
  return seedAdmin(db);
}

// import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import { hash } from 'bcrypt-ts';
// import { admins } from '../schema';
// import * as schema from '../schema';

// const DEFAULT_ADMIN = {
//   name: 'Admin',
//   email: 'admin@example.com',
//   password: 'admin123', // Это будет захешировано перед сохранением
// };

// export async function seed(db: PostgresJsDatabase<typeof schema>) {
//   try {
//     // Проверяем, существует ли уже админ
//     const existingAdmin = await db.select().from(admins).limit(1);

//     if (existingAdmin.length === 0) {
//       // Создаем первого админа только если админов еще нет
//       const hashedPassword = await hash(DEFAULT_ADMIN.password, 10);

//       await db.insert(admins).values({
//         name: DEFAULT_ADMIN.name,
//         email: DEFAULT_ADMIN.email,
//         password: hashedPassword,
//       });

//       console.log('Default admin created successfully');
//     } else {
//       console.log('Admin already exists, skipping seed');
//     }
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     throw error;
//   }
// }
