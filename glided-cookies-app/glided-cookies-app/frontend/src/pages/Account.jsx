import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LayoutDashboard, LogOut, Calendar, Tag, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { orders as orderSvc } from '../services/storage.js';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};

export default function Account() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (user) setMyOrders(orderSvc.getByUser(user.id));
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Profile card */}
      <div className="bg-white border border-cream-200 p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gold-500/10 flex items-center justify-center rounded-full">
            <User className="w-8 h-8 text-gold-600" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-espresso-800">{user?.name}</h1>
            <p className="text-cream-500 font-sans text-sm mt-0.5">{user?.email}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-sans font-medium tracking-wide uppercase ${
              user?.role === 'admin' ? 'bg-gold-500/20 text-gold-700' : 'bg-cream-200 text-cream-700'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {isAdmin && (
            <Link to="/admin" className="btn-gold flex items-center gap-2 text-sm py-2 px-5">
              <LayoutDashboard className="w-4 h-4" /> Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className="btn-outline flex items-center gap-2 text-sm py-2 px-5 border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-5 h-5 text-gold-600" />
          <h2 className="font-serif text-2xl text-espresso-800">My Orders</h2>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-cream-50 border border-cream-200 p-12 text-center">
            <Package className="w-12 h-12 text-cream-300 mx-auto mb-4" />
            <p className="font-serif text-xl text-espresso-700 mb-2">No orders yet</p>
            <p className="text-cream-500 font-sans text-sm mb-6">Your baked goods are waiting.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {[...myOrders].reverse().map(order => (
              <div key={order.id} className="bg-white border border-cream-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-cream-50 border-b border-cream-200">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-sans text-sm font-medium text-espresso-700">Order #{order.id}</span>
                    <span className="flex items-center gap-1 text-cream-500 text-xs font-sans">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-sans font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                    <span className="font-serif text-lg text-espresso-800">₹{Number(order.total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-cream-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-cream-400" />
                        <span className="font-sans text-sm text-espresso-700">{item.product_name}</span>
                        <span className="text-cream-400 text-xs">×{item.qty}</span>
                      </div>
                      <span className="font-sans text-sm text-espresso-700">₹{(Number(item.price_at_time) * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {order.address && (
                    <div className="mt-3 pt-3 border-t border-cream-100 flex items-start gap-2 text-xs font-sans text-espresso-700">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-espresso-800">Delivering to: </span>
                        <span>{order.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
