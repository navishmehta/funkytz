import { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const { products, categories, getActualPrice, loading, error } = useProducts();
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [sort, setSort] = useState('featured');
  const [activeCat, setActiveCat] = useState(category || 'all');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setActiveCat(category || 'all');
  }, [category]);

  // Derive available colors and sizes from backend products
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.color || []))].sort(), [products]);
  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes || []))].sort(), [products]);

  const toggleColor = (c) => setSelectedColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleSize = (s) => setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinPrice('');
    setMaxPrice('');
    setActiveCat('all');
    setSearchParams({});
  };

  const activeFilterCount =
    selectedColors.length +
    selectedSizes.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (activeCat !== 'all' ? 1 : 0) +
    (query ? 1 : 0);

  const filtered = useMemo(() => {
    let list = products;

    // Apply main Category / Collection filter
    if (activeCat !== 'all') {
      if (activeCat === 'sale') {
        list = list.filter((p) => p.haveDiscount);
      } else if (activeCat === 'new-arrivals') {
        list = list.filter((p) => p.newArrival);
      } else if (activeCat === 'bestseller') {
        list = list.filter((p) => p.bestseller);
      } else {
        list = list.filter((p) => p.category === activeCat);
      }
    }

    // Apply Search Query
    if (query) {
      const lowerQuery = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply Color Filters
    if (selectedColors.length > 0) {
      list = list.filter((p) => (p.color || []).some((c) => selectedColors.includes(c)));
    }

    // Apply Size Filters
    if (selectedSizes.length > 0) {
      list = list.filter((p) => (p.sizes || []).some((s) => selectedSizes.includes(s)));
    }

    // Apply Price Filters
    if (minPrice) {
      list = list.filter((p) => getActualPrice(p) >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => getActualPrice(p) <= Number(maxPrice));
    }

    // Apply Sorting
    if (sort === 'price-low') list = [...list].sort((a, b) => getActualPrice(a) - getActualPrice(b));
    if (sort === 'price-high') list = [...list].sort((a, b) => getActualPrice(b) - getActualPrice(a));
    if (sort === 'discount') {
      list = [...list].sort((a, b) => {
        const discountA = a.haveDiscount ? a.discountPercentage : 0;
        const discountB = b.haveDiscount ? b.discountPercentage : 0;
        return discountB - discountA;
      });
    }

    return list;
  }, [products, activeCat, query, selectedColors, selectedSizes, minPrice, maxPrice, sort, getActualPrice]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-black/50">Loading products...</div>;
  }
  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-red-600 font-semibold">{error}</div>;
  }

  // Sidebar/Filter Panel content helper function to avoid duplication
  const renderFilters = () => (
    <div className="space-y-8">
      {/* Category / Collections Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-funky-black mb-4 border-b border-black/5 pb-2">Collections</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveCat('all')}
              className={`flex items-center justify-between w-full text-left text-sm font-medium py-1 px-2 rounded-lg transition-all ${
                activeCat === 'all'
                  ? 'bg-funky-orange text-white font-bold'
                  : 'text-black/70 hover:bg-funky-cream'
              }`}
            >
              <span>🌐 All Products</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveCat('new-arrivals')}
              className={`flex items-center justify-between w-full text-left text-sm font-medium py-1 px-2 rounded-lg transition-all ${
                activeCat === 'new-arrivals'
                  ? 'bg-funky-orange text-white font-bold'
                  : 'text-black/70 hover:bg-funky-cream'
              }`}
            >
              <span>🔥 New Arrivals</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveCat('sale')}
              className={`flex items-center justify-between w-full text-left text-sm font-medium py-1 px-2 rounded-lg transition-all ${
                activeCat === 'sale'
                  ? 'bg-funky-orange text-white font-bold'
                  : 'text-black/70 hover:bg-funky-cream'
              }`}
            >
              <span>🏷️ On Sale</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setActiveCat(c.id)}
                className={`flex items-center justify-between w-full text-left text-sm font-medium py-1 px-2 rounded-lg transition-all ${
                  activeCat === c.id
                    ? 'bg-funky-orange text-white font-bold'
                    : 'text-black/70 hover:bg-funky-cream'
                }`}
              >
                <span>{c.icon} {c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Colors Filter */}
      {allColors.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-funky-black mb-4 border-b border-black/5 pb-2">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {allColors.map((color) => {
              const isSelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-funky-black text-white border-funky-black shadow-sm'
                      : 'bg-white border-black/10 hover:border-funky-black text-funky-black'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  <span>{color}</span>
                  {isSelected && <Check size={10} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes Filter */}
      {allSizes.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-funky-black mb-4 border-b border-black/5 pb-2">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 min-w-[40px] text-center rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-funky-orange text-white border-funky-orange shadow-sm'
                      : 'bg-white border-black/10 hover:border-funky-orange text-funky-black'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-funky-black mb-4 border-b border-black/5 pb-2">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-black/30">₹</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-funky-cream/40 border border-black/10 focus:border-funky-orange outline-none rounded-xl pl-6 pr-3 py-2 text-xs font-semibold"
              />
            </div>
            <span className="text-xs font-semibold text-black/30">to</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-black/30">₹</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-funky-cream/40 border border-black/10 focus:border-funky-orange outline-none rounded-xl pl-6 pr-3 py-2 text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-funky-black text-white py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1FAFA0] mb-2">Shop Catalog</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-none">
            {query ? `Search: "${query}"` : activeCat === 'all' ? 'All Products' : activeCat === 'new-arrivals' ? 'New Arrivals' : activeCat === 'sale' ? 'Sale Items' : activeCat.toUpperCase()}
          </h1>
          <p className="text-white/60 mt-3 text-sm sm:text-base max-w-xl">
            Upgrade your vibe with our custom heavy-weight streetwear and drops.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── DESKTOP SIDEBAR ────────────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0 self-start sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-lg tracking-tight">FILTERS</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-bold text-funky-orange hover:underline"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>
            {renderFilters()}
          </aside>

          {/* ── MAIN PRODUCT DISPLAY ───────────────────────────── */}
          <main className="flex-1">
            {/* Top Toolbar (Sort, Mobile Filter Toggle, Counts) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-3 bg-funky-cream/35 p-3 rounded-2xl border border-black/5">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-4 py-2 bg-white border border-black/10 hover:border-funky-black rounded-full text-xs font-bold shadow-sm transition-all"
                >
                  <SlidersHorizontal size={14} />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-funky-orange text-white text-[10px] w-5 h-5 shrink-0 rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-xs sm:text-sm font-semibold text-black/50">
                  Showing <span className="text-funky-black font-bold">{filtered.length}</span> products
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs font-bold text-black/40 uppercase tracking-wider">Sort By</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border border-black/15 hover:border-funky-black rounded-full text-xs font-bold px-4 py-2 outline-none cursor-pointer transition-colors"
                  aria-label="Sort catalog"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 items-center">
                <span className="text-xs font-bold text-black/40 uppercase tracking-wider mr-1">Active:</span>
                
                {activeCat !== 'all' && (
                  <span className="flex items-center gap-1 bg-funky-orange/10 border border-funky-orange/20 text-funky-orange text-xs font-bold px-3 py-1 rounded-full">
                    <span>Category: {activeCat}</span>
                    <button onClick={() => setActiveCat('all')}><X size={12} /></button>
                  </span>
                )}
                
                {query && (
                  <span className="flex items-center gap-1 bg-funky-orange/10 border border-funky-orange/20 text-funky-orange text-xs font-bold px-3 py-1 rounded-full">
                    <span>Search: {query}</span>
                    <button onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete('q');
                      setSearchParams(newParams);
                    }}><X size={12} /></button>
                  </span>
                )}
                
                {selectedColors.map((color) => (
                  <span key={color} className="flex items-center gap-1 bg-black/5 border border-black/10 text-funky-black text-xs font-bold px-3 py-1 rounded-full">
                    <span>{color}</span>
                    <button onClick={() => toggleColor(color)}><X size={12} /></button>
                  </span>
                ))}
                
                {selectedSizes.map((size) => (
                  <span key={size} className="flex items-center gap-1 bg-black/5 border border-black/10 text-funky-black text-xs font-bold px-3 py-1 rounded-full">
                    <span>Size: {size}</span>
                    <button onClick={() => toggleSize(size)}><X size={12} /></button>
                  </span>
                ))}
                
                {(minPrice || maxPrice) && (
                  <span className="flex items-center gap-1 bg-black/5 border border-black/10 text-funky-black text-xs font-bold px-3 py-1 rounded-full">
                    <span>
                      {minPrice && `Min: ₹${minPrice}`} {maxPrice && `Max: ₹${maxPrice}`}
                    </span>
                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X size={12} /></button>
                  </span>
                )}

                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-funky-orange hover:underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Grid display */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-funky-cream/20 border border-dashed border-black/10 rounded-3xl">
                <p className="font-display text-xl mb-2 text-funky-black">No Products Found</p>
                <p className="text-black/50 text-sm mb-6">We couldn't find any fits matching those filters.</p>
                <button
                  onClick={clearFilters}
                  className="bg-funky-orange text-white font-bold px-6 py-3 rounded-xl hover:bg-funky-orange-dark transition-all focus-ring shadow-comic-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE FULL-SCREEN FILTER OVERLAY ────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white w-full h-full flex flex-col animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl">FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="bg-funky-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {activeFilterCount > 0 && (
                <button 
                  onClick={clearFilters} 
                  className="text-xs font-bold text-funky-orange border border-funky-orange/20 px-3 py-1.5 rounded-lg active:bg-funky-orange/5"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full bg-funky-cream/60 text-funky-black hover:bg-funky-cream active:scale-95 transition-all"
                aria-label="Close filters"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
            {renderFilters()}
          </div>

          {/* Sticky Footer CTA */}
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-black/5 bg-white/95 backdrop-blur-md z-10">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-funky-black hover:bg-black/90 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-comic-sm text-sm"
            >
              View {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
