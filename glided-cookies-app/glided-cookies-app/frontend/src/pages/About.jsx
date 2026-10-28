import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, Heart, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1400&q=80"
          alt="Baking" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-espresso-900/70" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <p className="section-label text-gold-300 mb-4">Est. 2018 · Brooklyn, NY</p>
          <h1 className="font-serif text-5xl sm:text-6xl text-cream-50 italic leading-tight">
            A quiet pursuit of the perfect crumb.
          </h1>
        </div>
      </section>

      {/* Founding story */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label mb-4">Our beginning</p>
          <h2 className="font-serif text-4xl text-espresso-800 mb-8">Where it all started.</h2>
          <p className="text-espresso-700 font-sans leading-relaxed text-lg mb-6">
            Crème &amp; Crumbs began in 2018 in a Brooklyn kitchen with a copper whisk, a battered family recipe book, and a stubborn belief that a cookie could be a moment of luxury.
          </p>
          <p className="text-espresso-600 font-sans leading-relaxed">
            What started as weekend experiments for friends and neighbours quickly became something we couldn't keep to ourselves. Within a year, we had our first wholesale account. Within three, a team of eight and a refrigerated van.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-2">The method</p>
            <h2 className="font-serif text-4xl text-espresso-800">Made by hand. Never in a hurry.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Cold-aged 24 hours', body: 'Every dough rests overnight in the cold room. This develops flavour compounds that cannot be rushed.', icon: '❄️' },
              { title: 'Brown butter in copper', body: 'Our brown butter is browned slowly in small copper pots until it smells like toasted hazelnut. It takes twice as long. It tastes twice as good.', icon: '🧈' },
              { title: 'Single-origin cacao', body: 'We source 72% cacao from cooperatives we visit ourselves. No commodity chocolate, no shortcuts.', icon: '🍫' },
            ].map(item => (
              <div key={item.title} className="bg-white p-8 border-t-4 border-gold-500">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl text-espresso-800 mb-3">{item.title}</h3>
                <p className="text-espresso-600 font-sans leading-relaxed text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-label mb-2">What we stand for</p>
            <h2 className="font-serif text-4xl text-espresso-800">Our values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, label: 'Local Farms', body: 'Dairy sourced from local regenerative farms within 200 miles of our Brooklyn kitchen.' },
              { icon: Award, label: 'Single-origin Cacao', body: 'We visit our cooperative partners in person. Every season, every harvest.' },
              { icon: Heart, label: 'No Preservatives', body: 'No preservatives, no emulsifiers, no shelf-life extenders. Just real ingredients.' },
            ].map(v => (
              <div key={v.label} className="text-center p-8">
                <div className="w-14 h-14 bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-gold-600" />
                </div>
                <h3 className="font-serif text-xl text-espresso-800 mb-3">{v.label}</h3>
                <p className="text-espresso-600 font-sans text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-espresso-800 py-16 text-center">
        <h2 className="font-serif text-3xl text-cream-50 mb-4">Ready to taste the difference?</h2>
        <p className="text-cream-300 font-sans mb-8">Each box ships the day it's baked.</p>
        <Link to="/shop" className="btn-gold px-12">Shop the Collection <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  );
}
