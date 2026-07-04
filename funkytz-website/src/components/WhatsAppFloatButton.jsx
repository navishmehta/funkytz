import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../context/CartContext';

export default function WhatsAppFloatButton() {
  const msg = encodeURIComponent("Hi Funkytz! I have a question about your products.");
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-4 sm:right-5 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full p-3 sm:p-3.5 shadow-lg shadow-black/20 focus-ring transition-transform hover:scale-105"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </a>
  );
}
