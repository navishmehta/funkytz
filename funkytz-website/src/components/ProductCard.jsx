import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { getActualPrice } from '../utils/pricing';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, isWishlistPage }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);



  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!isWishlistPage && !isWishlisted(product.id)) {
      setIsAnimating(true);
      toggleWishlist(product);
      setTimeout(() => {
        setIsAnimating(false);
      }, 250);
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block focus-ring rounded-lg"
    >
      <div className="relative bg-funky-cream rounded-lg overflow-hidden aspect-[5/6]">
        {product.haveDiscount && (
          <span className="absolute top-2 left-2 bg-funky-orange text-white text-xs font-bold px-2 py-1 rounded z-10">
            -{product.discountPercentage}%
          </span>
        )}
        {isWishlistPage ? (
          <button
            aria-label="Remove from wishlist"
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 text-red-600 hover:bg-red-600 hover:text-white transition-colors focus-ring shadow-sm"
          >
            <X size={15} />
          </button>
        ) : (
          <button
            aria-label="Add to wishlist"
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors focus-ring"
          >
            <Heart size={15} fill={isWishlisted(product.id) || isAnimating ? "currentColor" : "none"} className={`${isWishlisted(product.id) || isAnimating ? "text-funky-orange" : ""} ${isAnimating ? "animate-heart-pop" : ""}`} />
          </button>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-300 sm:group-hover:scale-105 active:scale-95 active:opacity-80 sm:active:scale-100 sm:active:opacity-100"
        />
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-funky-black line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-funky-black">₹{getActualPrice(product)}</span>
          {product.haveDiscount && (
            <span className="text-xs text-black/40 line-through">₹{product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
