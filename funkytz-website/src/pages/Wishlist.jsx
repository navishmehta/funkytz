import { Link } from 'react-router-dom';
import { HeartCrack, ShoppingCart, Trash2, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { items, clearWishlist, removeFromWishlist } = useWishlist();

  return (
    <div>
      <div className="bg-funky-cream border-b border-black/10 py-12 px-4 text-center">
        <h1 className="font-display text-4xl mb-3">YOUR WISHLIST</h1>
        <p className="text-black/60 font-semibold mb-3">{items.length} items saved</p>
        {items.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 transition-colors focus-ring px-3 py-1.5 rounded-full border border-red-600/30"
          >
            <Trash2 size={14} /> Clear Wishlist
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-funky-cream rounded-full mb-6 text-black/40">
              <HeartCrack size={32} />
            </div>
            <h2 className="font-display text-2xl mb-3">IT'S EMPTY HERE</h2>
            <p className="text-black/60 mb-8 max-w-sm mx-auto">
              Save your favorite items here so you don't lose track of them.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-funky-orange text-white font-bold px-8 py-3 rounded-md hover:bg-funky-orange-dark transition-colors focus-ring"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} isWishlistPage={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
