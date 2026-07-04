import { Link } from 'react-router-dom';
import { Sparkles, Recycle, Truck, Heart } from 'lucide-react';
import PageHero from '../components/PageHero';

const values = [
  { icon: Sparkles, title: 'Bold Designs', text: 'Original anime, fandom & streetwear graphics — drops you won\u2019t find anywhere else.' },
  { icon: Recycle, title: 'Built to Last', text: '240GSM+ heavyweight cotton with colorfast prints that survive wash after wash.' },
  { icon: Truck, title: 'Fast Delivery', text: 'Quick dispatch across India, with free shipping on orders above ₹999.' },
  { icon: Heart, title: 'Made for You', text: 'Every piece is picked and packed to help you express your own kind of bold.' },
];

export default function About() {
  return (
    <div>
      <PageHero
        title="ABOUT FUNKYTZ"
        subtitle="A streetwear label for people who'd rather stand out than blend in."
      />

      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="font-display text-2xl sm:text-3xl mb-5">OUR STORY</h2>
        <p className="text-black/70 leading-relaxed mb-4">
          Funkytz started with a simple idea: clothing should say something. We were tired of
          plain basics and overpriced "minimalist" tees that said nothing about who was wearing
          them. So we started printing the things we actually loved — anime, fandom culture,
          and bold streetwear graphics — onto heavyweight cotton that actually lasts.
        </p>
        <p className="text-black/70 leading-relaxed">
          Every drop is designed in-house and made for the person who wants their outfit to be a
          statement, not a default. Whether it's an oversized anime print tee or a flame-skull
          hoodie, Funkytz is for the bold, the loud, and the unapologetically you.
        </p>
      </section>

      <section className="bg-funky-cream py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl sm:text-3xl mb-8 text-center">WHY FUNKYTZ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-lg p-6 text-center shadow-comic-sm">
                <v.icon size={26} className="mx-auto mb-3 text-funky-orange" />
                <h3 className="font-bold text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-black/60 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl mb-4">READY TO GET FUNKY?</h2>
        <p className="text-black/60 mb-7 text-sm sm:text-base">
          Browse the full collection or message us directly — we're always happy to help you find your fit.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/shop"
            className="bg-funky-orange text-white font-bold px-6 py-3 rounded-md hover:bg-funky-orange-dark transition-colors focus-ring"
          >
            Shop the Collection
          </Link>
          <Link
            to="/contact"
            className="bg-funky-black text-white font-bold px-6 py-3 rounded-md hover:bg-black/80 transition-colors focus-ring"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
