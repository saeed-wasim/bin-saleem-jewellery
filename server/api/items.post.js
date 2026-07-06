import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(async (event) => {
  initializeDatabase();
  
  const formData = await readFormData(event);
  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const price = formData.get('price')?.toString().trim();
  const categoryId = formData.get('categoryId')?.toString().trim();
  const imageFile = formData.get('image');

  if (!name || !description || !price || !categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Name, description, price, and category are required' });
  }

  if (!imageFile) {
    throw createError({ statusCode: 400, statusMessage: 'Image is required' });
  }

  let imageBase64 = null;
  if (imageFile && imageFile instanceof File) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = imageFile.type || 'image/jpeg';
      imageBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  }

  const insert = db.prepare('INSERT INTO items (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)');
  const result = insert.run(name, description, parseFloat(price), parseInt(categoryId), imageBase64);
  return { id: result.lastInsertRowid, name, description, price: parseFloat(price), categoryId: parseInt(categoryId), image: imageBase64 };
});
