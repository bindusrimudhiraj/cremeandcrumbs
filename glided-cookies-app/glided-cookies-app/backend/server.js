import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes     from './routes/auth.js';
import productRoutes  from './routes/products.js';
import cartRoutes     from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes    from './routes/orders.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ─── CORS ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Body parsing ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static: uploaded images ─────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders',   orderRoutes);

// ─── Health check ────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ─── 404 ─────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` }));

// ─── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🍪 Crème & Crumbs API running on http://localhost:${PORT}`);
  console.log(`   Admin: admin@cremencrumbs.com / admin@123`);
  console.log(`   Docs:  http://localhost:${PORT}/api/health\n`);
});
