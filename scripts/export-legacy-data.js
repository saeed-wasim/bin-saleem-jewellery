// One-time export of the legacy SQLite data (customers, categories, items) to JSON,
// consumed by bs-backend/scripts/import-legacy-data.js during the MySQL migration.
// Safe to delete once the migration is complete.
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const outPath = path.join(__dirname, '..', '..', 'bs-backend', 'data', 'legacy-export.json');

const db = new Database(dbPath, { readonly: true });

const data = {
  categories: db.prepare('SELECT id, name, description, image FROM categories ORDER BY id ASC').all(),
  items: db.prepare('SELECT id, name, description, price, category_id, image FROM items ORDER BY id ASC').all(),
  customers: db.prepare('SELECT id, name, email, phone, city FROM customers ORDER BY id ASC').all(),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`Exported ${data.categories.length} categories, ${data.items.length} items, ${data.customers.length} customers`);
console.log(`Written to ${outPath}`);
