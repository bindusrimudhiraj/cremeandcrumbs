import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cart as cartSvc, wishlist as wishlistSvc } from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  const userId = user?.id || 'guest';

  const [cart, setCart]         = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNote] = useState(null);

  // Load cart & wishlist when user changes
  useEffect(() => {
    setCart(cartSvc.get(userId));
    setWishlist(wishlistSvc.get(userId));
  }, [userId]);

  const notify = useCallback((message, type = 'success') => {
    setNote({ message, type });
    setTimeout(() => setNote(null), 3000);
  }, []);

  // ── Cart ────────────────────────────────────────────────
  const addToCart = useCallback((product, qty = 1) => {
    const updated = cartSvc.add(userId, product, qty);
    setCart(updated);
    notify(`${product.name} added to cart`);
  }, [userId, notify]);

  const removeFromCart = useCallback((itemId) => {
    const updated = cartSvc.remove(userId, itemId);
    setCart(updated);
  }, [userId]);

  const updateCartQty = useCallback((itemId, qty) => {
    const updated = cartSvc.updateQty(userId, itemId, qty);
    setCart(updated);
  }, [userId]);

  const clearCart = useCallback(() => {
    cartSvc.clear(userId);
    setCart([]);
  }, [userId]);

  // ── Wishlist ─────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    const { action, items } = wishlistSvc.toggle(userId, product);
    setWishlist(items);
    notify(`${product.name} ${action === 'added' ? 'added to' : 'removed from'} wishlist`);
  }, [userId, notify]);

  const isInWishlist = useCallback((pid) =>
    wishlist.some(i => (i.product_id || i.id) === pid), [wishlist]);

  const cartTotal = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isInWishlist, notification,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};
