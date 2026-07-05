import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X, Star, StarHalf } from 'lucide-react';
import client from '../api/client';

const emptyForm = { product: '', customerName: '', rating: 5, comment: '' };

const StarRow = ({ value }) => (
  <div className="flex gap-0.5 text-funky-yellow">
    {Array.from({ length: 5 }).map((_, i) => {
      const isFull = value >= i + 1;
      const isHalf = !isFull && value > i;
      if (isHalf) {
        return (
          <div key={i} className="relative">
            <Star size={13} fill="none" />
            <div className="absolute inset-0 overflow-hidden w-1/2 text-funky-yellow">
              <Star size={13} fill="currentColor" />
            </div>
          </div>
        );
      }
      return <Star key={i} size={13} fill={isFull ? 'currentColor' : 'none'} />;
    })}
  </div>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [productFilter, setProductFilter] = useState('all');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const [reviewsRes, productsRes] = await Promise.all([
      client.get('/reviews/admin'),
      client.get('/products/admin'),
    ]);
    setReviews(reviewsRes.data);
    setProducts(productsRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (r) => {
    setForm({ product: r.product?._id || '', customerName: r.customerName, rating: r.rating, comment: r.comment });
    setEditingId(r._id);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await client.put(`/reviews/${editingId}`, form);
      } else {
        await client.post('/reviews', form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const toggleVisible = async (r) => {
    await client.put(`/reviews/${r._id}`, { isVisible: !r.isVisible });
    load();
  };

  const handleDelete = async (r) => {
    if (!confirm(`Delete this review from "${r.customerName}"?`)) return;
    await client.delete(`/reviews/${r._id}`);
    load();
  };

  const filtered = productFilter === 'all' ? reviews : reviews.filter((r) => r.product?._id === productFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight">REVIEWS</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-funky-orange text-white font-bold text-sm px-4 py-2.5 rounded-md hover:bg-funky-orange-dark transition-colors"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      <select
        value={productFilter}
        onChange={(e) => setProductFilter(e.target.value)}
        className="w-full sm:w-64 border border-black/15 rounded-md px-3 py-2.5 text-sm mb-5 outline-none focus:border-funky-orange"
      >
        <option value="all">All products</option>
        {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-black/5 p-10 text-center text-black/40">No reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r._id} className={`bg-white rounded-lg shadow-sm border border-black/5 p-5 ${!r.isVisible ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm">{r.customerName}</p>
                  <p className="text-xs text-black/50 mb-1.5">
                    on <span className="font-semibold">{r.product?.name || 'Unknown product'}</span>
                  </p>
                  <StarRow value={r.rating} />
                  <p className="text-sm mt-2 text-black/80">{r.comment}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(r)} className="p-1.5 hover:text-funky-orange" aria-label="Edit">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => toggleVisible(r)} className="text-[11px] font-bold px-2 py-1 rounded-full border border-black/15 hover:border-funky-orange">
                    {r.isVisible ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => handleDelete(r)} className="p-1.5 hover:text-red-600" aria-label="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-black/5 p-6 w-full max-w-sm relative animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg">{editingId ? 'EDIT REVIEW' : 'NEW REVIEW'}</h2>
              <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>

            <label className="block text-xs font-bold mb-1.5">Product</label>
            <select
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              required
              disabled={!!editingId}
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-funky-orange disabled:bg-black/5"
            >
              <option value="">Select product</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>

            <label className="block text-xs font-bold mb-1.5">Customer name</label>
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-funky-orange"
              placeholder="e.g. Priya S."
            />

            <label className="block text-xs font-bold mb-1.5">Rating</label>
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-funky-orange"
            >
              {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((n) => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
            </select>

            <label className="block text-xs font-bold mb-1.5">Comment</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
              rows={3}
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-4 text-sm outline-none focus:border-funky-orange"
              placeholder="What did the customer say?"
            />

            {error && <p className="text-red-600 text-xs font-semibold mb-3">{error}</p>}

            <button type="submit" className="w-full bg-funky-orange text-white font-bold py-2.5 rounded-md hover:bg-funky-orange-dark transition-colors">
              {editingId ? 'Save Changes' : 'Add Review'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
