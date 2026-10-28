import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookie, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { login, logout, isAdmin, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  // Already logged in as admin → go to dashboard
  if (isLoggedIn && isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        logout(); // clear the non-admin session
        throw new Error('Access denied. This portal is for admins only.');
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-espresso-900">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23E8821A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }}>
        </div>

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gold-500/20 flex items-center justify-center rounded-full border border-gold-500/30">
              <Cookie className="w-8 h-8 text-gold-400" />
            </div>
          </div>
          <h1 className="font-serif text-5xl text-cream-50 mb-4 leading-tight">
            Crème &amp; Crumbs
          </h1>
          <p className="text-cream-400 font-sans text-lg mb-12">Admin Control Panel</p>

          <div className="space-y-4 text-left">
            {[
              'Manage products & inventory',
              'Track and update orders',
              'View sales & revenue',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gold-500/20 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-gold-400 rounded-full" />
                </div>
                <span className="text-cream-400 font-sans text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-espresso-800">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-10">
            <Cookie className="w-7 h-7 text-gold-400" />
            <span className="font-serif text-2xl text-cream-100">Crème &amp; Crumbs</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-sans text-xs tracking-[0.3em] uppercase font-bold">Secure Access</span>
            </div>
            <h2 className="font-serif text-4xl text-cream-50 mb-2">Admin Login</h2>
            <p className="text-cream-500 font-sans text-sm">
              Restricted to authorized administrators only.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-900/40 border border-red-700/50 text-red-300 text-sm font-sans px-4 py-3 mb-6 rounded-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-cream-500 mb-2 font-semibold">
                Admin Email
              </label>
              <input
                required
                type="email"
                placeholder="admin@cremencrumbs.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3.5 bg-espresso-900 border-2 border-espresso-600 text-cream-100 font-sans text-sm placeholder-espresso-400 focus:outline-none focus:border-gold-500 transition-colors rounded-sm"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-widest text-cream-500 mb-2 font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3.5 pr-12 bg-espresso-900 border-2 border-espresso-600 text-cream-100 font-sans text-sm placeholder-espresso-400 focus:outline-none focus:border-gold-500 transition-colors rounded-sm"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-cream-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-sans font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60 mt-2 rounded-sm">
              {loading ? 'Authenticating…' : 'Sign In to Admin'}
            </button>
          </form>

          {/* Back to store */}
          <div className="mt-8 pt-6 border-t border-espresso-600 text-center">
            <a href="/" className="text-cream-500 hover:text-cream-300 font-sans text-sm transition-colors">
              ← Back to Store
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
