import express from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// ─── POST /api/orders  — place order from cart ──────────
router.post('/', auth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Get cart items
    const [cartItems] = await conn.query(
      `SELECT ci.qty, p.id as product_id, p.name, p.price
       FROM cart_items ci JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );
    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Your cart is empty.' });
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const { notes, address } = req.body;
    if (!address || !address.trim()) {
      await conn.rollback();
      return res.status(400).json({ error: 'Delivery address is required to place your order.' });
    }

    // Ensure address column exists in orders table if created under older schema
    try {
      const [cols] = await conn.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'address'"
      );
      if (cols.length === 0) {
        await conn.query("ALTER TABLE orders ADD COLUMN address TEXT DEFAULT NULL");
      }
    } catch (_) {}

    // Insert order
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total, notes, address) VALUES (?, ?, ?, ?)',
      [req.user.id, total.toFixed(2), notes || null, address.trim()]
    );
    const orderId = orderResult.insertId;
    // Insert order items
    for (const item of cartItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, product_name, qty, price_at_time) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.name, item.qty, item.price]
      );
    }
    // Clear cart
    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    await conn.commit();
    // Return order with items
    const [order] = await conn.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [items] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    res.status(201).json({ order: { ...order[0], items } });
  } catch (err) {
    await conn.rollback();
    console.error('Place order error:', err);
    res.status(500).json({ error: 'Server error. Could not place order.' });
  } finally {
    conn.release();
  }
});

// ─── GET /api/orders  — my orders ───────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    // Attach items to each order
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        return { ...order, items };
      })
    );
    res.json({ orders: enriched });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── GET /api/orders/all  — admin: all orders ───────────
router.get('/all', auth, admin, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        return { ...order, items };
      })
    );
    res.json({ orders: enriched });
  } catch (err) {
    console.error('Admin get orders error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── PUT /api/orders/:id/status  — admin ────────────────
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ order: rows[0] });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
