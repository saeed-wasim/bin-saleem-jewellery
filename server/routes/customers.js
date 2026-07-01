import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const customers = db.prepare('SELECT id, name, email, phone, city FROM customers ORDER BY id ASC').all();
  res.json(customers);
});

export default router;
