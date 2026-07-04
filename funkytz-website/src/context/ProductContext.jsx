import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { getActualPrice } from '../utils/pricing';

const ProductContext = createContext(null);

// Normalizes a product coming from the API into the shape the rest of the app expects
// (mirrors the old static data/products.js fields: id, image, images, color).
function normalizeProduct(p) {
  return {
    ...p,
    id: p.slug, // used for /product/:id routes
    mongoId: p._id, // needed when placing an order
    image: p.images?.[0]?.url || '',
    images: (p.images || []).map((img) => img.url),
    color: p.colors || [],
  };
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories(),
      ]);
      setProducts(productsRes.items.map(normalizeProduct));
      setCategories(categoriesRes);
    } catch (err) {
      setError(err.message || 'Could not load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getProductById = (id) => products.find((p) => p.id === id);
  const getProductsByCategory = (categoryId) => products.filter((p) => p.category === categoryId);
  const getTrendingProducts = () => products.filter((p) => p.trending);

  const value = {
    products,
    categories,
    loading,
    error,
    reload: load,
    getActualPrice,
    getProductById,
    getProductsByCategory,
    getTrendingProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
