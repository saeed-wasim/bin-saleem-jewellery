import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(() => {
  initializeDatabase();
  const items = db.prepare(`
    SELECT i.id, i.name, i.description, i.price, i.image, i.category_id, c.name as category_name
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    ORDER BY i.id DESC
  `).all();
  return items;
});
