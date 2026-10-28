// ============================================================
//  Crème & Crumbs — localStorage Service
//  All data lives in the browser. No backend needed.
// ============================================================

const KEYS = {
  PRODUCTS: 'gc_products',
  USERS:    'gc_users',
  SESSION:  'gc_session',
  CART:     'gc_cart',
  WISHLIST: 'gc_wishlist',
  ORDERS:   'gc_orders',
};

// ─── Helpers ──────────────────────────────────────────────
const get  = (key)        => JSON.parse(localStorage.getItem(key) || 'null');
const set  = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const uid  = ()           => Date.now() + Math.random().toString(36).slice(2);

// ─── Seed Products ────────────────────────────────────────
const SEED_PRODUCTS = [
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

// ─── Seed Admin User ───────────────────────────────────────
const SEED_ADMIN = {
  id: 'admin-001',
  name: 'Admin',
  email: 'admin@cremencrumbs.com',
  password: 'admin@123',   // admin password
  role: 'admin',
  created_at: new Date().toISOString(),
};

// ─── Initialise storage on first load ─────────────────────
const SEED_VERSION = 'v3-creme'; // bump this to force-reseed products

export function initStorage() {
  // Force-reseed products if version changed
  if (localStorage.getItem('gc_seed_ver') !== SEED_VERSION) {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.setItem('gc_seed_ver', SEED_VERSION);
  }
  if (!get(KEYS.PRODUCTS)) set(KEYS.PRODUCTS, SEED_PRODUCTS);
  if (!get(KEYS.ORDERS))   set(KEYS.ORDERS, []);

  // Ensure admin user is updated to admin@cremencrumbs.com / admin@123
  const users = get(KEYS.USERS) || [];
  const adminIdx = users.findIndex(u => u.role === 'admin' || u.email === 'admin@glidedcookies.com' || u.email === 'admin@cremencrumbs.com');
  if (adminIdx > -1) {
    users[adminIdx] = { ...users[adminIdx], email: 'admin@cremencrumbs.com', password: 'admin@123', role: 'admin' };
    set(KEYS.USERS, users);
  } else {
    set(KEYS.USERS, [...users, SEED_ADMIN]);
  }
}

// ============================================================
//  AUTH
// ============================================================
export const auth = {
  login(email, password) {
    const users = get(KEYS.USERS) || [];
    const user  = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password.');
    const { password: _, ...safeUser } = user;
    set(KEYS.SESSION, safeUser);
    return safeUser;
  },

  register(name, email, password) {
    const users = get(KEYS.USERS) || [];
    if (users.find(u => u.email === email)) throw new Error('An account with this email already exists.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    const newUser = { id: uid(), name, email, password, role: 'customer', created_at: new Date().toISOString() };
    set(KEYS.USERS, [...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    set(KEYS.SESSION, safeUser);
    return safeUser;
  },

  logout() { localStorage.removeItem(KEYS.SESSION); },

  getSession() { return get(KEYS.SESSION); },
};

// ============================================================
//  PRODUCTS
// ============================================================
export const products = {
  getAll(activeOnly = true) {
    const all = get(KEYS.PRODUCTS) || [];
    return activeOnly ? all.filter(p => p.active) : all;
  },

  getById(id) {
    return (get(KEYS.PRODUCTS) || []).find(p => p.id == id) || null;
  },

  add(data) {
    const all = get(KEYS.PRODUCTS) || [];
    const next = { ...data, id: Date.now(), active: data.active !== false, created_at: new Date().toISOString() };
    set(KEYS.PRODUCTS, [...all, next]);
    return next;
  },

  update(id, data) {
    const all = get(KEYS.PRODUCTS) || [];
    const updated = all.map(p => p.id == id ? { ...p, ...data } : p);
    set(KEYS.PRODUCTS, updated);
    return updated.find(p => p.id == id);
  },

  remove(id) {
    const all = get(KEYS.PRODUCTS) || [];
    set(KEYS.PRODUCTS, all.filter(p => p.id != id));
  },

  toggleActive(id) {
    const p = this.getById(id);
    if (p) this.update(id, { active: !p.active });
  },
};

// ============================================================
//  CART  (per-user, keyed by userId)
// ============================================================
export const cart = {
  _key(userId) { return `gc_cart_${userId}`; },

  get(userId) { return JSON.parse(localStorage.getItem(this._key(userId)) || '[]'); },

  add(userId, product, qty = 1) {
    const items = this.get(userId);
    const idx   = items.findIndex(i => i.product_id === product.id);
    if (idx > -1) items[idx].qty += qty;
    else items.push({ id: uid(), product_id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, image_url: product.image_url, badge: product.badge, qty });
    localStorage.setItem(this._key(userId), JSON.stringify(items));
    return items;
  },

  updateQty(userId, itemId, qty) {
    let items = this.get(userId);
    if (qty <= 0) items = items.filter(i => i.id !== itemId);
    else items = items.map(i => i.id === itemId ? { ...i, qty } : i);
    localStorage.setItem(this._key(userId), JSON.stringify(items));
    return items;
  },

  remove(userId, itemId) {
    const items = this.get(userId).filter(i => i.id !== itemId);
    localStorage.setItem(this._key(userId), JSON.stringify(items));
    return items;
  },

  clear(userId) { localStorage.removeItem(this._key(userId)); },
};

// ============================================================
//  WISHLIST  (per-user)
// ============================================================
export const wishlist = {
  _key(userId) { return `gc_wish_${userId}`; },

  get(userId) { return JSON.parse(localStorage.getItem(this._key(userId)) || '[]'); },

  toggle(userId, product) {
    const pid   = product.id || product.product_id;
    const items = this.get(userId);
    const idx   = items.findIndex(i => (i.product_id || i.id) === pid);
    let action;
    if (idx > -1) { items.splice(idx, 1); action = 'removed'; }
    else          { items.push({ ...product, product_id: pid }); action = 'added'; }
    localStorage.setItem(this._key(userId), JSON.stringify(items));
    return { action, items };
  },

  isIn(userId, pid) {
    return this.get(userId).some(i => (i.product_id || i.id) === pid);
  },
};

// ============================================================
//  ORDERS
// ============================================================
export const orders = {
  getAll()          { return get(KEYS.ORDERS) || []; },
  getByUser(userId) { return this.getAll().filter(o => o.user_id === userId); },

  place(userId, userName, cartItems, address = '', notes = '') {
    if (!cartItems.length) throw new Error('Your cart is empty.');
    if (!address || !address.trim()) throw new Error('Please enter your delivery address.');
    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const order = {
      id: Date.now(),
      user_id:    userId,
      user_name:  userName,
      user_email: auth.getSession()?.email || '',
      address:    address.trim(),
      notes:      notes?.trim() || '',
      total:      total.toFixed(2),
      status:     'pending',
      created_at: new Date().toISOString(),
      items: cartItems.map(i => ({
        id: uid(),
        product_id:     i.product_id || i.id,
        product_name:   i.name,
        qty:            i.qty,
        price_at_time:  i.price,
      })),
    };
    const all = [...this.getAll(), order];
    set(KEYS.ORDERS, all);
    return order;
  },

  updateStatus(orderId, status) {
    const all = this.getAll().map(o => o.id === orderId ? { ...o, status } : o);
    set(KEYS.ORDERS, all);
    return all.find(o => o.id === orderId);
  },
};
