import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const SUBJECTS = ['General Enquiry', 'Wholesale', 'Corporate Gifting', 'Custom Order', 'Wedding / Event'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Enquiry', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-cream-100 py-16 text-center border-b border-cream-200">
        <p className="section-label mb-2">Get in touch</p>
        <h1 className="font-serif text-5xl text-espresso-800 mb-4">Contact Crème &amp; Crumbs</h1>
        <p className="text-cream-600 font-sans max-w-xl mx-auto">
          Corporate gifting, wholesale, custom bakes for a wedding or a private dinner — our team responds within one business day.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Left: details */}
        <div>
          <h2 className="font-serif text-2xl text-espresso-800 mb-8">Bakery details</h2>
          <div className="space-y-6 mb-10">
            {[
              { icon: Mail, label: 'Email', value: 'concierge@cremeandcrumbs.com' },
              { icon: Phone, label: 'Phone', value: '+1 (212) 555-0138' },
              { icon: MapPin, label: 'Address', value: '212 Wythe Ave, Brooklyn NY 11249' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-cream-500 mb-1">{label}</p>
                  <p className="font-sans text-espresso-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Map placeholder */}
          <div className="aspect-video bg-espresso-800 flex items-center justify-center">
            <div className="text-center text-cream-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gold-400" />
              <p className="font-sans text-sm">212 Wythe Ave<br />Brooklyn, NY 11249</p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <h2 className="font-serif text-2xl text-espresso-800 mb-8">Send us a message</h2>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <CheckCircle className="w-14 h-14 text-gold-500" />
              <h3 className="font-serif text-2xl text-espresso-800">Thank you!</h3>
              <p className="text-cream-600 font-sans">We'll be in touch within one business day.</p>
              <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'General Enquiry', message:'' }); }}
                className="btn-outline mt-4">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-2">Your Name *</label>
                  <input required className="input-field" placeholder="Jane Smith" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-2">Email *</label>
                  <input required type="email" className="input-field" placeholder="jane@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-2">Subject</label>
                <select className="input-field" value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-espresso-600 mb-2">Message *</label>
                <textarea required rows={6} className="input-field resize-none" placeholder="Tell us about your enquiry…" value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
                {loading ? <span className="animate-spin">⏳</span> : <Send className="w-4 h-4" />}
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
