import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Tags, Boxes, AlertTriangle, IndianRupee } from 'lucide-react';
import client from '../api/client';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 flex items-center gap-4 transition-shadow hover:shadow-md">
    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${accent}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-black/50 text-xs font-semibold">{label}</p>
      <p className="font-bold text-2xl tracking-tight mt-0.5">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          client.get('/products/admin'),
          client.get('/categories/admin'),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Could not load catalog data. Is the backend running?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const outOfStock = products.filter((p) => p.stock <= 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const avgPrice = products.length ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0;

  const byCategory = categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.id).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Overview</h1>

      {error && <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard icon={Shirt} label="Total Products" value={products.length} accent="bg-funky-black" />
            <StatCard icon={Tags} label="Categories" value={categories.length} accent="bg-funky-teal" />
            <StatCard icon={Boxes} label="Total Stock (units)" value={totalStock} accent="bg-funky-yellow" />
            <StatCard icon={AlertTriangle} label="Out of Stock" value={outOfStock.length} accent="bg-red-500" />
            <StatCard icon={IndianRupee} label="Avg. Price" value={`₹${avgPrice}`} accent="bg-funky-orange" />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-wide text-black/70 uppercase">Catalog by Category</h2>
              <Link to="/products" className="text-xs font-bold text-funky-orange hover:underline">
                Browse full catalog
              </Link>
            </div>
            {byCategory.length === 0 ? (
              <p className="text-sm text-black/50 py-6 text-center">No categories yet.</p>
            ) : (
              <div className="divide-y divide-black/5">
                {byCategory.map((c) => (
                  <div key={c._id} className="py-3 flex items-center justify-between text-sm">
                    <span className="font-semibold">{c.icon} {c.name}</span>
                    <span className="text-black/50">{c.count} product{c.count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {outOfStock.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 mt-6">
              <h2 className="text-sm font-bold tracking-wide text-red-600 uppercase mb-4">Out of Stock Alerts</h2>
              <div className="divide-y divide-black/5">
                {outOfStock.map((p) => (
                  <div key={p._id} className="py-3 flex items-center justify-between text-sm">
                    <span className="font-semibold">{p.name}</span>
                    <Link to={`/products/${p._id}/edit`} className="text-xs font-bold text-funky-orange hover:underline">
                      Update stock
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-black/40 mt-6">
            Note: order tracking isn't part of this system — orders are confirmed directly over WhatsApp.
          </p>
        </>
      )}
    </div>
  );
}
