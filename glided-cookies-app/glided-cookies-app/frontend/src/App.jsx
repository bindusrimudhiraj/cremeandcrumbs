import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Notification from './components/Notification.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Lazy-load pages
const Home          = lazy(() => import('./pages/Home.jsx'));
const Shop          = lazy(() => import('./pages/Shop.jsx'));
const Cookies       = lazy(() => import('./pages/Cookies.jsx'));
const About         = lazy(() => import('./pages/About.jsx'));
const Contact       = lazy(() => import('./pages/Contact.jsx'));
const Cart          = lazy(() => import('./pages/Cart.jsx'));
const Wishlist      = lazy(() => import('./pages/Wishlist.jsx'));
const Login         = lazy(() => import('./pages/Login.jsx'));
const Register      = lazy(() => import('./pages/Register.jsx'));
const Account       = lazy(() => import('./pages/Account.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'));
const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminDash     = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProd     = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminOrders   = lazy(() => import('./pages/admin/AdminOrders.jsx'));

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-cream-200 border-t-gold-500 rounded-full animate-spin" />
      <p className="text-cream-500 text-sm font-sans">Loading…</p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner />
    </div>
  );
}

// Customer-only protected route → redirects to /login
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  return isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

// Admin-only route → redirects to /admin/login (NOT the customer login)
function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!isLoggedIn || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

// ── Admin App (no public Navbar/Footer) ─────────────────────
function AdminApp() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-espresso-900"><Spinner /></div>}>
      <Routes>
        {/* Admin login — public within admin domain */}
        <Route path="/login"    element={<AdminLogin />} />
        {/* Protected admin pages */}
        <Route path="/"         element={<AdminRoute><AdminDash /></AdminRoute>} />
        <Route path="/products" element={<AdminRoute><AdminProd /></AdminRoute>} />
        <Route path="/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="*"         element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}

// ── Store App (with Navbar + Footer) ────────────────────────
function StoreApp() {
  return (
    <>
      <Navbar />
      <main className="pt-[88px]">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/shop"        element={<Shop />} />
            <Route path="/cookies"     element={<Cookies />} />
            <Route path="/about"       element={<About />} />
            <Route path="/contact"     element={<Contact />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/wishlist"    element={<Wishlist />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/account"     element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Notification />
    </>
  );
}

// ── Root router ─────────────────────────────────────────────
export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <>
        <Notification />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </>
    );
  }

  return <StoreApp />;
}
