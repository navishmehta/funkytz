import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import { getActualPrice } from '../utils/pricing';

// IMPORTANT: replace with your real WhatsApp Business number (with country code, no + or spaces)
// e.g. '919876543210' for an Indian number +91 98765 43210
export const WHATSAPP_NUMBER = '916284961679';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'funkytz_cart';

const getInitialState = () => {
  try {
    const local = localStorage.getItem(CART_STORAGE_KEY);
    return local ? { items: JSON.parse(local) } : { items: [] };
  } catch (e) {
    return { items: [] };
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, color, qty } = action.payload;
      const lineId = `${product.id}-${size}-${color}`;
      const existing = state.items.find((i) => i.lineId === lineId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.lineId === lineId ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            lineId,
            id: product.id,
            productId: product.mongoId, // backend Product _id, used when placing the order
            name: product.name,
            price: getActualPrice(product),
            image: product.image,
            size,
            color,
            qty,
          },
        ],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.lineId !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.lineId === action.payload.lineId
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'RESTORE_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, getInitialState);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const addItem = (product, size, color, qty = 1) =>
      dispatch({ type: 'ADD_ITEM', payload: { product, size, color, qty } });

    const removeItem = (lineId) => {
      dispatch({ type: 'REMOVE_ITEM', payload: lineId });
    };

    const updateQty = (lineId, qty) => dispatch({ type: 'UPDATE_QTY', payload: { lineId, qty } });

    const clearCart = () => {
      dispatch({ type: 'CLEAR_CART' });
    };

    // Builds a pre-filled WhatsApp message summarizing the order, then opens wa.me
    const buildWhatsAppLink = (items = state.items) => {
      if (items.length === 0) {
        const msg = `Hi Funkytz! I'd like to know more about your products.`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      }
      const lines = items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} | Size: ${i.size} | Color: ${i.color} | Qty: ${i.qty} | ₹${i.price * i.qty}`
      );
      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
      const msg = [
        `Hi Funkytz! I'd like to place an order 🧡`,
        ``,
        ...lines,
        ``,
        `Total: ₹${total}`,
        ``,
        `Please confirm availability and the payment/delivery process. Thank you!`,
      ].join('\n');
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    };

    return {
      items: state.items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      buildWhatsAppLink,
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
