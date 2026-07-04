import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, UploadCloud } from 'lucide-react';
import client from '../api/client';

const emptyForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  haveDiscount: false,
  discountPercentage: '',
  colors: '',
  sizes: '',
  stock: '',
  isCustomizable: true,
  bestseller: false,
  newArrival: false,
  trending: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // {url, publicId}
  const [removeImages, setRemoveImages] = useState([]); // publicIds to delete
  const [newFiles, setNewFiles] = useState([]); // File[]
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    client.get('/categories/admin').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    client.get(`/products/admin`).then((res) => {
      const p = res.data.find((prod) => prod._id === id);
      if (p) {
        setForm({
          name: p.name,
          category: p.category,
          description: p.description || '',
          price: p.price,
          haveDiscount: p.haveDiscount,
          discountPercentage: p.discountPercentage || '',
          colors: (p.colors || []).join(', '),
          sizes: (p.sizes || []).join(', '),
          stock: p.stock || '',
          isCustomizable: p.isCustomizable,
          bestseller: p.bestseller,
          newArrival: p.newArrival,
          trending: p.trending,
        });
        setExistingImages(p.images || []);
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((prev) => [...prev, ...files].slice(0, 6));
  };

  const removeNewFile = (idx) => setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  const toggleRemoveExisting = (publicId) => {
    setRemoveImages((prev) => (prev.includes(publicId) ? prev.filter((id2) => id2 !== publicId) : [...prev, publicId]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('haveDiscount', String(form.haveDiscount));
      fd.append('discountPercentage', form.discountPercentage || 0);
      fd.append('colors', JSON.stringify(form.colors.split(',').map((s) => s.trim()).filter(Boolean)));
      fd.append('sizes', JSON.stringify(form.sizes.split(',').map((s) => s.trim()).filter(Boolean)));
      fd.append('stock', form.stock || 0);
      fd.append('isCustomizable', String(form.isCustomizable));
      fd.append('bestseller', String(form.bestseller));
      fd.append('newArrival', String(form.newArrival));
      fd.append('trending', String(form.trending));
      if (removeImages.length) fd.append('removeImages', JSON.stringify(removeImages));
      newFiles.forEach((file) => fd.append('images', file));

      if (isEdit) {
        await client.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await client.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-black/50">Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">{isEdit ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-comic-sm p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-xs font-bold mb-1.5">Product name</label>
          <input value={form.name} onChange={set('name')} required
            className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Category</label>
            <select value={form.category} onChange={set('category')} required
              className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Stock (units)</label>
            <input type="number" min="0" value={form.stock} onChange={set('stock')}
              className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1.5">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={set('price')} required
              className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Discount %</label>
            <input type="number" min="0" max="90" value={form.discountPercentage} onChange={set('discountPercentage')}
              className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.haveDiscount} onChange={set('haveDiscount')} /> Has discount
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Colors (comma separated)</label>
            <input value={form.colors} onChange={set('colors')} placeholder="Black, White, Maroon"
              className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5">Sizes (comma separated)</label>
            <input value={form.sizes} onChange={set('sizes')} placeholder="S, M, L, XL"
              className="w-full border border-black/15 rounded-md px-3 py-2 text-sm outline-none focus:border-funky-orange" />
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.isCustomizable} onChange={set('isCustomizable')} /> Customizable
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.bestseller} onChange={set('bestseller')} /> Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.newArrival} onChange={set('newArrival')} /> New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.trending} onChange={set('trending')} /> Trending
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="block text-xs font-bold mb-2">Images</label>

          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {existingImages.map((img) => (
                <div key={img.publicId} className="relative">
                  <img src={img.url} alt="" className={`w-16 h-16 object-cover rounded-md ${removeImages.includes(img.publicId) ? 'opacity-30' : ''}`} />
                  <button
                    type="button"
                    onClick={() => toggleRemoveExisting(img.publicId)}
                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-0.5"
                    aria-label="Remove image"
                  >
                    <X size={13} className={removeImages.includes(img.publicId) ? 'text-black/30' : 'text-red-600'} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {newFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {newFiles.map((file, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(file)} alt="" className="w-16 h-16 object-cover rounded-md border-2 border-funky-teal" />
                  <button type="button" onClick={() => removeNewFile(i)} className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-0.5">
                    <X size={13} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center gap-2 border-2 border-dashed border-black/20 rounded-md px-4 py-3 text-sm text-black/60 cursor-pointer hover:border-funky-orange w-fit">
            <UploadCloud size={16} /> Upload images
            <input type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" />
          </label>
          <p className="text-[11px] text-black/40 mt-1">Up to 6 images total, 5MB max each. First image is used as the cover.</p>
        </div>

        {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-funky-orange text-white font-bold px-6 py-2.5 rounded-md hover:bg-funky-orange-dark transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/products')}
            className="border border-black/15 font-bold px-6 py-2.5 rounded-md hover:bg-black/5 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
