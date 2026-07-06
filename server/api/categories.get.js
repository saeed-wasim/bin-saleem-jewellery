import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(() => {
  initializeDatabase();
  const categories = db.prepare('SELECT id, name, description, image FROM categories ORDER BY id DESC').all();
  return categories;
});
