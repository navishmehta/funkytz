import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, MessageCircle, ShoppingCart, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import ProductReviews, { ReviewSummaryBadge } from '../components/ProductReviews';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById, getActualPrice, loading, error } = useProducts();
  const product = getProductById(id);
  const { addItem, buildWhatsAppLink } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [formError, setError] = useState('');
  const [added, setAdded] = useState(false);

  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-black/50">Loading product...</div>;
  }
  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-red-600 font-semibold">{error}</div>;
  }
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl mb-3">PRODUCT NOT FOUND</p>
        <Link to="/shop" className="text-funky-orange font-bold underline">Back to shop</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image].filter(Boolean);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const actualPrice = getActualPrice(product);

  const validate = () => {
    if (!size) return 'Please select a size.';
    if (!color) return 'Please select a color.';
    return '';
  };

  const handleAddToCart = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    addItem(product, size, color, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    addItem(product, size, color, qty);
    navigate('/cart');
  };

  const handleWhatsAppDirect = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    const link = buildWhatsAppLink([
      { name: product.name, size, color, qty, price: actualPrice, image: product.image },
    ]);
    window.open(link, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-black/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-funky-orange">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-funky-orange">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-funky-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory mb-3 aspect-[8/9] max-h-[420px] bg-funky-cream mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {images.map((img, i) => (
              <div key={i} className="min-w-full snap-center flex-shrink-0 h-full flex items-center justify-center overflow-hidden">
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Desktop Interactive Image */}
          <div 
            className="hidden lg:block bg-funky-cream rounded-lg overflow-hidden aspect-[5/6] mb-3 relative cursor-crosshair"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
          >
            {isHovering ? (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${images[activeImg]})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            ) : (
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover pointer-events-none" />
            )}
          </div>

          <div className="hidden lg:flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 focus-ring ${
                  activeImg === i ? 'border-funky-orange' : 'border-transparent'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.fandom && (
            <span className="inline-block bg-funky-cream text-funky-black text-xs font-bold px-3 py-1 rounded-full mb-3">
              {product.fandom}
            </span>
          )}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-display text-2xl sm:text-3xl leading-tight">{product.name}</h1>
            <button
              onClick={() => toggleWishlist(product)}
              className="p-2 rounded-full focus-ring hover:bg-black/5 transition-colors shrink-0"
              aria-label="Toggle Wishlist"
            >
              <Heart 
                size={24} 
                className={isWishlisted(product.id) ? 'fill-funky-orange text-funky-orange' : 'text-black/40'} 
              />
            </button>
          </div>
          <div className="mb-3">
            <ReviewSummaryBadge productId={product.id} />
          </div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-bold">₹{actualPrice}</span>
            {product.haveDiscount && <span className="text-base text-black/40 line-through">₹{product.price}</span>}
            {product.haveDiscount && (
              <span className="bg-funky-orange text-white text-xs font-bold px-2 py-1 rounded">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
          <p className="text-black/60 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Color */}
          <div className="mb-5">
            <p className="text-sm font-bold mb-2">Color {color && <span className="font-normal text-black/50">— {color}</span>}</p>
            <div className="flex gap-2 flex-wrap">
              {product.color.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setError(''); }}
                  className={`px-4 py-2 rounded-md border text-sm font-semibold focus-ring transition-colors ${
                    color === c
                      ? 'border-funky-orange bg-funky-orange text-white'
                      : 'border-black/15 hover:border-funky-orange'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-5">
            <p className="text-sm font-bold mb-2">Size {size && <span className="font-normal text-black/50">— {size}</span>}</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSize(s); setError(''); }}
                  className={`w-12 h-11 rounded-md border text-sm font-semibold focus-ring transition-colors ${
                    size === s
                      ? 'border-funky-orange bg-funky-orange text-white'
                      : 'border-black/15 hover:border-funky-orange'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mb-2">
            <p className="text-sm font-bold mb-2">Quantity</p>
            <div className="flex items-center gap-3 w-fit border border-black/15 rounded-md">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 font-bold focus-ring"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 font-bold focus-ring"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {formError && <p className="text-red-600 text-sm font-semibold mt-3">{formError}</p>}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-funky-black text-white font-bold py-3 rounded-md hover:bg-black/80 transition-colors focus-ring"
            >
              <ShoppingCart size={17} /> {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 bg-funky-orange text-white font-bold py-3 rounded-md hover:bg-funky-orange-dark transition-colors focus-ring"
            >
              Buy Now
            </button>
          </div>
          <button
            onClick={handleWhatsAppDirect}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#128C4A] font-bold py-3 rounded-md mt-3 hover:bg-[#25D366]/10 transition-colors focus-ring"
          >
            <MessageCircle size={17} /> Order Instantly on WhatsApp
          </button>

          <ul className="mt-6 space-y-1.5 text-xs text-black/50">
            <li className="flex items-center gap-1.5"><Check size={13} className="text-funky-teal" /> Free shipping on orders above ₹999</li>
            <li className="flex items-center gap-1.5"><Check size={13} className="text-funky-teal" /> Easy 7-day exchange</li>
            <li className="flex items-center gap-1.5"><Check size={13} className="text-funky-teal" /> Cash on Delivery available</li>
          </ul>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl mb-6">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
