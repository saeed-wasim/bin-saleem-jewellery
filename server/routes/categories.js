import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const categories = db.prepare('SELECT id, name, description, image FROM categories ORDER BY id ASC').all();
  res.json(categories);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  
  const update = db.prepare(`
    UPDATE categories 
    SET name = ?, description = ? ${image ? ', image = ?' : ', image = image'}
    WHERE id = ?
  `);
  
  const params = image ? [name, description, image, id] : [name, description, id];
  const result = update.run(...params);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }
  
  res.json({ id, name, description, image });
});

export default router;
