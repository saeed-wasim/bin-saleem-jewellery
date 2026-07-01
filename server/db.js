import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

export const db = new Database(dbPath);

if (!db) {
  throw new Error('SQLite database connection failed');
}

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      city TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL
    );
  `);

  const customerCount = db.prepare('SELECT COUNT(*) AS count FROM customers').get().count;
  if (customerCount === 0) {
    const insertCustomer = db.prepare('INSERT INTO customers (name, email, phone, city) VALUES (?, ?, ?, ?)');
    const seedCustomers = [
      { name: 'Amina Saleem', email: 'amina@example.com', phone: '+966500000001', city: 'Riyadh' },
      { name: 'Khalid Ali', email: 'khalid@example.com', phone: '+966500000002', city: 'Jeddah' },
      { name: 'Sara Hassan', email: 'sara@example.com', phone: '+966500000003', city: 'Dammam' },
      { name: 'Omar Nasser', email: 'omar@example.com', phone: '+966500000004', city: 'Mecca' }
    ];

    const insertManyCustomers = db.transaction((customers) => {
      for (const customer of customers) {
        insertCustomer.run(customer.name, customer.email, customer.phone, customer.city);
      }
    });

    insertManyCustomers(seedCustomers);
  }

  const categoryCount = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
  if (categoryCount === 0) {
    // Categories are created and managed from the admin CRUD UI.
  }
}

initializeDatabase();
