import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, EyeOff, Eye, SlidersHorizontal, Trash2, X } from 'lucide-react';
import client from '../api/client';

const emptyFilters = { category: 'all', color: 'all', size: 'all', minPrice: '', maxPrice: '', stock: 'all' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const load = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      client.get('/products/admin'),
      client.get('/categories/admin'),
    ]);
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (p) => {
    const action = p.isActive ? 'hide' : 'show';
    if (!confirm(`${p.isActive ? 'Hide' : 'Show'} "${p.name}" ${p.isActive ? 'from' : 'on'} the storefront?`)) return;
    await client.put(`/products/${p._id}`, { isActive: String(!p.isActive) });
    load();
  };

  const handleDeleteSubmit = async () => {
    if (deleteCode !== '1001') {
      setDeleteError('Incorrect code.');
      return;
    }
    try {
      await client.delete(`/products/${deleteProduct._id}`);
      setDeleteProduct(null);
      setDeleteCode('');
      setDeleteError('');
      load();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete');
    }
  };

  // Distinct filter options, derived straight from the current catalog
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors || []))].sort(), [products]);
  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes || []))].sort(), [products]);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    if (filters.color !== 'all' && !(p.colors || []).includes(filters.color)) return false;
    if (filters.size !== 'all' && !(p.sizes || []).includes(filters.size)) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.stock === 'in' && p.stock <= 0) return false;
    if (filters.stock === 'out' && p.stock > 0) return false;
    return true;
  });

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && v !== 'all').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight">PRODUCTS</h1>
        <Link
          to="/products/new"
          className="flex items-center gap-1.5 bg-funky-orange text-white font-bold text-sm px-4 py-2.5 rounded-md hover:bg-funky-orange-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:w-64 border border-black/15 rounded-md px-3 py-2.5 text-sm outline-none focus:border-funky-orange"
        />
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-1.5 border border-black/15 rounded-md px-3 py-2.5 text-sm font-semibold hover:border-funky-orange"
        >
          <SlidersHorizontal size={15} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        {activeFilterCount > 0 && (
          <button onClick={() => setFilters(emptyFilters)} className="text-xs font-bold text-funky-orange hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-black/5 p-4 mb-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-bold mb-1 text-black/60">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className="w-full border border-black/15 rounded-md px-2 py-2 text-xs outline-none focus:border-funky-orange"
            >
              <option value="all">All</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-black/60">Color</label>
            <select
              value={filters.color}
              onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))}
              className="w-full border border-black/15 rounded-md px-2 py-2 text-xs outline-none focus:border-funky-orange"
            >
              <option value="all">All</option>
              {allColors.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-black/60">Size</label>
            <select
              value={filters.size}
              onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value }))}
              className="w-full border border-black/15 rounded-md px-2 py-2 text-xs outline-none focus:border-funky-orange"
            >
              <option value="all">All</option>
              {allSizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-black/60">Min price</label>
            <input
              type="number" min="0" value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
              className="w-full border border-black/15 rounded-md px-2 py-2 text-xs outline-none focus:border-funky-orange"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-black/60">Max price</label>
            <input
              type="number" min="0" value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
              className="w-full border border-black/15 rounded-md px-2 py-2 text-xs outline-none focus:border-funky-orange"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1 text-black/60">Stock</label>
            <select
              value={filters.stock}
              onChange={(e) => setFilters((f) => ({ ...f, stock: e.target.value }))}
              className="w-full border border-black/15 rounded-md px-2 py-2 text-xs outline-none focus:border-funky-orange"
            >
              <option value="all">All</option>
              <option value="in">In stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-black/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-funky-cream text-left">
                <tr>
                  <th className="px-4 py-3 font-bold">Image</th>
                  <th className="px-4 py-3 font-bold">Name</th>
                  <th className="px-4 py-3 font-bold">Category</th>
                  <th className="px-4 py-3 font-bold">Colors</th>
                  <th className="px-4 py-3 font-bold">Sizes</th>
                  <th className="px-4 py-3 font-bold">Price</th>
                  <th className="px-4 py-3 font-bold">Stock</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((p) => (
                  <tr key={p._id} className={!p.isActive ? 'opacity-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-md bg-funky-cream overflow-hidden">
                        {p.images?.[0]?.url && (
                          <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3 text-black/60">{p.category}</td>
                    <td className="px-4 py-3 text-black/60 text-xs">{(p.colors || []).join(', ')}</td>
                    <td className="px-4 py-3 text-black/60 text-xs">{(p.sizes || []).join(', ')}</td>
                    <td className="px-4 py-3">
                      ₹{p.haveDiscount ? Math.round(p.price - (p.price * p.discountPercentage) / 100) : p.price}
                      {p.haveDiscount && <span className="text-black/40 line-through ml-1 text-xs">₹{p.price}</span>}
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold uppercase px-2 py-1 rounded-full ${p.isActive ? 'bg-funky-teal/15 text-funky-teal' : 'bg-black/10 text-black/50'}`}>
                        {p.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link 
                          to={`/products/${p._id}/edit`} 
                          className="p-2 text-black/60 hover:text-funky-orange hover:bg-funky-orange/10 rounded-md transition-colors" 
                          title="Edit Product"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button 
                          onClick={() => toggleActive(p)} 
                          className="p-2 text-black/60 hover:text-funky-orange hover:bg-funky-orange/10 rounded-md transition-colors" 
                          title={p.isActive ? "Hide Product" : "Show Product"}
                        >
                          {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button 
                          onClick={() => { setDeleteProduct(p); setDeleteCode(''); setDeleteError(''); }} 
                          className="p-2 text-black/60 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-black/40">No products match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {filtered.map((p) => (
              <div key={p._id} className={`bg-white rounded-lg shadow-sm border border-black/5 p-4 flex gap-4 ${!p.isActive ? 'opacity-60' : ''}`}>
                <div className="w-20 h-24 rounded-lg bg-funky-cream overflow-hidden shrink-0 border border-black/5">
                  {p.images?.[0]?.url && (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm text-funky-black line-clamp-1">{p.name}</h3>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${p.isActive ? 'bg-funky-teal/15 text-funky-teal' : 'bg-black/10 text-black/50'}`}>
                        {p.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-[10px] text-black/40 font-bold uppercase mt-0.5">{p.category}</p>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="font-bold text-sm">
                        ₹{p.haveDiscount ? Math.round(p.price - (p.price * p.discountPercentage) / 100) : p.price}
                      </span>
                      {p.haveDiscount && <span className="text-black/40 line-through text-[10px]">₹{p.price}</span>}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-black/5 pt-2">
                    <span className="text-xs text-black/50">Stock: <strong className="text-funky-black">{p.stock}</strong></span>
                    <div className="flex gap-1">
                      <Link 
                        to={`/products/${p._id}/edit`} 
                        className="p-2 text-black/60 hover:text-funky-orange hover:bg-funky-orange/10 rounded-md transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button 
                        onClick={() => toggleActive(p)} 
                        className="p-2 text-black/60 hover:text-funky-orange hover:bg-funky-orange/10 rounded-md transition-colors"
                      >
                        {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button 
                        onClick={() => { setDeleteProduct(p); setDeleteCode(''); setDeleteError(''); }} 
                        className="p-2 text-black/60 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-black/5 p-8 text-center text-black/40">No products match these filters.</div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-md border border-black/5 max-w-md w-full p-6 animate-scale-in relative">
            <button 
              onClick={() => setDeleteProduct(null)} 
              className="absolute top-4 right-4 p-1 text-black/50 hover:text-black hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold tracking-tight text-red-600 mb-2">DELETE PRODUCT</h2>
            <p className="text-sm text-black/70 mb-4">
              Are you sure you want to delete <strong>{deleteProduct.name}</strong>? This action cannot be undone.
            </p>
            
            <div className="mb-4">
              <input
                type="text"
                maxLength="4"
                value={deleteCode}
                onChange={(e) => setDeleteCode(e.target.value.replace(/\D/g, ''))}
                placeholder="0000"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono border-2 border-black/10 rounded-lg px-4 py-3 outline-none focus:border-red-500"
                autoFocus
              />
              {deleteError && <p className="text-red-500 text-xs font-bold mt-2 text-center">{deleteError}</p>}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteProduct(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-black/10 font-bold hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={deleteCode.length !== 4}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm border border-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
