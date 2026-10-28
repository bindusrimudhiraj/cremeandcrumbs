import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// ─── GET /api/products  (public — active only) ──────────
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM products WHERE active = TRUE';
    const params = [];
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category.toLowerCase());
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ products: rows });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── GET /api/products/admin/all  (admin — all) ─────────
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ products: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── GET /api/products/:id  (public) ────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── POST /api/products  (admin) ────────────────────────
router.post('/', auth, admin, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(['cookies','brownies','gift','seasonal']).withMessage('Invalid category'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const { name, category, subtitle, price, original_price, badge, description, details, image_url, active } = req.body;
    const detailsJson = Array.isArray(details) ? JSON.stringify(details) : (details || null);
    const [result] = await pool.query(
      `INSERT INTO products (name, category, subtitle, price, original_price, badge, description, details, image_url, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, subtitle || null, price, original_price || null, badge || null,
       description || null, detailsJson, image_url || null, active !== false]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json({ product: rows[0] });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── PUT /api/products/:id  (admin) ─────────────────────
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { name, category, subtitle, price, original_price, badge, description, details, image_url, active } = req.body;
    const detailsJson = Array.isArray(details) ? JSON.stringify(details) : (details || null);
    await pool.query(
      `UPDATE products SET name=?, category=?, subtitle=?, price=?, original_price=?,
       badge=?, description=?, details=?, image_url=?, active=? WHERE id=?`,
      [name, category, subtitle || null, price, original_price || null, badge || null,
       description || null, detailsJson, image_url || null, active !== false, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product: rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── DELETE /api/products/:id  (admin) ──────────────────
// Soft delete by default. ?hard=true for permanent deletion.
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const hard = req.query.hard === 'true';
    if (hard) {
      await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Product permanently deleted.' });
    }
    await pool.query('UPDATE products SET active = FALSE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deactivated (soft delete).' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
