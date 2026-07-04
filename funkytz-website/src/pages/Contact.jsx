import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import PageHero from '../components/PageHero';
import { WHATSAPP_NUMBER } from '../context/CartContext';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = [
      `Hi Funkytz! I'm reaching out via the contact form.`,
      ``,
      `Name: ${form.name || '-'}`,
      `Email: ${form.email || '-'}`,
      `Message: ${form.message || '-'}`,
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div>
      <PageHero title="CONTACT US" subtitle="Questions about sizing, an order, or a custom request? We're one message away." />

      <div className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h2 className="font-display text-2xl mb-6">GET IN TOUCH</h2>
          <ul className="space-y-5 text-sm">
            <li className="flex items-start gap-3">
              <span className="bg-funky-cream rounded-full p-2.5"><MapPin size={18} className="text-funky-orange" /></span>
              <div>
                <p className="font-bold">Location</p>
                <p className="text-black/60">Tarn Taran, Punjab, India</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-funky-cream rounded-full p-2.5"><Mail size={18} className="text-funky-orange" /></span>
              <div>
                <p className="font-bold">Email</p>
                <p className="text-black/60">funkytz05@gmail.com</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-funky-cream rounded-full p-2.5"><MessageCircle size={18} className="text-funky-orange" /></span>
              <div>
                <p className="font-bold">WhatsApp</p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-funky-orange hover:underline"
                >
                  Chat with us instantly
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-funky-cream rounded-full p-2.5"><Clock size={18} className="text-funky-orange" /></span>
              <div>
                <p className="font-bold">Response Time</p>
                <p className="text-black/60">Mon–Sat, 10am – 7pm IST</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Form */}
        <div>
          <h2 className="font-display text-2xl mb-6">SEND A MESSAGE</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-semibold block mb-1.5">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full border border-black/15 rounded-md px-4 py-2.5 text-sm focus-ring outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold block mb-1.5">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-black/15 rounded-md px-4 py-2.5 text-sm focus-ring outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-semibold block mb-1.5">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full border border-black/15 rounded-md px-4 py-2.5 text-sm focus-ring outline-none resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-md hover:bg-[#1ebe57] transition-colors focus-ring"
            >
              <MessageCircle size={17} /> Send via WhatsApp
            </button>
            <p className="text-xs text-black/50 text-center">
              This opens WhatsApp with your message pre-filled — no account or backend needed.
            </p>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-5xl mx-auto px-4 pb-14">
        <h2 className="font-display text-2xl mb-6">FIND US</h2>
        <div className="w-full h-80 bg-funky-cream rounded-xl overflow-hidden border border-black/10 shadow-sm">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://www.google.com/maps?q=31.4583156,74.9248646&output=embed"
            title="Tarn Taran Location Map"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
