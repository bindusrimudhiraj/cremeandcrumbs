import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, Cookie, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { cartCount, wishlist } = useStore();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserDropdown(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/cookies', label: 'Cookies' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Announcement bar */}
      <div className="bg-espresso-800 text-cream-100 text-center text-xs tracking-widest py-2 font-sans">
        Autumn Praline Box — 15% off your first order.{' '}
        <Link to="/shop" className="underline hover:text-gold-300 transition-colors ml-1">Claim offer →</Link>
      </div>

      <nav className={`bg-cream-50/98 backdrop-blur-sm ${scrolled ? '' : 'border-b border-cream-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Cookie className="w-6 h-6 text-gold-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-serif text-xl text-espresso-800 tracking-wide">Crème &amp; Crumbs</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `font-sans text-sm tracking-wide transition-colors duration-200 ${isActive ? 'text-gold-600 font-medium' : 'text-espresso-700 hover:text-espresso-900'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-espresso-700 hover:text-espresso-900 transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-espresso-700 hover:text-espresso-900 transition-colors" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-espresso-800 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            {/* User */}
            <div className="relative hidden md:block">
              <button onClick={() => setUserDropdown(v => !v)} className="p-2 text-espresso-700 hover:text-espresso-900 transition-colors flex items-center gap-1">
                <User className="w-5 h-5" />
                {isLoggedIn && <span className="text-xs font-sans text-espresso-600 max-w-[80px] truncate">{user?.name}</span>}
              </button>
              {userDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg border border-cream-200 py-1 z-50">
                  {isLoggedIn ? (
                    <>
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2.5 text-sm text-espresso-700 hover:bg-cream-50"><User className="w-4 h-4" /> My Account</Link>
                      {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-600 hover:bg-cream-50 font-medium"><LayoutDashboard className="w-4 h-4" /> Admin Panel</Link>}
                      <hr className="border-cream-200 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-cream-50"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2.5 text-sm text-espresso-700 hover:bg-cream-50">Sign In</Link>
                      <Link to="/register" className="block px-4 py-2.5 text-sm text-espresso-700 hover:bg-cream-50">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Mobile toggle */}
            <button className="md:hidden p-2 text-espresso-700" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-6 py-4 shadow-lg">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) =>
                `block py-3 font-sans text-sm border-b border-cream-100 last:border-0 ${isActive ? 'text-gold-600 font-medium' : 'text-espresso-700'}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/account" className="flex items-center gap-2 py-2 text-sm text-espresso-700"><User className="w-4 h-4" /> My Account</Link>
                {isAdmin && <Link to="/admin" className="flex items-center gap-2 py-2 text-sm text-gold-600 font-medium"><LayoutDashboard className="w-4 h-4" /> Admin Panel</Link>}
                <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-sm text-red-600"><LogOut className="w-4 h-4" /> Sign Out</button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-primary py-2 px-5 text-xs">Sign In</Link>
                <Link to="/register" className="btn-outline py-2 px-5 text-xs">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
