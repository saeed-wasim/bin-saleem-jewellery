import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(async (event) => {
  initializeDatabase();
  
  const formData = await readFormData(event);
  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const imageFile = formData.get('image');

  if (!name || !description) {
    throw createError({ statusCode: 400, statusMessage: 'Name and description are required' });
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
      console.log('Image converted to base64, length:', imageBase64.length);
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  }

  const insert = db.prepare('INSERT INTO categories (name, description, image) VALUES (?, ?, ?)');
  const result = insert.run(name, description, imageBase64);
  return { id: result.lastInsertRowid, name, description, image: imageBase64 };
});
