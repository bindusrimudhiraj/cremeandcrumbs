import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-espresso-800 text-cream-200">
      {/* Newsletter */}
      <div className="border-b border-espresso-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl text-cream-100 mb-1">Join the inner circle.</p>
            <p className="text-cream-400 text-sm font-sans">Weekly batch announcements, seasonal offers, and early access.</p>
          </div>
          <form className="flex w-full md:w-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="your@email.com"
              className="px-5 py-3 bg-espresso-700 text-cream-100 placeholder-cream-500 text-sm font-sans flex-1 md:w-72 outline-none focus:bg-espresso-600 transition-colors" />
            <button type="submit" className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-espresso-900 text-sm font-sans font-semibold tracking-wider uppercase transition-colors">
              Subscribe
            </button>
          </form>
        </div>
        <p className="text-cream-500 text-xs text-center pb-4 font-sans">By subscribing you agree to our privacy policy.</p>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Cookie className="w-5 h-5 text-gold-400" />
            <span className="font-serif text-lg text-cream-100">Crème &amp; Crumbs</span>
          </Link>
          <p className="text-cream-400 text-sm font-sans leading-relaxed mb-5">
            Bringing the warmth of artisan baking to your doorstep, one hand-tied box at a time.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="text-cream-400 hover:text-gold-400 transition-colors"><Icon className="w-4 h-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-xs tracking-widest uppercase text-gold-400 mb-4">Shop</p>
          <ul className="space-y-2">
            {[['Our Menu','/shop'],['Gift Sets','/shop'],['Seasonal','/shop'],['Wholesale','/contact']].map(([l,p]) => (
              <li key={l}><Link to={p} className="text-cream-400 hover:text-cream-100 text-sm font-sans transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs tracking-widest uppercase text-gold-400 mb-4">Company</p>
          <ul className="space-y-2">
            {[['Our Story','/about'],['Contact','/contact'],['Rewards','/shop'],['Bakery Visits','/contact']].map(([l,p]) => (
              <li key={l}><Link to={p} className="text-cream-400 hover:text-cream-100 text-sm font-sans transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-xs tracking-widest uppercase text-gold-400 mb-4">Legal</p>
          <ul className="space-y-2">
            {['Privacy','Terms','Shipping','Allergens'].map(l => (
              <li key={l}><Link to="/" className="text-cream-400 hover:text-cream-100 text-sm font-sans transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-espresso-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-cream-500 text-xs font-sans">© 2024 Crème &amp; Crumbs. All rights reserved.</p>
        <p className="text-cream-500 text-xs font-sans">212 Wythe Ave, Brooklyn NY 11249</p>
      </div>
    </footer>
  );
}
