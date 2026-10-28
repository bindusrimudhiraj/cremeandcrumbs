import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const pid = product.product_id || product.id;
  const inWishlist = isInWishlist(pid);

  return (
    <div className="group bg-white flex flex-col border border-cream-100 hover:border-gold-400 hover:shadow-xl transition-all duration-300">

      {/* Clickable Image */}
      <Link to={`/product/${pid}`} className="relative overflow-hidden aspect-square bg-cream-100 block">
        <img src={product.image_url} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=90'; }}
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-espresso-700 text-cream-50 text-[10px] font-sans font-semibold tracking-wider uppercase px-2.5 py-1 shadow">
            {product.badge}
          </span>
        )}
        {product.original_price && (
          <span className="absolute top-3 right-12 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-[10px] font-sans font-bold px-2 py-1 shadow">SALE</span>
        )}
        {/* Wishlist heart */}
        <button onClick={e => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
          aria-label="Toggle wishlist">
          <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-espresso-700'}`} />
        </button>

        {/* "View Details" overlay */}
        <div className="absolute inset-0 bg-espresso-900/0 group-hover:bg-espresso-900/20 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-espresso-800 font-sans text-xs font-bold tracking-widest uppercase px-4 py-2 shadow-lg">
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${pid}`}>
          <h3 className="font-serif text-lg text-espresso-800 leading-tight mb-1 hover:text-gold-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-cream-500 text-sm font-sans mb-3 flex-1">{product.subtitle}</p>
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-espresso-800">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {product.original_price && (
              <span className="text-cream-400 text-sm font-sans line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
            )}
          </div>
          <button onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-4 py-2 bg-espresso-700 hover:bg-gold-600 text-cream-50 text-xs font-sans font-semibold tracking-wider uppercase transition-colors active:scale-95">
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
