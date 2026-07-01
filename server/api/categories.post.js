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

  const name = body?.name?.toString().trim() || body?.Name?.toString().trim() || body?.name?.toString().trim();
  const description = body?.description?.toString().trim() || body?.Description?.toString().trim();

  if (!name || !description) {
    throw createError({ statusCode: 400, statusMessage: 'Name and description are required' });
  }

  const insert = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
  const result = insert.run(name, description);
  return { id: result.lastInsertRowid, name, description };
});
