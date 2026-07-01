import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(() => {
  initializeDatabase();
  const categories = db.prepare('SELECT id, name, description FROM categories ORDER BY id ASC').all();
  return categories;
});
