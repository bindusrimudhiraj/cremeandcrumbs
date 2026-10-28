import React, { useEffect, useState } from 'react';
import { Package, ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react';
import AdminLayout from './AdminLayout.jsx';
import { products as productSvc, orders as orderSvc } from '../../services/storage.js';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders,   setAllOrders]   = useState([]);

  useEffect(() => {
    setAllProducts(productSvc.getAll(false));
    setAllOrders(orderSvc.getAll());
  }, []);

  const revenue = allOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0);

  const stats = [
    { label: 'Total Products',  value: allProducts.length,                     icon: Package,    color: 'text-blue-600',      bg: 'bg-blue-50' },
    { label: 'Active Products', value: allProducts.filter(p => p.active).length, icon: TrendingUp, color: 'text-green-600',     bg: 'bg-green-50' },
    { label: 'Total Orders',    value: allOrders.length,                        icon: ShoppingBag, color: 'text-gold-600',      bg: 'bg-gold-500/10' },
    { label: 'Revenue',         value: `₹${revenue.toLocaleString('en-IN')}`,    icon: DollarSign, color: 'text-espresso-600',  bg: 'bg-cream-200' },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-serif text-3xl text-espresso-800 mb-2">Dashboard</h1>
        <p className="text-cream-500 font-sans text-sm mb-8">Welcome back. Here's what's happening.</p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-white border border-cream-200 p-5">
              <div className={`w-10 h-10 ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="font-sans text-xs uppercase tracking-widest text-cream-500 mb-1">{s.label}</p>
              <p className="font-serif text-3xl text-espresso-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-cream-200">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-cream-200">
            <Clock className="w-4 h-4 text-gold-500" />
            <h2 className="font-serif text-xl text-espresso-800">Recent Orders</h2>
          </div>
          {allOrders.length === 0 ? (
            <p className="p-8 text-cream-400 text-center font-sans">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 border-b border-cream-200">
                  <tr>
                    {['#', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-sans font-medium uppercase tracking-widest text-cream-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {[...allOrders].reverse().slice(0, 8).map(o => (
                    <tr key={o.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-sans text-sm text-espresso-700">#{o.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-sans text-sm text-espresso-700">{o.user_name}</p>
                        <p className="font-sans text-xs text-cream-400">{o.user_email}</p>
                      </td>
                      <td className="px-6 py-4 font-sans text-sm text-cream-600">{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                      <td className="px-6 py-4 font-serif text-espresso-800">₹{Number(o.total).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-sans capitalize rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-sans text-xs text-cream-400">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
