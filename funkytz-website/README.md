# Funkytz — Streetwear Store

A static React storefront for the Funkytz brand. Browsing, product pages, and cart
are all client-side — checkout happens by sending the order straight to your
WhatsApp number with the cart details pre-filled.

## 1. Before you do anything: set your WhatsApp number

Open `src/context/CartContext.jsx` and replace the placeholder at the top:

```js
export const WHATSAPP_NUMBER = '91XXXXXXXXXX'; // <-- put your real number here
```

Use your number with country code, digits only, no `+`, no spaces or dashes.
Example: for `+91 98765 43210` write `919876543210`.

This single value powers every WhatsApp link on the site — the floating chat
button, "Order Instantly on WhatsApp" on product pages, the cart's
"Confirm Order via WhatsApp" button, and the Contact page form.

## 2. Run it locally

You need [Node.js](https://nodejs.org) (v18+) installed.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## 3. The product catalog

`src/data/products.js` now contains 18 real Funkytz products built from the
photos you sent — the Panjab map and gothic tees, Till Death Rides With Me,
Medusa Gorgons, Boba Girl, Soft Strength, God's Plan, the Spider quote tee,
the couple statement set, and the brown camp shirt.

Prices, sizes, and descriptions were estimated as a starting point — go
through `src/data/products.js` and adjust the `price`, `mrp`, `sizes`, and
`description` fields for each product to match what you actually charge and
stock. The shape of each entry is:

```js
{
  id: 'fz-101',
  name: 'Panjab Floral Map Tee — Black',
  category: 'tshirts',        // must match a category id below
  price: 899,
  mrp: 1399,                  // shown struck-through
  discount: 36,                // % off badge
  colors: ['Black'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  img: img('panjab-map-black-1.jpg'),   // front/main photo
  img2: img('panjab-text-black-1.jpg'), // second gallery photo
  description: '...',
  trending: true,              // shows on homepage "Trending Now"
}
```

To add a brand-new product: drop its photo(s) into `public/products/`, then
copy one of the existing objects in `products.js` and update the fields.

## 4. Build for production

```bash
npm run build
```

This creates a `dist/` folder containing the finished static site — plain
HTML/CSS/JS, no server required.

## 5. Put it on your GoDaddy domain

The `dist/` folder is everything you need to upload. The two common ways to host it:

**Option A — Netlify, Vercel, or Cloudflare Pages (recommended, free, easiest)**
1. Create a free account on any of these.
2. Connect your project (drag-and-drop the `dist` folder, or connect a GitHub repo).
3. Once deployed, they'll give you a URL — then in GoDaddy's DNS settings,
   add the CNAME record they tell you to, pointing your domain at their service.

**Option B — GoDaddy's own web hosting**
1. Log into GoDaddy → your hosting plan → File Manager (or use FTP).
2. Upload everything *inside* `dist/` (not the `dist` folder itself) to your
   site's root directory (often `public_html`).
3. Your domain will then serve `index.html` automatically.

Either way, because all routing happens in the browser (React Router), if you
see a "404" when visiting a sub-page directly (like `yoursite.com/shop`), your
host needs a rewrite rule that sends all paths to `index.html`. Netlify/Vercel
do this automatically; on traditional hosting you may need a small `.htaccess`
rule — ask your host's support if this comes up.

## Project structure

```
src/
  components/   Header, Footer, ProductCard, WhatsApp button, etc.
  pages/        Home, Shop, ProductDetail, Cart, About, Contact, NotFound
  data/         products.js — your full product catalog
  context/      CartContext.jsx — cart state + WhatsApp number + message builder
public/
  products/     Product images (replace with real photos)
```

## Pages included

- **Home** — hero, category strip, promo banners, trending products
- **Shop** (`/shop`, `/shop/:category`) — full catalog with category filter + sort
- **Product detail** (`/product/:id`) — size/color selection, add to cart, buy now, WhatsApp order
- **Cart** (`/cart`) — order summary + WhatsApp checkout
- **About** (`/about`) — brand story
- **Contact** (`/contact`) — contact info + WhatsApp-powered contact form

## Notes

- Cart state is in-memory only (resets on page reload) since this is a static
  site with no backend or database. If you later want it to persist between
  visits, that needs either browser storage or a backend — happy to help with
  either when you're ready.
- All "Add to Cart" / "Buy Now" / WhatsApp buttons require a size and color to
  be selected first.
