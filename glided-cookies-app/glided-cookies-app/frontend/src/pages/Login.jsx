import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cookie, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  if (isLoggedIn) { navigate(from, { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cream-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Cookie className="w-7 h-7 text-gold-500" />
            <span className="font-serif text-2xl text-espresso-800">Crème &amp; Crumbs</span>
          </Link>
          <h1 className="font-serif text-3xl text-espresso-800 mb-2">Welcome back</h1>
          <p className="text-cream-500 font-sans text-sm">Sign in to your account</p>
        </div>

        <div className="bg-white border border-cream-200 p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-xs">Email</label>
              <input required type="email" className="input-field" placeholder="your@email.com"
                value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
            </div>
            <div>
              <label className="label-xs">Password</label>
              <div className="relative">
                <input required type={showPw ? 'text' : 'password'} className="input-field pr-12"
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({...p, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-espresso-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-cream-200 pt-6">
            <p className="font-sans text-sm text-cream-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-600 hover:text-gold-700 font-medium transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
