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
    throw createError({ statusCode: 400, statusMessage: 'Customer id is required' });
  }

  const deleteCustomer = db.prepare('DELETE FROM customers WHERE id = ?');
  const result = deleteCustomer.run(id);
  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
  }

  return { success: true };
});
