# VELOUR — Premium Minimal Fashion eCommerce

VELOUR is a modern, high-end fashion storefront for **men's and women's apparel**, with the visual aesthetic and editorial simplicity of luxury fashion houses and modern retailers such as Zara, Toteme, and The Row.

Built collaboratively following a **four-agent software-development architecture**:
1. **Agent 1:** Product Architecture, Requirements & Data System
2. **Agent 2:** Commerce Logic, Catalog Data & Application Services
3. **Agent 3:** Premium Fashion UI / UX Implementation
4. **Agent 4:** Integration, Testing, QA & Release

---

## Technology Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript 5.7
* **Library:** React 19
* **Styling:** Custom CSS design system with CSS custom properties (Strictly **No Tailwind**)
* **Typography:** Cormorant Garamond (editorial display) & Inter (clean UI sans-serif) via `next/font/google`
* **State Management:** React Context with `localStorage` persistence and size-differentiated line items
* **Image Delivery:** `next/image` with fallback recovery (`SmartImage`) and Unsplash remote pattern integration

---

## Local Development & Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run listings import script (populates generated-products.ts)
node scripts/import-listings.mjs

# 3. Start development server
npm run dev
```

Visit the storefront in your browser:
**`http://localhost:3000`**

---

## Production Build & Verification

```bash
# Run production build (type checking & static page generation)
npm run build

# Start production server
npm start
```

All 12 routes build with **0 errors**:
- `/` — Editorial Homepage
- `/women` — Women's Collection (with subcategory filtering & sorting)
- `/men` — Men's Collection (with subcategory filtering & sorting)
- `/product/[id]` — Product Detail Page with image gallery & size selector
- `/cart` — Shopping Bag with item management & free shipping calculation
- `/checkout` — Two-column Checkout with client-side validation
- `/login` — Tabbed Sign In / Create Account
- `/about` — Editorial brand philosophy
- `/contact` — Client care & flagship location
- `/privacy` — Privacy declaration
- `/_not-found` — 404 handler

---

## Core Customer Journey

```
Homepage (Hero / Categories / Featured / Trending)
   ↓
Browse Collection (/women or /men)
   ↓
Filter by Subcategory (?sub=dresses) & Sort (?sort=price-asc)
   ↓
Product Detail (/product/[id])
   ↓
Select Size (Mandatory) & Quantity Stepper
   ↓
Add to Bag (Toast Alert + Live Navbar Badge Update)
   ↓
Shopping Bag (/cart)
   ↓
Two-Column Checkout (/checkout)
   ↓
Submit Order
   ↓
Order Confirmation (VL-2026-XXXXX with Item & Destination Summary)
```

---

## Project Structure

```text
app/
  layout.tsx               # Root layout, fonts, Navbar, Footer, StoreProvider
  page.tsx                 # Editorial Homepage
  globals.css              # VELOUR design system & responsive styling
  women/page.tsx           # Women's collection route
  men/page.tsx             # Men's collection route
  product/[id]/page.tsx    # Dynamic product detail page with related items
  cart/page.tsx            # Shopping cart route
  checkout/page.tsx        # Checkout and order confirmation route
  login/page.tsx           # Tabbed sign-in / registration
  about/page.tsx           # About VELOUR
  contact/page.tsx         # Customer Care contact
  privacy/page.tsx         # Privacy policy
  not-found.tsx            # Custom 404 page

components/
  Navbar.tsx               # Header with announcement bar, search overlay, drawer
  Hero.tsx                 # Editorial crossfade hero with brand title
  ProductCard.tsx          # Card with secondary image hover swap & badges
  ProductDetail.tsx        # Gallery, required size selector, quantity stepper
  CartPage.tsx             # Cart management, item count, free shipping meter
  CheckoutPage.tsx         # 2-column checkout form & order confirmation
  ListingPage.tsx          # Catalog listing, subcategory pills & sorting
  LoginPage.tsx            # Auth UI with tabs
  Footer.tsx               # Four-column footer with social links
  SmartImage.tsx           # Resilient next/image wrapper with error fallback
  SortSelect.tsx           # URL-synchronized sort dropdown
  Newsletter.tsx           # Luxury newsletter subscription banner
  ScrollReveal.tsx         # IntersectionObserver fade-up animation wrapper
  Icons.tsx                # Lightweight inline SVG icon collection

lib/
  types.ts                 # Product, CartItem, Order, CustomerInfo interfaces
  data.ts                  # 24 canonical products & subcategory hierarchies
  generated-products.ts    # Pipeline output from CSV importer
  api.ts                   # Asynchronous product service layer boundary
  store.tsx                # CartContext, toast stack & localStorage sync
  format.ts                # money() currency helper

scripts/
  import-listings.mjs      # CSV parser and product generator
  prepare-hero-video.mjs   # Hero video transcoder (ffmpeg) + poster frame

incoming/
  listings-template.csv    # CSV listing template
  README.md                # Ingestion instructions
  images/                  # Product imagery drop folder
  videos/                  # Hero background video drop folder
```

---

## Product Data Pipeline

To add or update product inventory from CSV:

1. Edit or append entries to `incoming/listings-template.csv`.
2. Place referenced photos into `incoming/images/`.
3. Run:
   ```bash
   node scripts/import-listings.mjs
   ```
4. `lib/generated-products.ts` is regenerated and merged automatically into the service layer.

---

## Hero Background Video

The homepage hero plays a background video when one exists, and otherwise falls back
to an auto-rotating crossfade of local product images.

1. Drop any video file (mp4 / mov / webm / …) into `incoming/videos/`.
2. Run `npm run prepare:hero` (requires `ffmpeg` on your PATH).
   It transcodes to `public/videos/hero.mp4` (1080p H.264, no audio, faststart)
   and writes a poster frame to `public/images/hero-poster.jpg`.
   If `ffmpeg` is not installed the file is copied as-is with a warning.
3. Restart/rebuild the app — the hero switches to the muted, autoplaying video
   with the poster as its loading fallback.

---

## Design System & Aesthetics

* **Palette:**
  * Background: `#faf8f5` (warm editorial off-white)
  * Primary Text: `#16130f` (deep ink)
  * Secondary Text: `#3a352f` & `#8a8178`
  * Borders & Lines: `#e5e0da` (subtle hairline)
  * Pure White: `#ffffff`
* **Typography:**
  * Serif (Display & Headlines): `Cormorant Garamond`
  * Sans (Body & Controls): `Inter`
* **Responsive Breakpoints:**
  * Desktop (>1024px): 4-column product grid, full horizontal navigation
  * Tablet (820px–1024px): 2-column product grid, compact layout
  * Mobile (<820px): Single-column product grid, slide-in navigation drawer, stacked checkout
* **Simulated Checkout:**
  * Order numbers follow format `VL-2026-XXXXX`.
  * Dummy card inputs for UI demonstration only; no real payment processing or storage.
