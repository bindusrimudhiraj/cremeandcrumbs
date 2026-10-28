import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AdminLayout from './AdminLayout.jsx';
import { orders as orderSvc } from '../../services/storage.js';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-800 border-yellow-300',
  processing: 'bg-blue-100 text-blue-800 border-blue-300',
  shipped:    'bg-indigo-100 text-indigo-800 border-indigo-300',
  delivered:  'bg-green-100 text-green-800 border-green-300',
  cancelled:  'bg-red-100 text-red-800 border-red-300',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => setOrders([...orderSvc.getAll()].reverse());

  useEffect(() => { load(); }, []);

  const updateStatus = (orderId, status) => {
    orderSvc.updateStatus(orderId, status);
    load();
  };

  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-espresso-800">Orders</h1>
            <p className="text-cream-500 font-sans text-sm mt-1">{orders.length} total orders</p>
          </div>
          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            {['all', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider border transition-colors ${
                  filter === s ? 'bg-espresso-800 text-cream-50 border-espresso-800' : 'border-cream-300 text-cream-600 hover:border-espresso-400'
                }`}>
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-cream-200 overflow-x-auto">
          {displayed.length === 0 ? (
            <div className="p-16 text-center text-cream-400 font-sans">No orders found.</div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  {['#', 'Customer', 'Items', 'Total', 'Status', 'Change Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-sans font-medium uppercase tracking-widest text-cream-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {displayed.map(order => (
                  <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-4 font-sans text-sm text-espresso-700 font-medium">#{order.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-sans text-sm text-espresso-800 font-medium">{order.user_name}</p>
                      <p className="font-sans text-xs text-cream-400">{order.user_email}</p>
                      {order.address && (
                        <p className="font-sans text-[11px] text-espresso-600 mt-1 max-w-[220px] leading-tight" title={order.address}>
                          📍 {order.address}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        {order.items?.slice(0, 3).map(item => (
                          <p key={item.id} className="font-sans text-xs text-cream-600">
                            {item.product_name} ×{item.qty}
                          </p>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="font-sans text-xs text-cream-400">+{order.items.length - 3} more</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-serif text-lg text-espresso-800">₹{Number(order.total).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-sans capitalize border ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <select value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="appearance-none pl-3 pr-7 py-1.5 border border-cream-200 bg-white text-espresso-700 text-xs font-sans focus:outline-none focus:border-cream-500 transition-colors cursor-pointer">
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-cream-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-4 font-sans text-xs text-cream-400 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
