import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop/new-arrivals', label: 'New Arrivals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { products, getActualPrice } = useProducts();

  const searchResults = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
        <Link to="/" className="focus-ring rounded outline-none flex items-center h-full" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Funkytz" className="h-10 sm:h-12 w-auto object-contain drop-shadow-md scale-[1.3] sm:scale-[1.8] origin-left" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `focus-ring rounded px-1 transition-colors ${
                  l.accent
                    ? 'text-funky-orange hover:text-funky-orange-dark'
                    : isActive
                    ? 'text-funky-orange'
                    : 'text-funky-black hover:text-funky-orange'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center flex-1 max-w-xs relative z-50">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search for products..."
              aria-label="Search for products"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onKeyDown={handleSearch}
              className="w-full bg-funky-cream rounded-full pl-9 pr-3 py-2 text-sm focus-ring outline-none"
            />
          </div>

          {showDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-black/10 rounded-lg shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="flex flex-col">
                  {searchResults.map(p => (
                    <Link 
                      key={p.id} 
                      to={`/product/${p.id}`}
                      onClick={() => { setShowDropdown(false); setSearchQuery(''); setOpen(false); }}
                      className="flex items-center gap-3 p-3 hover:bg-funky-cream transition-colors border-b border-black/5 last:border-0"
                    >
                      <div className="w-10 h-10 bg-funky-cream rounded shrink-0 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-funky-black truncate">{p.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-bold text-funky-black text-[11px]">₹{getActualPrice(p)}</span>
                          {p.haveDiscount && <span className="text-[10px] text-black/40 line-through">₹{p.price}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-black/60">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" aria-label="Wishlist" className="relative focus-ring rounded hidden sm:block hover:text-funky-orange transition-colors">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-funky-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative focus-ring rounded hover:text-funky-orange transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-funky-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="focus-ring rounded lg:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-black/10 bg-white px-4 py-3 flex flex-col gap-3 font-semibold text-sm">
          <div className="relative w-full mb-1 z-50">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onKeyDown={handleSearch}
              className="w-full bg-funky-cream rounded-full pl-9 pr-3 py-2 text-sm focus-ring outline-none"
            />
            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-black/10 rounded-lg shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/product/${p.id}`}
                        onClick={() => { setShowDropdown(false); setSearchQuery(''); setOpen(false); }}
                        className="flex items-center gap-3 p-3 hover:bg-funky-cream transition-colors border-b border-black/5 last:border-0"
                      >
                        <div className="w-10 h-10 bg-funky-cream rounded shrink-0 overflow-hidden">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-funky-black truncate">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-bold text-funky-black text-[11px]">₹{getActualPrice(p)}</span>
                            {p.haveDiscount && <span className="text-[10px] text-black/40 line-through">₹{p.price}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-black/60">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? 'text-funky-orange' : 'text-funky-black'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
