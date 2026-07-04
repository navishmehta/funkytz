import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { getActualPrice } from '../utils/pricing';
import ProductCard from '../components/ProductCard';
import StoreReviews from '../components/StoreReviews';

const promoBanners = [
  {
    title: 'NEW ARRIVALS',
    heading: ['Fresh Fits.', 'New Vibes.'],
    cta: 'Shop Now',
    to: '/shop',
    bg: 'bg-[#F3E8F9]',
    text: 'text-funky-black',
  },
  {
    title: 'BEST SELLERS',
    heading: ['Loved by All.', 'Yours Next.'],
    cta: 'Shop Now',
    to: '/shop/sale',
    bg: 'bg-funky-yellow',
    text: 'text-funky-black',
  },
  {
    title: 'FANDOM MERCH',
    heading: ['Wear Your', 'Obsession.'],
    cta: 'Explore Now',
    to: '/shop/fandom',
    bg: 'bg-funky-black',
    text: 'text-white',
  },
  {
    title: 'MEMBERSHIP',
    heading: ['Exclusive Perks.', 'Just for You.'],
    cta: 'Join Now',
    to: '/contact',
    bg: 'bg-funky-teal',
    text: 'text-white',
  },
];

const ProductCarousel = ({ title, productsList, linkTo }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      setIsScrollable(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [productsList]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        <div className="flex items-center gap-4">
          {isScrollable && (
            <div className="flex gap-2">
              <button 
                onClick={() => scroll('left')} 
                disabled={!canScrollLeft}
                className={`p-2 rounded-full transition-colors focus-ring ${canScrollLeft ? 'bg-funky-cream hover:bg-funky-orange hover:text-white' : 'bg-black/5 text-black/20 cursor-not-allowed'}`} 
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scroll('right')} 
                disabled={!canScrollRight}
                className={`p-2 rounded-full transition-colors focus-ring ${canScrollRight ? 'bg-funky-cream hover:bg-funky-orange hover:text-white' : 'bg-black/5 text-black/20 cursor-not-allowed'}`} 
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          <Link to={linkTo} className="text-sm font-bold flex items-center gap-1 hover:text-funky-orange focus-ring rounded">
            View All <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-4 sm:gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-px-4 sm:scroll-px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {productsList.map((p) => (
        <Link key={p.id} to={`/product/${p.id}`} className="snap-start shrink-0 w-[60%] sm:w-[45%] md:w-[30%] lg:w-[calc(20%-19.2px)] block focus-ring group">
          <div className="aspect-[3/4] w-full bg-funky-cream overflow-hidden">
            <img 
              src={p.image} 
              alt={p.name} 
              className="w-full h-full object-cover transition-all duration-500 sm:group-hover:scale-105 active:scale-95 active:opacity-80 sm:active:scale-100 sm:active:opacity-100" 
            />
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold text-funky-black line-clamp-1">{p.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-funky-black text-sm">₹{getActualPrice(p)}</span>
              {p.haveDiscount && (
                <span className="text-xs text-black/40 line-through">₹{p.price}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
  );
};

export default function Home() {
  const { products, categories, loading, error } = useProducts();
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 10);
  const saleProducts = products.filter((p) => p.haveDiscount).slice(0, 10);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-black/50">Loading products...</div>;
  }
  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div>
      <section className="relative bg-funky-orange overflow-hidden pb-24 pt-8 sm:pb-20 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 relative flex flex-col md:flex-row md:items-center md:h-[500px] lg:h-[600px]">
          
          {/* Left Content (Stacked Logo, Text, Buttons) */}
          <div className="relative z-20 w-full md:w-[60%] lg:w-[55%] flex flex-col justify-center pt-4 md:pt-0">
            {/* Logo */}
            <div className="w-full max-w-[260px] sm:max-w-[480px] lg:max-w-[600px] mb-6 md:mb-10 pointer-events-none">
              <img 
                src="/logo.png" 
                alt="Funkytz" 
                className="w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.3)] md:scale-110 md:origin-left" 
              />
            </div>

            {/* Text & Buttons */}
            <div className="relative z-30">
              <p className="font-display text-white text-2xl sm:text-4xl lg:text-3xl leading-tight drop-shadow-md uppercase">
                Wear Your Funk
              </p>
              <p className="text-white/90 mt-4 text-base sm:text-lg font-medium drop-shadow-md">
                Trendsetting fits for the real you. Express your vibe!
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/shop" className="bg-funky-black text-white font-bold px-8 py-3.5 rounded hover:bg-black/80 transition-colors focus-ring">
                  SHOP NOW
                </Link>
                <Link to="/shop" className="bg-white text-funky-black font-bold px-8 py-3.5 rounded hover:bg-white/90 transition-colors focus-ring">
                  EXPLORE NEW
                </Link>
              </div>
            </div>
          </div>

          {/* Models (Right side) */}
          <div className="absolute right-0 bottom-0 top-0 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[45%] opacity-40 md:opacity-100 pointer-events-none z-10 md:z-20">
            {/* Female Model (Background/Right) */}
            <img 
              src="/products/hero-banner-female.png" 
              alt="Model" 
              className="absolute bottom-[-15%] right-[-10%] lg:right-[-10%] h-[115%] w-auto object-cover object-top z-10 drop-shadow-xl" 
            />
            {/* Male Model (Foreground/Left) */}
            <img 
              src="/products/hero-banner-male.png" 
              alt="Model" 
              className="absolute bottom-[-7%] right-[10%] lg:right-[25%] h-[100%] w-auto object-cover object-top z-20 drop-shadow-2xl" 
            />
            
            {/* 60% OFF Badge */}
            <div className="rounded-3xl absolute top-[15%] lg:top-[20%] right-[-5%] lg:right-[-18%] bg-black text-white p-5 sm:p-7 text-center rotate-[3deg] z-0 shadow-2xl" style={{ clipPath: 'polygon(3% 6%, 98% 2%, 96% 96%, 1% 98%)' }}>
              <div className="text-left"><p className="text-[10px] sm:text-xs font-bold tracking-widest text-white/90 mb-[-4px]">UP TO</p></div>
              <p className="font-display text-6xl sm:text-7xl leading-[0.85] tracking-tight">60%</p>
              <div className="text-right"><p className="text-[10px] sm:text-xs font-bold tracking-widest mt-[-2px]">OFF</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip — pulled up over the hero/white boundary */}
      <section className="px-4 -mt-16 sm:-mt-12 relative z-20">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl px-4 sm:px-8 py-6 grid grid-cols-4 sm:grid-cols-8 gap-y-5 gap-x-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.id === 'sale' ? '/shop/sale' : `/shop/${cat.id}`}
              className="flex flex-col items-center gap-2 group focus-ring rounded"
            >
              <span
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-105 ${
                  cat.id === 'sale' ? 'bg-funky-orange' : 'bg-funky-cream'
                }`}
              >
                {cat.icon}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMO GRID */}
      <section className="max-w-7xl mx-auto px-4 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoBanners.map((b) => (
            <Link
              key={b.title}
              to={b.to}
              className={`${b.bg} ${b.text} rounded-lg p-6 flex flex-col justify-between min-h-[180px] hover:opacity-90 transition-opacity focus-ring`}
            >
              <div>
                <p className="text-xs font-bold tracking-wide opacity-80">{b.title}</p>
                <p className="font-display text-xl mt-2 leading-snug">
                  {b.heading[0]}<br />{b.heading[1]}
                </p>
              </div>
              <span className="text-xs font-bold underline mt-4 inline-flex items-center gap-1">
                {b.cta} <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <ProductCarousel title="NEW ARRIVALS" productsList={newArrivals} linkTo="/shop/new-arrivals" />

      {/* ON SALE */}
      <div className="mb-8">
        <ProductCarousel title="ON SALE" productsList={saleProducts} linkTo="/shop/sale" />
      </div>

      {/* STORE REVIEWS */}
      <StoreReviews />

      {/* BRAND STRIP */}
      <section className="bg-funky-cream py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-display text-2xl sm:text-3xl mb-3">DESIGNED FOR THE BOLD</h3>
          <p className="text-black/60 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Heavyweight cotton. Fade-resistant prints. Anime and fandom drops every week.
            Funkytz is streetwear made for people who don't blend in.
          </p>
          <Link
            to="/shop"
            className="bg-funky-orange text-white font-bold px-7 py-3 rounded-md inline-block hover:bg-funky-orange-dark transition-colors focus-ring"
          >
            Browse Full Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
