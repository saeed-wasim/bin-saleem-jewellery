import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db.js';
import customersRouter from './routes/customers.js';
import categoriesRouter from './routes/categories.js';

const app = express();
const port = process.env.ADMIN_PORT || 3001;

app.use(cors());
app.use(express.json());

initializeDatabase();

app.use('/api/customers', customersRouter);
app.use('/api/categories', categoriesRouter);

app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
