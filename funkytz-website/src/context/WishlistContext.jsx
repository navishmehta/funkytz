import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'funkytz_wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const local = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const isWishlisted = (productId) => items.some(i => i.id === productId);

    const toggleWishlist = (product) => {
      const exists = items.some(i => i.id === product.id);
      if (exists) {
        setItems(prev => prev.filter(i => i.id !== product.id));
      } else {
        setItems(prev => [...prev, product]);
      }
    };

    const removeFromWishlist = (productId) => {
      setItems(prev => prev.filter(i => i.id !== productId));
    };

    const clearWishlist = () => {
      setItems([]);
    };

    return {
      items,
      itemCount: items.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist
    };
  }, [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
