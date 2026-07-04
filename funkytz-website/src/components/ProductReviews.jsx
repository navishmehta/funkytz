import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
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

// Small summary badge meant to sit near the product title/price (e.g. "4.5 (12 reviews)")
export function ReviewSummaryBadge({ productId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.getReviews(productId).then((data) => {
      if (!cancelled) setSummary(data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [productId]);

  if (!summary || summary.count === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <StarRow value={summary.average} size={13} />
      <span className="text-xs text-black/50 font-semibold">
        {summary.average} ({summary.count} review{summary.count !== 1 ? 's' : ''})
      </span>
    </div>
  );
}

// Full reviews list, meant for its own section on the product page
export default function ProductReviews({ productId }) {
  const [data, setData] = useState({ items: [], average: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getReviews(productId)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [productId]);

  if (loading) return null;
  if (data.count === 0) {
    return (
      <section className="mt-16 border-t border-black/10 pt-10">
        <h2 className="font-display text-xl mb-3">REVIEWS</h2>
        <p className="text-sm text-black/50">No reviews yet for this product.</p>
      </section>
    );
  }

  return (
    <section className="mt-16 border-t border-black/10 pt-10">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-xl">REVIEWS</h2>
        <div className="flex items-center gap-2">
          <StarRow value={data.average} size={16} />
          <span className="text-sm font-semibold text-black/70">
            {data.average} out of 5 · {data.count} review{data.count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-5 max-w-2xl">
        {data.items.map((r) => (
          <div key={r._id} className="border border-black/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-sm">{r.customerName}</p>
              <StarRow value={r.rating} />
            </div>
            <p className="text-sm text-black/70 leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
