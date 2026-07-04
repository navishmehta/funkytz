import { Link } from 'react-router-dom';
import { Trash2, MessageCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageHero from '../components/PageHero';

export default function Cart() {
  const { items, subtotal, removeItem, updateQty, buildWhatsAppLink } = useCart();

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  return (
    <div>
      <PageHero title="YOUR CART" subtitle="Review your picks, then confirm your order with us on WhatsApp." />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl mb-3">YOUR CART IS EMPTY</p>
            <p className="text-black/60 text-sm mb-6">Looks like you haven't added anything funky yet.</p>
            <Link
              to="/shop"
              className="bg-funky-orange text-white font-bold px-6 py-3 rounded-md inline-flex items-center gap-2 hover:bg-funky-orange-dark transition-colors focus-ring"
            >
              <ArrowLeft size={16} /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.lineId}
                  className="flex gap-4 border border-black/10 rounded-lg p-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-md bg-funky-cream flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-xs text-black/50 mt-1">Size: {item.size} · Color: {item.color}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-black/15 rounded-md">
                        <button
                          onClick={() => updateQty(item.lineId, item.qty - 1)}
                          className="w-8 h-8 font-bold focus-ring"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.lineId, item.qty + 1)}
                          className="w-8 h-8 font-bold focus-ring"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold">₹{item.price * item.qty}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.lineId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-black/40 hover:text-red-600 transition-colors focus-ring flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <Link to="/shop" className="text-sm font-bold text-funky-orange inline-flex items-center gap-1.5 mt-2 hover:underline">
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-black/10 rounded-lg p-6 sticky top-24">
                <h3 className="font-display text-lg mb-5">ORDER SUMMARY</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/60">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-funky-orange">
                      Add ₹{999 - subtotal} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-black/10 pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <a
                  href={buildWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 w-full flex items-center text-sm justify-center gap-2 bg-[#25D366] text-white font-bold px-2 py-3.5 rounded-md hover:bg-[#1ebe57] transition-colors focus-ring"
                >
                  <MessageCircle size={18} /> Confirm Order via WhatsApp
                </a>
                <p className="text-xs text-black/50 mt-3 text-center">
                  We'll open WhatsApp with your order details filled in — just hit send and our team will confirm payment & delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
