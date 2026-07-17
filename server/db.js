import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Store database in project root to avoid deletion during builds
const projectRoot = path.join(__dirname, '..');
const dbPath = process.env.DATABASE_PATH || path.join(projectRoot, 'database.sqlite');

export const db = new Database(dbPath);

if (!db) {
  throw new Error('SQLite database connection failed');
}

export function initializeDatabase() {
  // Enable WAL mode for better performance and concurrency
  db.pragma('journal_mode = WAL');
  
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
      description TEXT NOT NULL,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category_id INTEGER NOT NULL,
      image TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  // Add image column to categories table if it doesn't exist
  try {
    db.exec('ALTER TABLE categories ADD COLUMN image TEXT');
  } catch (error) {
    // Column already exists, ignore error
  }

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
