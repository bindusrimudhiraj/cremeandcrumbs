import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();
// All cart routes require authentication
router.use(auth);

// ─── GET /api/cart ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ci.id, ci.qty, p.id as product_id, p.name, p.subtitle, p.price,
              p.original_price, p.image_url, p.badge, p.category
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    res.json({ cart: rows });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── POST /api/cart  { product_id, qty } ─────────────────
router.post('/', async (req, res) => {
  try {
    const { product_id, qty = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required.' });
    // Check product exists
    const [product] = await pool.query('SELECT id FROM products WHERE id = ? AND active = TRUE', [product_id]);
    if (product.length === 0) return res.status(404).json({ error: 'Product not found.' });
    // Upsert: if already in cart, increment qty
    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, qty)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE qty = qty + ?`,
      [req.user.id, product_id, qty, qty]
    );
    // Return updated cart
    const [cart] = await pool.query(
      `SELECT ci.id, ci.qty, p.id as product_id, p.name, p.subtitle, p.price,
              p.original_price, p.image_url, p.badge, p.category
       FROM cart_items ci JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    res.json({ cart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── PUT /api/cart/:id  { qty } ──────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { qty } = req.body;
    if (!qty || qty < 1) {
      await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    } else {
      await pool.query('UPDATE cart_items SET qty = ? WHERE id = ? AND user_id = ?', [qty, req.params.id, req.user.id]);
    }
    const [cart] = await pool.query(
      `SELECT ci.id, ci.qty, p.id as product_id, p.name, p.subtitle, p.price,
              p.original_price, p.image_url, p.badge, p.category
       FROM cart_items ci JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    res.json({ cart });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── DELETE /api/cart/:id ────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── DELETE /api/cart (clear all) ───────────────────────
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
