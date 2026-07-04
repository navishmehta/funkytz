import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../context/CartContext';

export default function Footer() {
  return (
    <footer className="bg-funky-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="mb-4">
            <img src="/logo.png" alt="Funkytz" className="h-12 sm:h-16 w-auto object-contain drop-shadow-md" />
          </div>
          <p className="text-white/60 text-sm leading-relaxed mt-3">
            Wear Your Funk
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com/funky.tz_" target="_blank" rel="noreferrer" aria-label="Instagram" className="focus-ring rounded p-2 bg-white/10 hover:bg-funky-orange transition-colors flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="mailto:funkytz05@gmail.com" aria-label="Email us" className="focus-ring rounded p-2 bg-white/10 hover:bg-funky-orange transition-colors">
              <Mail size={16} />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="focus-ring rounded p-2 bg-white/10 hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">SHOP</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/shop/tshirts">T-Shirts</Link></li>
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/shop/hoodies">Hoodies</Link></li>
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/shop/joggers">Joggers</Link></li>
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/shop/sale">Sale</Link></li>
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/shop/new-arrivals">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">HELP</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/contact">Contact Us</Link></li>
            <li><Link className="hover:text-funky-orange focus-ring rounded" to="/about">About Funkytz</Link></li>
            {/* <li><Link className="hover:text-funky-orange focus-ring rounded" to="/cart">Track / View Cart</Link></li> */}
            <li>
              <a
                className="hover:text-funky-orange focus-ring rounded"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
              >
                Order on WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">GET IN TOUCH</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <span>Tarn Taran, Punjab, India</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 flex-shrink-0" />
              <span>funkytz05@gmail.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>+{WHATSAPP_NUMBER.replace(/(\d{2})(\d{5})(\d+)/, '$1 $2 $3')}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Funkytz. All rights reserved.
      </div>
    </footer>
  );
}
