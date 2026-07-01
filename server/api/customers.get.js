import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(() => {
  initializeDatabase();
  const customers = db.prepare('SELECT id, name, email, phone, city FROM customers ORDER BY id ASC').all();
  return customers;
});
