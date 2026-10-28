import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Wishlist() {
  const { wishlist, addToCart, clearCart } = useStore();

  const addAll = () => wishlist.forEach(p => addToCart(p));

  if (wishlist.length === 0) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <Heart className="w-16 h-16 text-cream-300 mx-auto mb-4" />
        <h2 className="font-serif text-3xl text-espresso-800 mb-3">Your wishlist is empty</h2>
        <p className="text-cream-500 font-sans mb-8">Save items you love for later.</p>
        <Link to="/shop" className="btn-primary">Browse the Shop <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-espresso-800">My Wishlist</h1>
          <p className="text-cream-500 font-sans mt-1">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button onClick={addAll} className="btn-gold flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> Move all to cart
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map(p => <ProductCard key={p.product_id || p.id} product={p} />)}
      </div>
    </div>
  );
}
