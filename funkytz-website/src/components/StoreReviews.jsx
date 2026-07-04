import { useEffect, useState } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';

function StarRow({ value, size = 14 }) {
  return (
    <div className="flex gap-0.5 text-funky-yellow">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = value >= i + 1;
        const isHalf = !isFull && value > i;
        if (isHalf) {
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} fill="none" />
              <div className="absolute inset-0 overflow-hidden w-1/2 text-funky-yellow">
                <Star size={size} fill="currentColor" />
              </div>
            </div>
          );
        }
        return <Star key={i} size={size} fill={isFull ? 'currentColor' : 'none'} />;
      })}
    </div>
  );
}

export default function StoreReviews() {
  const [data, setData] = useState({ items: [], count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.getReviews()
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading || data.count === 0) return null;

  // We duplicate the items array once to create a seamless infinite loop
  const marqueeItems = [...data.items, ...data.items];

  return (
    <section className="max-w-7xl mx-auto mt-16 sm:mt-20 mb-16 overflow-hidden relative">
      <div className="px-4 mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">Reviews by our customer</h2>
      </div>
      
      {/* Marquee wrapper */}
      <div className="overflow-hidden pb-6">
        <div className="animate-marquee gap-4 sm:gap-6 px-4">
          {marqueeItems.map((r, index) => (
            <div key={`${r._id}-${index}`} className="shrink-0 w-[300px] sm:w-[400px] bg-white rounded-2xl p-7 flex flex-col relative overflow-hidden border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-default">
              
              {/* Large Background Quote Icon */}
              <div className="absolute -top-4 -right-4 text-funky-orange/10 transform rotate-12 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Quote size={120} />
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Header: User Info & Stars */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-3 items-center">
                    {/* Avatar with Initial */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-funky-orange to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {r.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-bold text-sm text-funky-black tracking-tight">{r.customerName}</p>
                        <CheckCircle2 size={14} className="text-[#1FAFA0]" />
                      </div>
                      <div className="mt-1">
                        <StarRow value={r.rating} size={14} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Review Text */}
                <p className="text-funky-black/80 font-medium leading-relaxed italic text-sm sm:text-[15px] break-words mb-6 flex-1">
                  "{r.comment}"
                </p>

                {/* Footer: Product Info */}
                {r.product && (
                  <div className="pt-4 border-t border-black/5 flex items-center gap-3">
                    {r.product.images?.[0] ? (
                      <Link to={`/product/${r.product.slug}`} className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-sm border border-black/5 focus-ring">
                        <img src={r.product.images[0].url} alt={r.product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </Link>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-black/5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-black/40 font-bold mb-0.5">Reviewed Item</p>
                      <Link to={`/product/${r.product.slug}`} className="text-xs font-semibold text-funky-black truncate block hover:text-funky-orange transition-colors focus-ring rounded">
                        {r.product.name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
