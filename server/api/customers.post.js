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

  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim();
  const phone = body?.phone?.toString().trim();
  const city = body?.city?.toString().trim();

  if (!name || !email || !phone || !city) {
    throw createError({ statusCode: 400, statusMessage: 'All customer fields are required' });
  }

  const insert = db.prepare('INSERT INTO customers (name, email, phone, city) VALUES (?, ?, ?, ?)');
  const result = insert.run(name, email, phone, city);

  return { id: result.lastInsertRowid, name, email, phone, city };
});
