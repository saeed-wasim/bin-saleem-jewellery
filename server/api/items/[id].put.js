import { db, initializeDatabase } from '../../db.js';

export default defineEventHandler(async (event) => {
  initializeDatabase();
  
  const id = Number(getRouterParam(event, 'id'));
  const formData = await readFormData(event);
  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const price = formData.get('price')?.toString().trim();
  const categoryId = formData.get('categoryId')?.toString().trim();
  const imageFile = formData.get('image');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  if (!name || !description || !price || !categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Name, description, price, and category are required' });
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

  const update = db.prepare(`
    UPDATE items 
    SET name = ?, description = ?, price = ?, category_id = ? ${imageBase64 ? ', image = ?' : ', image = image'}
    WHERE id = ?
  `);
  
  const params = imageBase64 
    ? [name, description, parseFloat(price), parseInt(categoryId), imageBase64, id]
    : [name, description, parseFloat(price), parseInt(categoryId), id];
    
  const result = update.run(...params);

  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  return { id, name, description, price: parseFloat(price), categoryId: parseInt(categoryId), image: imageBase64 };
});
