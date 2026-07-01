import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(async (event) => {
  initializeDatabase();
  let body = await readBody(event);

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const id = Number(body?.id);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category id is required' });
  }

  const deleteCategory = db.prepare('DELETE FROM categories WHERE id = ?');
  const result = deleteCategory.run(id);
  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' });
  }

  return { success: true };
});
