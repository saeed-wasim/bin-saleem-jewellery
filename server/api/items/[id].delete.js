import { db, initializeDatabase } from '../../db.js';

export default defineEventHandler(async (event) => {
  initializeDatabase();
  const id = Number(getRouterParam(event, 'id'));
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item id is required' });
  }

  const deleteItem = db.prepare('DELETE FROM items WHERE id = ?');
  const result = deleteItem.run(id);
  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  return { success: true };
});
