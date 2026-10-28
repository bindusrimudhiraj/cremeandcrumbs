import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_PRODUCTS = [
  {
    id: 1, name: 'Sea Salt Toffee', category: 'cookies',
    subtitle: 'Maldon salt · brown butter', price: 549, original_price: null,
    badge: 'Bestseller', active: true,
    description: 'Our signature brown butter cookie crowned with hand-harvested Maldon sea salt and ribbons of house-made toffee.',
    details: ['Brown butter base', 'Maldon sea salt finish', 'House-made toffee ribbons', '6 cookies per box'],
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 2, name: 'Midnight Espresso Brownie', category: 'brownies',
    subtitle: 'Single-origin roast · walnut', price: 649, original_price: null,
    badge: 'Fan favourite', active: true,
    description: 'Fudge brownie enriched with single-origin espresso and studded with toasted California walnuts.',
    details: ['72% single-origin cacao', 'Arabica espresso extract', 'Toasted California walnuts', '8 brownies per box'],
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 3, name: 'Zesty Poppyseed', category: 'cookies',
    subtitle: 'Amalfi lemon · vanilla glaze', price: 499, original_price: null,
    badge: 'Seasonal', active: true,
    description: 'Bright Amalfi lemon zest folded into a cloud-light dough, crowned with vanilla bean glaze.',
    details: ['Amalfi lemon zest', 'Madagascar vanilla glaze', 'Poppy seeds', '6 cookies per box'],
    image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 4, name: 'The Cookie Box', category: 'gift',
    subtitle: '12 signature flavors', price: 1999, original_price: 2400,
    badge: 'Gift pick', active: true,
    description: 'Twelve cookies spanning our entire repertoire. Presented in our signature kraft box with a handwritten note.',
    details: ['12 cookies, 6 varieties', 'Handwritten note included', 'Signature kraft box', 'Ships same day'],
    image_url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 5, name: 'Fudge Brownie Box', category: 'brownies',
    subtitle: 'Box of 8, triple-chocolate', price: 1199, original_price: null,
    badge: null, active: true,
    description: 'Eight fudge brownies layered with milk, dark, and white chocolate in a single velvet bite.',
    details: ['Triple chocolate layers', 'Glossy ganache top', 'Box of 8', 'No preservatives'],
    image_url: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 6, name: 'Heritage Gift Hamper', category: 'gift',
    subtitle: 'Silk ribbon · handwritten note', price: 3499, original_price: 4199,
    badge: 'Limited', active: true,
    description: 'Our most treasured offering — 24 cookies, 8 brownies, vanilla fudge, and loose-leaf tea wrapped in silk ribbon.',
    details: ['24 cookies + 8 brownies', 'House-made vanilla fudge', 'Loose-leaf tea tin', 'Silk ribbon & linen wrap'],
    image_url: 'https://images.unsplash.com/photo-1607920592519-bab2c90f5494?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 7, name: 'Lavender Shortbread', category: 'cookies',
    subtitle: 'Provence lavender · cultured butter', price: 499, original_price: null,
    badge: null, active: true,
    description: 'Crumbly, buttery shortbread infused with culinary Provence lavender.',
    details: ['Culinary Provence lavender', 'Cultured butter', 'Organic cane sugar', '8 fingers per box'],
    image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=700&q=90',
    created_at: new Date().toISOString(),
  },
  {
    id: 8, name: 'Autumn Praline Box', category: 'seasonal',
    subtitle: 'Pecan praline · maple · autumn spice', price: 1799, original_price: 2099,
    badge: '15% off', active: true,
    description: 'A seasonal celebration — pecan praline cookies, maple-glazed blondies, and spiced shortbread.',
    details: ['Pecan praline cookies', 'Maple-glazed blondies', 'Spiced shortbread', '15 pieces total'],
    image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=700&q=90',
    created_at: new Date().toISOString(),
  },
];

function loadData() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (Array.isArray(data.users)) {
        const adminIdx = data.users.findIndex(u => u.role === 'admin' || u.email === 'admin@glidedcookies.com' || u.email === 'admin@cremencrumbs.com');
        if (adminIdx > -1) {
          data.users[adminIdx].email = 'admin@cremencrumbs.com';
          data.users[adminIdx].password_hash = bcrypt.hashSync('admin@123', 10);
        } else {
          data.users.push({
            id: 1,
            name: 'Admin',
            email: 'admin@cremencrumbs.com',
            password_hash: bcrypt.hashSync('admin@123', 10),
            role: 'admin',
            created_at: new Date().toISOString(),
          });
        }
        saveData(data);
      }
      return data;
    } catch (_) {}
  }

  const defaultAdmin = {
    id: 1,
    name: 'Admin',
    email: 'admin@cremencrumbs.com',
    password_hash: bcrypt.hashSync('admin@123', 10),
    role: 'admin',
    created_at: new Date().toISOString(),
  };

  const initial = {
    users: [defaultAdmin],
    products: DEFAULT_PRODUCTS,
    cart_items: [],
    wishlist_items: [],
    orders: [],
    order_items: [],
  };

  saveData(initial);
  return initial;
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// In-memory data synced to JSON file
let db = loadData();

function nextId(collection) {
  if (!db[collection] || db[collection].length === 0) return 1;
  return Math.max(...db[collection].map(i => Number(i.id) || 0)) + 1;
}

export async function executeQuery(sql, params = []) {
  const s = sql.trim().replace(/\s+/g, ' ');
  const p = params ? [...params] : [];

  // Ignore schema migration statements
  if (/^ALTER TABLE/i.test(s) || /INFORMATION_SCHEMA/i.test(s)) {
    return [[], []];
  }

  // ── USERS ──────────────────────────────────────────────
  if (/^SELECT id FROM users WHERE email = \?/i.test(s)) {
    const rows = db.users.filter(u => u.email.toLowerCase() === p[0].toLowerCase());
    return [rows.map(u => ({ id: u.id })), []];
  }

  if (/^SELECT id, name, email, password_hash, role FROM users WHERE email = \?/i.test(s)) {
    const rows = db.users.filter(u => u.email.toLowerCase() === p[0].toLowerCase());
    return [rows, []];
  }

  if (/^SELECT id, name, email, role, created_at FROM users WHERE id = \?/i.test(s)) {
    const rows = db.users.filter(u => Number(u.id) === Number(p[0]));
    return [rows, []];
  }

  if (/^INSERT INTO users \(name, email, password_hash, role\) VALUES/i.test(s)) {
    const id = nextId('users');
    const newUser = {
      id,
      name: p[0],
      email: p[1],
      password_hash: p[2],
      role: p[3] || 'customer',
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  if (/^INSERT INTO users \(name, email, password_hash\) VALUES/i.test(s)) {
    const id = nextId('users');
    const newUser = {
      id,
      name: p[0],
      email: p[1],
      password_hash: p[2],
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  if (/^UPDATE users SET password_hash = \?, role = \? WHERE email = \?/i.test(s)) {
    const user = db.users.find(u => u.email.toLowerCase() === p[2].toLowerCase());
    if (user) {
      user.password_hash = p[0];
      user.role = p[1];
      saveData(db);
    }
    return [{ affectedRows: user ? 1 : 0 }, []];
  }

  // ── PRODUCTS ───────────────────────────────────────────
  if (/^SELECT \* FROM products WHERE active = TRUE/i.test(s)) {
    let rows = db.products.filter(pr => pr.active !== false);
    if (/category = \?/i.test(s)) {
      rows = rows.filter(pr => pr.category.toLowerCase() === p[0].toLowerCase());
    }
    rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return [rows, []];
  }

  if (/^SELECT \* FROM products ORDER BY created_at DESC/i.test(s)) {
    const rows = [...db.products].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return [rows, []];
  }

  if (/^SELECT id FROM products WHERE id = \? AND active = TRUE/i.test(s)) {
    const rows = db.products.filter(pr => Number(pr.id) === Number(p[0]) && pr.active !== false);
    return [rows.map(pr => ({ id: pr.id })), []];
  }

  if (/^SELECT \* FROM products WHERE id = \?/i.test(s)) {
    const rows = db.products.filter(pr => Number(pr.id) === Number(p[0]));
    return [rows, []];
  }

  if (/^INSERT INTO products/i.test(s)) {
    const id = nextId('products');
    const newProd = {
      id,
      name: p[0],
      category: p[1],
      subtitle: p[2],
      price: Number(p[3]),
      original_price: p[4] ? Number(p[4]) : null,
      badge: p[5] || null,
      description: p[6] || '',
      details: p[7] ? (typeof p[7] === 'string' ? JSON.parse(p[7]) : p[7]) : [],
      image_url: p[8] || '',
      active: p[9] !== false,
      created_at: new Date().toISOString(),
    };
    db.products.push(newProd);
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  if (/^UPDATE products SET active = FALSE WHERE id = \?/i.test(s)) {
    const prod = db.products.find(pr => Number(pr.id) === Number(p[0]));
    if (prod) {
      prod.active = false;
      saveData(db);
    }
    return [{ affectedRows: prod ? 1 : 0 }, []];
  }

  if (/^DELETE FROM products WHERE id = \?/i.test(s)) {
    const prevLen = db.products.length;
    db.products = db.products.filter(pr => Number(pr.id) !== Number(p[0]));
    saveData(db);
    return [{ affectedRows: prevLen - db.products.length }, []];
  }

  if (/^UPDATE products SET/i.test(s)) {
    const targetId = Number(p[p.length - 1]);
    const prod = db.products.find(pr => Number(pr.id) === targetId);
    if (prod) {
      // name=?, category=?, subtitle=?, price=?, original_price=?, badge=?, description=?, details=?, image_url=?, active=? WHERE id=?
      prod.name = p[0];
      prod.category = p[1];
      prod.subtitle = p[2];
      prod.price = Number(p[3]);
      prod.original_price = p[4] ? Number(p[4]) : null;
      prod.badge = p[5] || null;
      prod.description = p[6] || '';
      prod.details = p[7] ? (typeof p[7] === 'string' ? JSON.parse(p[7]) : p[7]) : [];
      if (p[8]) prod.image_url = p[8];
      prod.active = p[9] !== false;
      saveData(db);
    }
    return [{ affectedRows: prod ? 1 : 0 }, []];
  }

  // ── CART ───────────────────────────────────────────────
  if (/FROM cart_items ci/i.test(s)) {
    const userId = Number(p[0]);
    const items = db.cart_items.filter(c => Number(c.user_id) === userId);
    const rows = items.map(c => {
      const prod = db.products.find(pr => Number(pr.id) === Number(c.product_id)) || {};
      return {
        id: c.id,
        qty: c.qty,
        product_id: c.product_id,
        name: prod.name || '',
        subtitle: prod.subtitle || '',
        price: prod.price || 0,
        original_price: prod.original_price || null,
        image_url: prod.image_url || '',
        badge: prod.badge || null,
        category: prod.category || '',
      };
    });
    return [rows, []];
  }

  if (/^INSERT INTO cart_items \(user_id, product_id, qty\) VALUES/i.test(s)) {
    const userId = Number(p[0]);
    const prodId = Number(p[1]);
    const qty = Number(p[2]);
    const existing = db.cart_items.find(c => Number(c.user_id) === userId && Number(c.product_id) === prodId);
    if (existing) {
      existing.qty += qty;
    } else {
      db.cart_items.push({ id: nextId('cart_items'), user_id: userId, product_id: prodId, qty });
    }
    saveData(db);
    return [{ affectedRows: 1 }, []];
  }

  if (/^UPDATE cart_items SET qty = \? WHERE id = \? AND user_id = \?/i.test(s)) {
    const item = db.cart_items.find(c => Number(c.id) === Number(p[1]) && Number(c.user_id) === Number(p[2]));
    if (item) {
      item.qty = Number(p[0]);
      saveData(db);
    }
    return [{ affectedRows: item ? 1 : 0 }, []];
  }

  if (/^DELETE FROM cart_items WHERE id = \? AND user_id = \?/i.test(s)) {
    const prev = db.cart_items.length;
    db.cart_items = db.cart_items.filter(c => !(Number(c.id) === Number(p[0]) && Number(c.user_id) === Number(p[1])));
    saveData(db);
    return [{ affectedRows: prev - db.cart_items.length }, []];
  }

  if (/^DELETE FROM cart_items WHERE user_id = \?/i.test(s)) {
    const prev = db.cart_items.length;
    db.cart_items = db.cart_items.filter(c => Number(c.user_id) !== Number(p[0]));
    saveData(db);
    return [{ affectedRows: prev - db.cart_items.length }, []];
  }

  // ── WISHLIST ───────────────────────────────────────────
  if (/FROM wishlist_items wi/i.test(s)) {
    const userId = Number(p[0]);
    const items = db.wishlist_items.filter(w => Number(w.user_id) === userId);
    const rows = items.map(w => {
      const prod = db.products.find(pr => Number(pr.id) === Number(w.product_id)) || {};
      return {
        id: w.id,
        product_id: w.product_id,
        name: prod.name || '',
        subtitle: prod.subtitle || '',
        price: prod.price || 0,
        original_price: prod.original_price || null,
        image_url: prod.image_url || '',
        badge: prod.badge || null,
        category: prod.category || '',
      };
    });
    return [rows, []];
  }

  if (/^SELECT id FROM wishlist_items WHERE user_id = \? AND product_id = \?/i.test(s)) {
    const rows = db.wishlist_items.filter(w => Number(w.user_id) === Number(p[0]) && Number(w.product_id) === Number(p[1]));
    return [rows.map(w => ({ id: w.id })), []];
  }

  if (/^DELETE FROM wishlist_items WHERE user_id = \? AND product_id = \?/i.test(s)) {
    const prev = db.wishlist_items.length;
    db.wishlist_items = db.wishlist_items.filter(w => !(Number(w.user_id) === Number(p[0]) && Number(w.product_id) === Number(p[1])));
    saveData(db);
    return [{ affectedRows: prev - db.wishlist_items.length }, []];
  }

  if (/^INSERT INTO wishlist_items \(user_id, product_id\) VALUES/i.test(s)) {
    const id = nextId('wishlist_items');
    db.wishlist_items.push({ id, user_id: Number(p[0]), product_id: Number(p[1]) });
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  // ── ORDERS ─────────────────────────────────────────────
  if (/^INSERT INTO orders \(user_id, total, notes, address\) VALUES/i.test(s)) {
    const id = nextId('orders');
    const newOrder = {
      id,
      user_id: Number(p[0]),
      total: Number(p[1]).toFixed(2),
      notes: p[2] || null,
      address: p[3] || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  if (/^INSERT INTO orders \(user_id, total, notes\) VALUES/i.test(s)) {
    const id = nextId('orders');
    const newOrder = {
      id,
      user_id: Number(p[0]),
      total: Number(p[1]).toFixed(2),
      notes: p[2] || null,
      address: null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  if (/^INSERT INTO order_items \(order_id, product_id, product_name, qty, price_at_time\) VALUES/i.test(s)) {
    const id = nextId('order_items');
    db.order_items.push({
      id,
      order_id: Number(p[0]),
      product_id: Number(p[1]),
      product_name: p[2],
      qty: Number(p[3]),
      price_at_time: Number(p[4]),
    });
    saveData(db);
    return [{ insertId: id, affectedRows: 1 }, []];
  }

  if (/^SELECT \* FROM orders WHERE id = \?/i.test(s)) {
    const rows = db.orders.filter(o => Number(o.id) === Number(p[0]));
    return [rows, []];
  }

  if (/^SELECT \* FROM order_items WHERE order_id = \?/i.test(s)) {
    const rows = db.order_items.filter(oi => Number(oi.order_id) === Number(p[0]));
    return [rows, []];
  }

  if (/^SELECT \* FROM orders WHERE user_id = \? ORDER BY created_at DESC/i.test(s)) {
    const rows = db.orders
      .filter(o => Number(o.user_id) === Number(p[0]))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [rows, []];
  }

  if (/FROM orders o JOIN users u ON o.user_id = u.id/i.test(s)) {
    const rows = db.orders.map(o => {
      const u = db.users.find(usr => Number(usr.id) === Number(o.user_id)) || {};
      return {
        ...o,
        user_name: u.name || 'Customer',
        user_email: u.email || '',
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return [rows, []];
  }

  if (/^UPDATE orders SET status = \? WHERE id = \?/i.test(s)) {
    const ord = db.orders.find(o => Number(o.id) === Number(p[1]));
    if (ord) {
      ord.status = p[0];
      saveData(db);
    }
    return [{ affectedRows: ord ? 1 : 0 }, []];
  }

  console.warn('Unhandled query in JSON database:', s);
  return [[], []];
}

const pool = {
  query: executeQuery,
  async getConnection() {
    return {
      query: executeQuery,
      async beginTransaction() {},
      async commit() {},
      async rollback() {},
      release() {},
    };
  },
};

console.log('✅ Lightweight File-Based JSON Database active (Zero SQL database required).');

export default pool;
