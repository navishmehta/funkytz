import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import client from '../api/client';

const emptyForm = { id: '', name: '', icon: '', order: 0 };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await client.get('/categories/admin');
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({ id: cat.id, name: cat.name, icon: cat.icon, order: cat.order });
    setEditingId(cat._id);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await client.put(`/categories/${editingId}`, form);
      } else {
        await client.post('/categories', form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? This can't be undone.`)) return;
    try {
      await client.delete(`/categories/${cat._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">CATEGORIES</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-funky-orange text-white font-bold text-sm px-4 py-2.5 rounded-md hover:bg-funky-orange-dark transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-comic-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-funky-cream text-left">
                <tr>
                  <th className="px-4 py-3 font-bold">Icon</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Slug (id)</th>
                  <th className="px-4 py-3 font-bold">Order</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3 text-xl">{c.icon}</td>
                    <td className="px-4 py-3 font-semibold">{c.name}</td>
                    <td className="px-4 py-3 text-black/50 font-mono text-xs">{c.id}</td>
                    <td className="px-4 py-3">{c.order}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:text-funky-orange" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 hover:text-red-600" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-black/40">No categories yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {categories.map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow-comic-sm p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-funky-cream p-2.5 rounded-xl shrink-0 border border-black/5">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-funky-black">{c.name}</h3>
                    <p className="text-[10px] text-black/40 font-mono mt-0.5">Slug: {c.id}</p>
                    <p className="text-[10px] text-black/40 font-bold mt-0.5">Order: {c.order}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-2 text-black/60 hover:text-funky-orange" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(c)} className="p-2 text-red-600 hover:text-red-800" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="bg-white rounded-lg shadow-comic-sm p-8 text-center text-black/40">No categories yet.</div>
            )}
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-comic p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg">{editingId ? 'EDIT CATEGORY' : 'NEW CATEGORY'}</h2>
              <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>

            <label className="block text-xs font-bold mb-1.5">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-funky-orange"
              placeholder="e.g. Hoodies"
            />

            <label className="block text-xs font-bold mb-1.5">Slug / id (used in URLs, lowercase, no spaces)</label>
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              required
              disabled={!!editingId}
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-funky-orange disabled:bg-black/5"
              placeholder="e.g. hoodies"
            />

            <label className="block text-xs font-bold mb-1.5">Icon (emoji)</label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-3 text-sm outline-none focus:border-funky-orange"
              placeholder="🧥"
            />

            <label className="block text-xs font-bold mb-1.5">Display order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full border border-black/15 rounded-md px-3 py-2 mb-4 text-sm outline-none focus:border-funky-orange"
            />

            {error && <p className="text-red-600 text-xs font-semibold mb-3">{error}</p>}

            <button type="submit" className="w-full bg-funky-orange text-white font-bold py-2.5 rounded-md hover:bg-funky-orange-dark transition-colors">
              {editingId ? 'Save Changes' : 'Create Category'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
