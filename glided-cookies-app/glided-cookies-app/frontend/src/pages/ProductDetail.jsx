import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, ArrowLeft, CheckCircle,
  Package, Truck, RefreshCw, Shield, Plus, Minus
} from 'lucide-react';
import { products as productSvc } from '../services/storage.js';
import { useStore } from '../context/StoreContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [product, setProduct]   = useState(null);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);
  const [related, setRelated]   = useState([]);

  useEffect(() => {
    const p = productSvc.getById(id);
    if (!p) { navigate('/shop'); return; }
    setProduct(p);
    // related = same category, different product
    const all = productSvc.getAll(true);
    setRelated(all.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cream-200 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const PERKS = [
    { icon: Truck,      text: 'Free shipping over ₹999' },
    { icon: Package,    text: 'Freshly baked to order' },
    { icon: RefreshCw,  text: 'Easy 7-day returns' },
    { icon: Shield,     text: 'Secure checkout' },
  ];

  const CATEGORY_LABEL = {
    cookies:  '🍪 Cookies',
    brownies: '🍫 Brownies',
    gift:     '🎁 Gift Boxes',
    seasonal: '🍂 Seasonal',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-cream-500 mb-8">
        <Link to="/" className="hover:text-espresso-700 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-espresso-700 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-espresso-700 font-medium">{product.name}</span>
      </nav>

      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-sans text-cream-500 hover:text-espresso-700 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">

        {/* ── Left: Image ── */}
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-cream-100 aspect-square">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=90'; }}
            />
            {/* Badges */}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-espresso-700 text-cream-50 text-xs font-sans font-semibold tracking-widest uppercase px-3 py-1.5 shadow-md">
                {product.badge}
              </span>
            )}
            {product.original_price && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-xs font-sans font-bold px-3 py-1.5 shadow-md">
                SALE
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="flex flex-col">

          {/* Category pill */}
          <span className="inline-block self-start px-3 py-1 bg-cream-100 text-cream-600 text-xs font-sans font-semibold tracking-widest uppercase mb-4">
            {CATEGORY_LABEL[product.category] || product.category}
          </span>

          {/* Name */}
          <h1 className="font-serif text-4xl lg:text-5xl text-espresso-800 leading-tight mb-3">
            {product.name}
          </h1>

          {/* Subtitle */}
          {product.subtitle && (
            <p className="text-cream-500 font-sans text-base mb-5 italic">{product.subtitle}</p>
          )}

          {/* Stars */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <span className="text-cream-500 text-sm font-sans">(4.9 · 128 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-4 mb-8 pb-8 border-b border-cream-200">
            <span className="font-serif text-4xl text-espresso-800">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <div className="flex flex-col">
                <span className="text-cream-400 text-lg font-sans line-through">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
                <span className="text-gold-600 text-xs font-sans font-bold">
                  Save ₹{(Number(product.original_price) - Number(product.price)).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-espresso-600 font-sans text-base leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Details list */}
          {product.details?.length > 0 && (
            <ul className="space-y-2 mb-8">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-center gap-2 font-sans text-sm text-espresso-700">
                  <CheckCircle className="w-4 h-4 text-gold-500 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          )}

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-4 mb-4">
            {/* Qty stepper */}
            <div className="flex items-center border-2 border-cream-200">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-3 hover:bg-cream-100 transition-colors text-espresso-700">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 py-3 font-sans font-semibold text-espresso-800 min-w-[3rem] text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="px-4 py-3 hover:bg-cream-100 transition-colors text-espresso-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-sans font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-gradient-to-r from-espresso-700 to-espresso-800 hover:from-espresso-600 hover:to-espresso-700 text-cream-50'
              }`}>
              {added ? (
                <><CheckCircle className="w-5 h-5" /> Added to Cart!</>
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-4 border-2 transition-all duration-300 active:scale-95 ${
                inWishlist
                  ? 'border-red-400 bg-red-50 text-red-500'
                  : 'border-cream-200 text-espresso-500 hover:border-red-300 hover:text-red-400'
              }`}
              aria-label="Toggle wishlist">
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3 mt-6 p-5 bg-cream-50 border border-cream-200">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="font-sans text-xs text-espresso-600">{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-cream-200 pt-14">
          <p className="section-label mb-2">You might also like</p>
          <h2 className="font-serif text-3xl text-espresso-800 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`}
                className="group bg-white border border-cream-200 hover:border-gold-400 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
                <div className="aspect-square overflow-hidden bg-cream-100">
                  <img src={p.image_url} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=90'; }} />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-serif text-lg text-espresso-800 mb-1">{p.name}</h3>
                  <p className="text-cream-500 text-sm font-sans mb-3 flex-1">{p.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl text-espresso-800">₹{Number(p.price).toLocaleString('en-IN')}</span>
                    <span className="text-gold-600 text-xs font-sans uppercase tracking-wider font-semibold">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
