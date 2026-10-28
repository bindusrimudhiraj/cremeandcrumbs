import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check } from 'lucide-react';
import AdminLayout from './AdminLayout.jsx';
import { products as productSvc } from '../../services/storage.js';

const CATEGORIES = ['cookies', 'brownies', 'gift', 'seasonal'];
const EMPTY = {
  name: '', category: 'cookies', subtitle: '', price: '',
  original_price: '', badge: '', description: '',
  details: '', image_url: '', active: true,
};

export default function AdminProducts() {
  const [list, setList]       = useState([]);
  const [modal, setModal]     = useState(false);   // 'add' | 'edit' | false
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const load = () => setList(productSvc.getAll(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal('add'); };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, subtitle: p.subtitle || '',
      price: p.price, original_price: p.original_price || '',
      badge: p.badge || '', description: p.description || '',
      details: Array.isArray(p.details) ? p.details.join(', ') : '',
      image_url: p.image_url || '', active: p.active,
    });
    setError('');
    setModal('edit');
  };

  const closeModal = () => { setModal(false); setEditing(null); setError(''); };

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim())   { setError('Name is required.'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Price must be a positive number.'); return; }
    setSaving(true);
    const payload = {
      ...form,
      price:          Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      badge:          form.badge || null,
      details:        form.details ? form.details.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (modal === 'add') productSvc.add(payload);
      else                 productSvc.update(editing.id, payload);
      load();
      closeModal();
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (p) => {
    if (!window.confirm(`Permanently delete "${p.name}"?`)) return;
    productSvc.remove(p.id);
    load();
  };

  const handleToggle = (p) => { productSvc.toggleActive(p.id); load(); };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-espresso-800">Products</h1>
            <p className="text-cream-500 font-sans text-sm mt-1">
              {list.length} total · {list.filter(p => p.active).length} active
            </p>
          </div>
          <button onClick={openAdd} className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-cream-200 overflow-x-auto">
          {list.length === 0 ? (
            <div className="p-16 text-center text-cream-400 font-sans">No products yet. Add your first one!</div>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  {['', 'Name', 'Category', 'Price', 'Badge', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-sans font-medium uppercase tracking-widest text-cream-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {list.map(p => (
                  <tr key={p.id} className={`hover:bg-cream-50 transition-colors ${!p.active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <img src={p.image_url} alt={p.name}
                        className="w-12 h-12 object-cover bg-cream-100"
                        onError={e => { e.target.style.display = 'none'; }} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm font-medium text-espresso-800">{p.name}</p>
                      <p className="font-sans text-xs text-cream-400">{p.subtitle}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-cream-100 text-cream-700 text-xs font-sans capitalize">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-espresso-700">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                      {p.original_price && <span className="ml-1 text-xs text-cream-400 line-through">₹{Number(p.original_price).toLocaleString('en-IN')}</span>}
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-cream-500">{p.badge || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(p)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-sans font-medium transition-colors ${
                          p.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}>
                        {p.active ? <><Eye className="w-3 h-3" /> Active</> : <><EyeOff className="w-3 h-3" /> Inactive</>}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-espresso-500 hover:text-gold-600 transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p)} className="p-1.5 text-cream-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-6 px-4 bg-espresso-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
              <h2 className="font-serif text-2xl text-espresso-800">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={closeModal} className="p-1.5 text-cream-400 hover:text-espresso-700 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label-xs">Product Name *</label>
                  <input required className="input-field" placeholder="Sea Salt Toffee"
                    value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                  <label className="label-xs">Category *</label>
                  <select required className="input-field" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-xs">Badge (optional)</label>
                  <input className="input-field" placeholder="Bestseller, Limited…"
                    value={form.badge} onChange={e => setForm(p => ({...p, badge: e.target.value}))} />
                </div>
                <div>
                  <label className="label-xs">Price (₹) *</label>
                  <input required type="number" step="1" min="1" className="input-field" placeholder="549"
                    value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} />
                </div>
                <div>
                  <label className="label-xs">Original Price (₹) — leave blank if no sale</label>
                  <input type="number" step="1" min="0" className="input-field" placeholder="—"
                    value={form.original_price} onChange={e => setForm(p => ({...p, original_price: e.target.value}))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-xs">Subtitle</label>
                  <input className="input-field" placeholder="Maldon salt · brown butter"
                    value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-xs">Image URL</label>
                  <input type="url" className="input-field" placeholder="https://images.unsplash.com/…"
                    value={form.image_url} onChange={e => setForm(p => ({...p, image_url: e.target.value}))} />
                  {form.image_url && (
                    <img src={form.image_url} alt="preview"
                      className="mt-2 h-24 w-24 object-cover bg-cream-100"
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="label-xs">Description</label>
                  <textarea rows={3} className="input-field resize-none" placeholder="Describe the product…"
                    value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-xs">Details (comma-separated)</label>
                  <input className="input-field" placeholder="Brown butter base, Maldon salt, 6 cookies per box"
                    value={form.details} onChange={e => setForm(p => ({...p, details: e.target.value}))} />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="active" className="w-4 h-4 accent-gold-500"
                    checked={form.active} onChange={e => setForm(p => ({...p, active: e.target.checked}))} />
                  <label htmlFor="active" className="font-sans text-sm text-espresso-700 cursor-pointer">
                    Active (visible in shop)
                  </label>
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-cream-200 flex justify-end gap-3">
              <button onClick={closeModal} className="btn-outline py-2 px-6">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-6 disabled:opacity-60 gap-2">
                {saving ? 'Saving…' : <><Check className="w-4 h-4" /> Save Product</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
