import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Cookie, LayoutDashboard, Package, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { to: '/admin',          label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products',   icon: Package },
  { to: '/admin/orders',   label: 'Orders',     icon: ShoppingBag },
];

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-espresso-900 text-cream-200 flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-espresso-700">
          <div className="flex items-center gap-2 mb-1">
            <Cookie className="w-5 h-5 text-gold-400" />
            <span className="font-serif text-lg text-cream-100">Admin</span>
          </div>
          <p className="text-cream-500 text-xs font-sans truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 py-4 px-2">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-sans transition-colors mb-1 ${
                  isActive ? 'bg-gold-500/20 text-gold-300' : 'text-cream-400 hover:bg-espresso-700 hover:text-cream-100'
                }`}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-4 border-t border-espresso-700">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-cream-400 hover:text-cream-100 text-sm font-sans transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" /> View Store
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 text-sm font-sans w-full transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-cream-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
