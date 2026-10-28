import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Instagram, Sparkles, Package, Leaf } from 'lucide-react';
import { products as productSvc } from '../services/storage.js';
import ProductCard from '../components/ProductCard.jsx';

const HERO_IMG  = 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1800&q=90';
const ABOUT_IMG = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=900&q=90';

const SPECIALITIES = [
  { title: 'The Cookie Box',  sub: '12 signature flavors',    img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=700&q=90', link: '/shop' },
  { title: 'Fudge Brownies',  sub: 'Triple-chocolate velvet', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&q=90', link: '/shop' },
  { title: 'Occasion Gifts',  sub: 'Elegantly packaged',      img: 'https://images.unsplash.com/photo-1607920592519-bab2c90f5494?w=700&q=90', link: '/shop' },
];

const IG_IMAGES = [
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&q=85',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=85',
  'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=85',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=85',
  'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=85',
  'https://images.unsplash.com/photo-1607920592519-bab2c90f5494?w=500&q=85',
];

const VALUES = [
  { icon: Leaf,     title: 'Local Farms',          desc: 'Dairy sourced from certified regenerative farms within 100 miles.' },
  { icon: Sparkles, title: 'Single-origin Cacao',  desc: '72% cacao from cooperatives that prioritize quality and ethics.' },
  { icon: Package,  title: 'No Preservatives',     desc: 'Baked fresh to order — no additives, no shortcuts.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    setFeatured(productSvc.getAll(true).slice(0, 3));
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={HERO_IMG} alt="Artisan cookies" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso-900/75 via-espresso-900/55 to-espresso-900/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <p className="section-label text-gold-300 mb-6">Artisan · Small-Batch · Handcrafted in India</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-cream-50 leading-tight mb-6">
            Crème &amp; Crumbs
            <br />
            <span className="italic text-gold-300 text-4xl sm:text-5xl lg:text-6xl">— artisan baked</span>
          </h1>
          <p className="text-cream-200 font-sans text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Hand-crafted cookies and decadent brownies made with 72% single-origin cacao and cultured butter. Every batch baked with love.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/shop" className="btn-gold px-12 py-4 text-base shadow-xl">
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="btn-outline border-cream-300 text-cream-100 hover:bg-cream-100 hover:text-espresso-800 px-12 py-4 text-base">
              Our Story
            </Link>
          </div>
        </div>
        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-cream-400 font-sans text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-cream-400/60" />
        </div>
      </section>

      {/* ── Value strip ───────────────────────────────────── */}
      <section className="bg-espresso-800 py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-espresso-600">
          {VALUES.map(v => (
            <div key={v.title} className="flex items-center gap-4 px-8 py-4">
              <v.icon className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <p className="font-sans text-cream-100 text-sm font-semibold">{v.title}</p>
                <p className="font-sans text-cream-500 text-xs">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Specialities ──────────────────────────────── */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Selected seasonal collections</p>
              <h2 className="font-serif text-4xl sm:text-5xl text-espresso-800">Our Specialities</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1 text-espresso-600 hover:text-gold-600 font-sans text-sm transition-colors font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPECIALITIES.map(s => (
              <Link key={s.title} to={s.link} className="group relative aspect-[4/5] overflow-hidden block shadow-lg">
                <img src={s.img} alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  style={{ transform: 'scale(1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/85 via-espresso-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-cream-50 mb-1">{s.title}</h3>
                  <p className="text-cream-300 font-sans text-sm mb-3">{s.sub}</p>
                  <span className="inline-flex items-center gap-1 text-gold-300 font-sans text-xs font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Batch ──────────────────────────────────── */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Fresh This Week</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-espresso-800 mb-4">The Weekly Batch</h2>
            <p className="text-cream-600 font-sans max-w-md mx-auto">Baked the morning it ships. Limited quantities — order early.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-outline">
              View Full Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=1600&q=85"
          alt="Promo" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-espresso-900/80" />
        <div className="relative z-10 text-center px-4">
          <p className="section-label text-gold-400 mb-4">Limited time offer</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-cream-50 mb-3">Autumn Praline Box</h2>
          <p className="text-cream-300 font-sans text-lg mb-8">15% off your first order. Use at checkout. Starting from <span className="text-gold-300 font-semibold">₹1,799</span></p>
          <Link to="/shop" className="btn-gold px-14 py-4 text-base shadow-xl">
            Claim Offer <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── About Teaser ──────────────────────────────────── */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-4">Our story</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-espresso-800 italic leading-tight mb-8">
              "Where the scent of vanilla<br /> meets tradition."
            </h2>
            <p className="text-espresso-600 font-sans leading-relaxed mb-5 text-base">
              Founded in a small kitchen with nothing but a copper whisk and a family recipe book, Crème &amp; Crumbs has grown into a sanctuary for those who appreciate the finer details of baking.
            </p>
            <p className="text-espresso-600 font-sans leading-relaxed mb-10 text-base">
              We source our dairy from local regenerative farms and our cacao from cooperatives that prioritize both quality and ethics — no shortcuts, no preservatives, no compromise.
            </p>
            <Link to="/about" className="btn-primary">
              Read Our Full Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative">
            <img src={ABOUT_IMG} alt="Artisan cookies" className="w-full aspect-[4/5] object-cover shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-gold-500/15 -z-10 hidden lg:block" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-espresso-800/10 -z-10 hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────── */}
      <section className="py-24 bg-espresso-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-gold-400 text-gold-400" />)}
          </div>
          <blockquote className="font-serif text-2xl sm:text-3xl text-cream-100 italic leading-relaxed mb-10">
            "The most soulful cookie I've eaten outside of Paris. The brown butter comes through in a way I didn't think was possible by mail."
          </blockquote>
          <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="font-serif text-gold-300 text-xl">A</span>
          </div>
          <p className="font-sans text-cream-200 font-semibold">Amelia R.</p>
          <p className="font-sans text-cream-500 text-sm mt-1">Verified buyer · Mumbai</p>
        </div>
      </section>

      {/* ── Instagram Grid ────────────────────────────────── */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Follow along</p>
            <h2 className="font-serif text-4xl text-espresso-800">@CremeAndCrumbs</h2>
            <p className="text-cream-500 font-sans text-sm mt-3">Tag us in your sweet moments</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {IG_IMAGES.map((src, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden cursor-pointer">
                <img src={src} alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy" />
                <div className="absolute inset-0 bg-espresso-900/0 group-hover:bg-espresso-900/50 transition-all duration-300 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
