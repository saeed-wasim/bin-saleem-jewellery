import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const categories = db.prepare('SELECT id, name, description FROM categories ORDER BY id ASC').all();
  res.json(categories);
});

export default router;
