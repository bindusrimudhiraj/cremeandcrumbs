import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Package, MapPin, Phone, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { orders as orderSvc } from '../services/storage.js';

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal } = useStore();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [ordering, setOrdering]       = useState(false);
  const [success, setSuccess]         = useState(false);
  const [orderId, setOrderId]         = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError]             = useState('');

  // Delivery address form state
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    notes: '',
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const total    = cartTotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (!addressData.street.trim() || !addressData.city.trim() || !addressData.pincode.trim()) {
      setError('Please provide your complete delivery address (Street / Flat, City, and PIN code).');
      return;
    }

    const formattedAddress = [
      addressData.street.trim(),
      addressData.city.trim(),
      addressData.state.trim(),
      addressData.pincode.trim(),
      addressData.phone.trim() ? `Phone: ${addressData.phone.trim()}` : '',
    ].filter(Boolean).join(', ');

    setOrdering(true);
    setError('');
    try {
      const order = orderSvc.place(user.id, user.name, cart, formattedAddress, addressData.notes);
      clearCart();
      setOrderId(order.id);
      setConfirmedOrder(order);
      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Could not place order. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (success) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-lg bg-white p-8 border border-cream-200 shadow-sm">
        <div className="w-20 h-20 bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gold-600" />
        </div>
        <h2 className="font-serif text-3xl text-espresso-800 mb-2">Order Confirmed!</h2>
        <p className="text-cream-600 font-sans mb-1">Thank you for your order, <span className="font-semibold text-espresso-800">{user?.name}</span>.</p>
        <p className="text-gold-600 font-sans font-medium text-sm mb-6">Order #{orderId}</p>

        {confirmedOrder?.address && (
          <div className="bg-cream-50 p-4 border border-cream-200 text-left mb-6">
            <p className="text-xs uppercase tracking-wider font-semibold text-espresso-700 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-600" /> Shipping Destination:
            </p>
            <p className="text-sm font-sans text-espresso-800 leading-relaxed">{confirmedOrder.address}</p>
            {confirmedOrder.notes && (
              <p className="text-xs font-sans text-cream-500 mt-2 border-t border-cream-200 pt-1.5">
                <strong>Delivery Note:</strong> {confirmedOrder.notes}
              </p>
            )}
          </div>
        )}

        <p className="text-cream-500 font-sans text-sm mb-8">
          We bake every box fresh to order. You can track your order status anytime in your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          <Link to="/account" className="btn-outline">View My Orders</Link>
        </div>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <ShoppingCart className="w-16 h-16 text-cream-300 mx-auto mb-4" />
        <h2 className="font-serif text-3xl text-espresso-800 mb-3">Your cart is empty</h2>
        <p className="text-cream-500 font-sans mb-8">Add some artisan cookies to get started.</p>
        <Link to="/shop" className="btn-primary">Start Shopping <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-espresso-800 mb-10">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column: Cart Items + Delivery Address Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="divide-y divide-cream-200 border border-cream-200 bg-white">
            <div className="p-4 bg-cream-50 border-b border-cream-200 font-sans text-xs uppercase tracking-wider font-semibold text-espresso-700">
              Basket Items ({cart.length})
            </div>
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 p-5 bg-white">
                <img src={item.image_url} alt={item.name}
                  className="w-20 h-20 object-cover shrink-0 bg-cream-100"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200'; }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-lg text-espresso-800 leading-tight">{item.name}</h3>
                  <p className="text-cream-500 text-sm font-sans mb-3">{item.subtitle}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-cream-200">
                      <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="p-2 hover:bg-cream-50 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="px-4 font-sans text-sm font-medium">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="p-2 hover:bg-cream-50 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-cream-400 hover:text-red-500 transition-colors p-1" title="Remove item">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-xl text-espresso-800">₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}</p>
                  <p className="text-cream-400 text-xs font-sans">₹{Number(item.price).toLocaleString('en-IN')} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white p-6 border border-cream-200">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-cream-100">
              <MapPin className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-2xl text-espresso-800">Delivery Address</h2>
            </div>

            {!isLoggedIn && (
              <div className="mb-6 p-4 bg-cream-50 border border-cream-200 text-xs font-sans text-espresso-700 flex items-center justify-between">
                <span>Please sign in or create an account to place your order with ease.</span>
                <Link to="/login" state={{ from: { pathname: '/cart' } }} className="text-gold-600 font-semibold underline hover:text-gold-700 ml-2">
                  Sign In →
                </Link>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-1 font-medium">
                  Flat / House No. / Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="e.g. Flat 4B, Hilltop Apartments, 12th Main Road"
                  value={addressData.street}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-1 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai"
                    value={addressData.city}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-1 font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. Maharashtra"
                    value={addressData.state}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-1 font-medium">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="e.g. 400001"
                    value={addressData.pincode}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-1 font-medium">
                    Contact Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cream-400" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={addressData.phone}
                      onChange={handleInputChange}
                      className="input-field pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-1 font-medium">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Ring the bell, leave at front door"
                    value={addressData.notes}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-cream-100 p-6 border border-cream-200 sticky top-24">
            <h2 className="font-serif text-xl text-espresso-800 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-sans text-sm text-espresso-700">
                <span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-sans text-sm text-espresso-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-gold-600 font-medium">Free</span> : `₹${shipping}`}</span>
              </div>
              {cartTotal > 0 && cartTotal < 999 && (
                <p className="text-cream-500 text-xs font-sans">Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping</p>
              )}
              <div className="border-t border-cream-200 pt-3 flex justify-between font-serif text-xl text-espresso-800">
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mb-4 text-xs font-sans text-cream-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Ships same day if ordered before 2 PM.</span>
            </div>

            {error && <p className="text-red-600 text-sm font-sans mb-4 bg-red-50 p-3 border border-red-200">{error}</p>}

            <button
              onClick={placeOrder}
              disabled={ordering}
              className="btn-gold w-full justify-center disabled:opacity-60 mb-3"
            >
              {ordering ? 'Placing Order…' : !isLoggedIn ? 'Sign In to Place Order' : 'Place Order'}
            </button>
            <Link to="/shop" className="btn-ghost w-full justify-center text-xs">← Continue Shopping</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
