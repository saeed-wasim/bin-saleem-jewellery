import { db, initializeDatabase } from '../../db.js';

export default defineEventHandler(async (event) => {
  initializeDatabase();
  
  const id = Number(getRouterParam(event, 'id'));
  const formData = await readFormData(event);
  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const imageFile = formData.get('image');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  if (!name || !description) {
    throw createError({ statusCode: 400, statusMessage: 'Name and description are required' });
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

  // Update category - only update image if a new one was provided
  const update = db.prepare(`
    UPDATE categories 
    SET name = ?, description = ? ${imageBase64 ? ', image = ?' : ', image = image'}
    WHERE id = ?
  `);
  
  const params = imageBase64 
    ? [name, description, imageBase64, id]
    : [name, description, id];
    
  const result = update.run(...params);

  if (result.changes === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' });
  }

  return { id, name, description, image: imageBase64 };
});
