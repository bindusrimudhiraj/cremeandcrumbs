import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth);

// ─── GET /api/wishlist ───────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT wi.id, p.id as product_id, p.name, p.subtitle, p.price,
              p.original_price, p.image_url, p.badge, p.category
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       WHERE wi.user_id = ?`,
      [req.user.id]
    );
    res.json({ wishlist: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── POST /api/wishlist  { product_id }  (toggle) ───────
router.post('/', async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required.' });
    const [existing] = await pool.query(
      'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );
    if (existing.length > 0) {
      await pool.query('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
      return res.json({ action: 'removed', product_id });
    }
    await pool.query('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
    res.json({ action: 'added', product_id });
  } catch (err) {
    console.error('Wishlist toggle error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── DELETE /api/wishlist/:product_id ───────────────────
router.delete('/:product_id', async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.product_id]);
    res.json({ message: 'Removed from wishlist.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
