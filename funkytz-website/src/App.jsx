import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloatButton from './components/WhatsAppFloatButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function GlobalLoader() {
  const { loading } = useProducts();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Animated bouncing logo */}
        <img 
          src="/logo.png" 
          alt="Funkytz Logo" 
          className="h-16 w-auto object-contain animate-bounce mb-6" 
        />
        
        {/* Sleek loading bar */}
        <div className="relative w-24 h-1 bg-black/5 rounded-full overflow-hidden">
          <div className="absolute top-0 bottom-0 bg-funky-orange rounded-full animate-[loading-bar_1.2s_infinite_ease-in-out]" />
        </div>
        
        <p className="text-funky-black/40 text-[9px] uppercase font-bold tracking-widest mt-4 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ProductProvider>
      <GlobalLoader />
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <TopBar />
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:category" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <WhatsAppFloatButton />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </ProductProvider>
  );
}
