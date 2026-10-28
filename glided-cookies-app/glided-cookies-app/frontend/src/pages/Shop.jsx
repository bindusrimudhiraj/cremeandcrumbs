import React, { useState, useEffect } from 'react';
import { products as productSvc } from '../services/storage.js';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = ['All', 'Cookies', 'Brownies', 'Gift', 'Seasonal'];

const CAT_META = {
  All:      { emoji: '🍪', desc: 'Every batch baked the morning it ships.' },
  Cookies:  { emoji: '🍪', desc: 'Brown butter, sea salt, and slow-fermented doughs.' },
  Brownies: { emoji: '🍫', desc: 'Fudgy, glossy, single-origin cacao goodness.' },
  Gift:     { emoji: '🎁', desc: 'Curated boxes with silk ribbons and handwritten notes.' },
  Seasonal: { emoji: '🍂', desc: 'Limited edition flavors available only this season.' },
};

export default function Shop() {
  const [all, setAll]           = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [active, setActive]     = useState('All');

  useEffect(() => {
    const list = productSvc.getAll(true);
    setAll(list);
    setFiltered(list);
  }, []);

  const filter = (cat) => {
    setActive(cat);
    setFiltered(cat === 'All' ? all : all.filter(p => p.category === cat.toLowerCase()));
  };

  const meta = CAT_META[active];

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-espresso-800 py-20 text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=1400&q=85"
          alt="Shop"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <p className="section-label text-gold-400 mb-3">Small-batch · Baked daily</p>
          <h1 className="font-serif text-5xl sm:text-6xl text-cream-50 mb-4">Shop the Collection</h1>
          <p className="text-cream-300 font-sans max-w-xl mx-auto text-base">
            Every batch is baked the morning it ships. Choose by category, or curate your own selection below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => filter(cat)}
              className={`px-6 py-2.5 font-sans text-sm font-semibold tracking-widest uppercase transition-all duration-200 border-2 ${
                active === cat
                  ? 'bg-espresso-800 text-cream-50 border-espresso-800 shadow-md'
                  : 'border-cream-300 text-espresso-700 hover:border-gold-500 hover:text-gold-600'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Active category description */}
        <div className="text-center mb-10">
          <p className="text-2xl mb-1">{meta.emoji}</p>
          <p className="text-cream-500 font-sans text-sm italic">{meta.desc}</p>
          <p className="text-espresso-600 font-sans text-xs mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-cream-400 font-sans">
            <p className="text-5xl mb-4">🍪</p>
            <p className="text-lg font-serif text-espresso-700">No products in this category yet.</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
