import React, { useState, useEffect } from 'react';
import { products as productSvc } from '../services/storage.js';
import ProductCard from '../components/ProductCard.jsx';

const TABS = ['All Baked Goods', 'Cookies', 'Brownies'];

export default function Cookies() {
  const [all, setAll]           = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [active, setActive]     = useState('All Baked Goods');

  useEffect(() => {
    const baked = productSvc.getAll(true).filter(p => p.category === 'cookies' || p.category === 'brownies');
    setAll(baked);
    setFiltered(baked);
  }, []);

  const filter = (tab) => {
    setActive(tab);
    setFiltered(tab === 'All Baked Goods' ? all : all.filter(p => p.category === tab.toLowerCase()));
  };

  return (
    <div>
      <div className="bg-espresso-800 py-16 text-center">
        <p className="section-label text-gold-400 mb-2">Handcrafted daily</p>
        <h1 className="font-serif text-5xl text-cream-50 mb-4">Our Cookie Collection</h1>
        <p className="text-cream-300 font-sans max-w-xl mx-auto">
          Every cookie cold-aged 24 hours. Every batch baked the morning it ships.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-2 mb-10 justify-center">
          {TABS.map(t => (
            <button key={t} onClick={() => filter(t)}
              className={`px-6 py-2 font-sans text-sm tracking-wider uppercase transition-colors border ${
                active === t ? 'bg-espresso-800 text-cream-50 border-espresso-800' : 'border-cream-300 text-espresso-700 hover:border-espresso-400'
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
