# VELOUR — Master Implementation Plan (SRS.md Alignment)

This document outlines the step-by-step master plan to restructure and optimize **VELOUR** into a premier luxury Pakistani apparel e-commerce platform according to [SRS.md](file:///c:/Users/HP/Desktop/velour/SRS.md).

---

## Strategic Direction & Agreed Parameters
- **Catalog Scope:** Modern Luxury Pakistani Apparel (Ready-to-Wear, Unstitched Lawn/Khaddar with box breakdown & optional stitching, Festive/Formal & Bridal, and Men's Kurtas & Waistcoats).
- **Primary Currency:** **PKR only** (formatted as `Rs. 12,500`), domestic Pakistan market focus.
- **Performance Targets:** LCP < 2.5s on mobile 4G, CLS < 0.1, INP < 200ms, WCAG 2.2 AA compliant.
- **Workflow:** Execute phase by phase. Each phase will be implemented, verified against test criteria, and reviewed before proceeding to the next.

---

## Phase Overview & Progress Tracker

| Phase | Description | Focus Areas | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Foundation, Currency & Global UI Chromes** | PKR format, Announcement Bar, Auto-hide Navbar, Mega Menu, Roman Urdu Search, Mini-Bag Drawer, Wishlist, WhatsApp widget | **Completed & Verified** |
| **Phase 2** | **Pakistani Catalog, Faceted Filters & Listing Grid** | Luxury data seed, 4:5 aspect ratio cards, Fabric/Occasion/Piece-count filters, Mobile bottom sheet, Scroll restoration | **Completed & Verified** |
| **Phase 3** | **High-Conversion PDP & Customizer** | 60/40 gallery + sticky buy box, Size guide (cm/in), City delivery estimator, Unstitched box contents, Stitching service, Sticky mobile bar | **Completed & Verified** |
| **Phase 4** | **Phone-First Checkout, COD Verification & Tracking** | +92 validation, Courier city mapping, COD with OTP/WhatsApp confirmation, JazzCash/Easypaisa/Card UI, Branded tracking | **Completed & Verified** |
| **Phase 5** | **12 Homepage Modules, Brand Storytelling & CWV Audit** | 12 editorial modules, Lookbook hotspots, Craft & Fabric pages, Bridal booking, Core Web Vitals optimization | **Completed & Verified** |
| **Phase 6** | **Customer Care Suite, Bag Upgrades & Asset Hardening** | Cart free delivery meter, promo voucher engine, gift box, `/shipping`, `/exchanges`, `/faqs`, footer polish | **Completed & Verified** |

---

## Detailed Phase Breakdown

### Phase 1: Foundation, Currency & Global UI Chromes (Storefront Shell)
**Objective:** Transform the store foundation, currency engine, header navigation, quick-cart, and global micro-interactions to meet luxury standards.

- [x] **1.1 Currency & Formatting Engine (`lib/format.ts`)**
  - Implement clean Pakistani Rupee formatting: `Rs. 12,500` (no trailing decimals for whole amounts, proper thousands grouping).
  - Add free shipping calculation helper (Default threshold: `Rs. 5,000`).
- [x] **1.2 Rotating Announcement Bar (`components/AnnouncementBar.tsx`)**
  - 3 rotating messages (Free shipping threshold, COD nationwide availability, Express courier dispatch).
  - 5-second interval, pause on hover, accessible polite live region, 34px height.
- [x] **1.3 Auto-Hiding Header & Luxury Mega Menu (`components/Navbar.tsx`)**
  - Auto-hide on scroll down, smooth reveal on scroll up.
  - Multi-column Mega Menu:
    - **Women:** Ready to Wear (Kurtas, Co-ords, Formal), Unstitched (Lawn, Chiffon, Khaddar), Festive & Wedding.
    - **Men:** Kurtas, Shalwar Kameez, Waistcoats, Sherwanis.
    - **Occasions:** Everyday, Workwear, Festive, Wedding Guest.
    - **Fabrics:** Pure Lawn, Chiffon, Raw Silk, Organza, Velvet, Khaddar.
    - Editorial campaign visual tile.
  - Wishlist count icon + Animated Bag count badge.
- [x] **1.4 Predictive Roman Urdu Search (`components/Navbar.tsx` & search overlay)**
  - Synonym dictionary mapping Roman Urdu terms (`kurta`, `lawn`, `dupatta`, `shalwar`, `3-piece`, `festive`, `co-ord`, `chikankari`) to product attributes.
  - Empty state with recent searches and trending tags.
- [x] **1.5 Mini-Bag Slide-In Drawer (`components/MiniBagDrawer.tsx`)**
  - Smooth right-side drawer trigger on "Add to Bag".
  - Dynamic free shipping meter in PKR (*"Add Rs. 1,500 more for Free Delivery"*).
  - Quantity steppers, size indicator, direct checkout link.
- [x] **1.6 Persistent Guest Wishlist System (`lib/wishlist.tsx`, `components/WishlistDrawer.tsx`)**
  - LocalStorage-backed guest wishlist with header counter and heart buttons.
- [x] **1.7 Floating WhatsApp Helper (`components/FloatingWhatsApp.tsx`)**
  - Fixed bottom-right badge with store hours indicator (Online/Offline) and prefilled product context.

**Phase 1 Verification Checklist:**
- [x] All prices display as `Rs. X,XXX`.
- [x] Announcement bar rotates every 5s and pauses on hover.
- [x] Header auto-hides on scroll down and reveals on scroll up.
- [x] Mega menu works on desktop and mobile drawer.
- [x] Adding an item opens the Mini-Bag drawer with the free-shipping progress meter.
- [x] Wishlist hearts toggle and persist items across browser refresh.
- [x] Production build (`npm run build`) succeeded with 0 errors across all 23 routes.

---

### Phase 2: Pakistani Luxury Catalog, Faceted Filters & Listing Grid
**Objective:** Replace generic western inventory with high-end Pakistani luxury apparel and provide deep filtering capabilities.

- [x] **2.1 Product Data Model Expansion (`lib/types.ts`)**
  - Added attributes: `fabric`, `pieceCount` ("1-Piece", "2-Piece", "3-Piece"), `workType` (Embroidered, Digital Print, Solid, Hand Embellished), `occasion`, `unstitchedDetails` (shirt, dupatta, trouser meters), `stitchingAvailable`, `stitchingFee`, `modelInfo`.
- [x] **2.2 Luxury Seed Catalog (`lib/data.ts`)**
  - Curated collection of Ready-to-Wear kurtas, 3-Piece unstitched luxury lawn, festive formal velvet/organza, and men's kurtas/waistcoats/sherwanis in PKR prices (Rs. 6,800 to Rs. 42,000).
- [x] **2.3 Luxury Product Card (`components/ProductCard.tsx`)**
  - 4:5 image ratio, second image on hover, wishlist toggle, single prioritized luxury badge (Sale, New In, Bestseller), PKR pricing with compare-at strikethrough, piece-count and fabric subtitle.
- [x] **2.4 Deep Facet Filters & Sticky Toolbar (`components/ProductFilters.tsx`, `components/ListingView.tsx`, `components/ListingPage.tsx`)**
  - Sticky toolbar with filter trigger button with active count badge, active chips row with single-click remove and "Clear All", and luxury sort dropdown.
  - Deep filters: Fabric (Pure Lawn, Raw Silk, Chiffon, Velvet, Khaddar, Organza), Piece Count (1-Piece, 2-Piece, 3-Piece), Occasion (Everyday, Workwear, Festive, Wedding Guest, Bridal), Size (XS, S, M, L, XL, Unstitched), Price Range in PKR with quick presets, In-Stock Only.
  - Mobile bottom-sheet / Desktop side drawer with live "Show N Pieces" sticky CTA.
  - Column grid density switcher (desktop 2, 3, or 4 columns; mobile 2 columns).
- [x] **2.5 Load More & Scroll Position Retention (`components/ListingView.tsx`)**
  - Paginated progressive loading with progress bar ("Showing 8 of 14 pieces").
  - Dedicated listing routes for `/unstitched` and `/festive` with bespoke category editorial metadata.

**Phase 2 Verification Checklist:**
- [x] Pakistani product collections render with rich photography and details.
- [x] Filtering by Fabric (e.g., Lawn, Velvet) or Piece Count immediately filters the grid.
- [x] Mobile filter drawer opens smoothly and applies filters.
- [x] Grid column toggle switches between layout densities (2, 3, 4 columns).
- [x] Production build (`npm run build`) succeeded with 0 errors across all 23 routes.

---

### Phase 3: High-Conversion Product Detail Page (PDP) & Customizer
**Objective:** Deliver an editorial, information-dense PDP tuned for Pakistani apparel buying behavior.

- [x] **3.1 60/40 Desktop Split Gallery & Sticky Buy Box (`components/ProductDetail.tsx`)**
  - Vertical multi-shot gallery (front, back, embroidery detail, fabric close-up) with click zoom.
  - Sticky right buy box with price in PKR, low-stock alerts, out-of-stock strike-through + "Notify Me".
- [x] **3.2 Interactive Size Guide Drawer (`components/SizeGuideDrawer.tsx`)**
  - Tabbed measurements in both **cm** and **inches**.
  - How to measure illustration and model stats (height, size worn).
- [x] **3.3 City Delivery Estimator & COD Badge (`components/CityDeliveryEstimator.tsx`)**
  - City selector (Karachi 1-2 days, Lahore/Islamabad 2-3 days, rest of Pakistan 3-5 days).
  - Cash on Delivery availability indicator.
- [x] **3.4 Unstitched Garment Breakdown Accordion (`components/UnstitchedBreakdown.tsx`)**
  - "What is in the box" specification (Shirt length, Dupatta length, Trouser length in meters).
- [x] **3.5 Stitching Service Configurator (`components/StitchingConfigurator.tsx`)**
  - Optional Stitching service selection (Standard Stitched / Custom Size) with pricing (+Rs. 2,800 / +Rs. 3,800) and delivery lead time (+5 days).
- [x] **3.6 Cross-Sell & Discovery Modules (`components/ProductDetail.tsx`, `app/product/[id]/page.tsx`)**
  - "Complete the Look" bundle suggestions and "You May Also Like".
- [x] **3.7 Mobile Sticky Bottom Bar (`components/StickyMobileBuyBar.tsx`)**
  - Fixed bottom Add to Bag bar when the main button scrolls out of viewport.
- [x] **3.8 JSON-LD Structured Data (`app/product/[id]/page.tsx`)**
  - Schema.org Product, Offer, BreadcrumbList for Google Search rich results.

**Phase 3 Verification Checklist:**
- [x] Buy box stays sticky on desktop as user scrolls gallery.
- [x] Size guide drawer opens and toggles between cm and inches without layout shift.
- [x] Changing city updates delivery transit estimates dynamically.
- [x] Unstitched box details and stitching service calculation work accurately.
- [x] Sticky bottom bar triggers reliably on mobile viewports.
- [x] All PDP pages compile cleanly and return HTTP 200 OK.

---

### Phase 4: Localized Checkout, COD Verification & Logistics
**Objective:** Build a friction-free checkout tailored for Pakistan's payment and courier landscape.

- [x] **4.1 Phone-First Contact & Address Form (`components/CheckoutPage.tsx`, `lib/logistics.ts`)**
  - Mobile number first with Pakistan validation (`+92` / `03XX-XXXXXXX`) and automatic mobile carrier detection (Jazz, Telenor, Zong, Ufone).
  - Province & Pakistani City master dropdown mapped to courier coverage (TCS, Leopards, PostEx).
  - Sector/Area and Nearest Landmark field (vital for courier dispatch).
  - Home vs Office address type selector.
- [x] **4.2 Pakistani Payment Suite (`components/CheckoutPage.tsx`)**
  - Cash on Delivery (COD) with verification notice and Rs. 40,000 threshold check.
  - Credit & Debit Cards (Visa, Mastercard, PayPak, UnionPay with 3D Secure simulation).
  - Mobile Wallets (JazzCash & Easypaisa phone prompt with instant verification).
  - State Bank Raast Instant IBAN payment with QR / account title copy.
  - Direct Bank Transfer (Meezan Bank) with transfer receipt upload to InsForge storage.
  - Prepaid incentive banner: *"Pay via Card/Raast for Priority Dispatch & Free Keepsake Garment Bag"*.
- [x] **4.3 COD Verification & Anti-RTO Step (`components/CodVerificationModal.tsx`)**
  - Interactive OTP / WhatsApp confirmation dialog before final COD dispatch commitment.
  - 4-digit code input, 45s countdown timer, and 1-click WhatsApp verification.
- [x] **4.4 Idempotent Order Placement & Local Storage Persistence**
  - Order button debounce, loading state, InsForge database storage + local storage fallback for immediate tracking.
- [x] **4.5 Branded Order Tracking Page (`app/track/page.tsx`, `components/OrderTrackingView.tsx`)**
  - Live milestone timeline: Order Placed -> COD Verified -> Quality Check & Luxury Packing -> Dispatched via Courier -> Out for Delivery.
  - Courier assignment (TCS, Leopards, PostEx) with authentic AWB tracking number.
  - WhatsApp delivery alerts opt-in toggle.
  - Accessible via `/track` and from Announcement Bar & Mini-Bag drawer.

**Phase 4 Verification Checklist:**
- [x] Phone number input validates Pakistan formats (`0300 1234567` or `+92 3XX-XXXXXXX`).
- [x] City selector updates assigned courier and estimated transit days dynamically.
- [x] COD verification modal pops up for COD orders and verifies via code or 1-click WhatsApp.
- [x] Order placement creates order with AWB tracking number and renders confirmation screen.
- [x] `/track` and `/track?ref=...` load order status and 5-stage timeline with HTTP 200 OK.
- [x] All routes compile cleanly and return HTTP 200 OK.

---

### Phase 5: 12 Homepage Modules, Brand Storytelling & CWV Audit
**Objective:** Bring the full editorial brand to life on the homepage and brand pages, and ensure Core Web Vitals excellence.

- [x] **5.1 12 Homepage Modules Assembly (`app/page.tsx`)**
  1. Full-bleed editorial Hero with muted video/poster
  2. Category entry tiles (RTW, Unstitched, Festive, Menswear)
  3. Featured pieces (Editor's selection in PKR)
  4. Seasonal campaign banner (The Festive Soirée — Raw Silk & Velvet)
  5. Interactive Lookbook (`LookbookHotspots.tsx`) with clickable glowing pins & instant bag addition
  6. Just Landed new arrivals peek grid
  7. Craft Heritage & Karigars module (`CraftHeritageModule.tsx` — 48+ hours hand-needlework in Multan & Lahore)
  8. Most Wanted trending ensembles across Pakistan
  9. Textile & Fabric glossary strip (`FabricEducationStrip.tsx` — Pure Lawn, Raw Silk, Chiffon, Micro-Velvet)
  10. Bridal & Bespoke Trousseau concierge banner (`BridalConciergeBanner.tsx` with WhatsApp connect)
  11. Real-client styling community gallery (`CommunityGallery.tsx` — #VelourWomen across Karachi, Lahore & Islamabad)
  12. VIP Newsletter with first-order privilege & WhatsApp concierge CTA
- [x] **5.2 Editorial Brand Pages**
  - `/about`: Enriched with authentic Pakistani heritage, karigar guild story, handloom clusters, and ethical fair-wage commitment.
  - `/contact`: Upgraded with Karachi (DHA Phase 6) & Lahore (M.M. Alam Road) flagship salons, WhatsApp concierge, and interactive salon appointment booking form.
  - `/privacy`: Domestic data protection policy detailing Pakistani mobile validation, courier transmission, and zero card retention.
- [x] **5.3 Performance & Accessibility Audit (SRS §11)**
  - LCP optimized with proper image priorities and static asset serving.
  - CLS stabilized with uniform 4:5 image containers and aspect-ratio wrappers.
  - Build succeeds with 0 errors across all 24 routes.

**Phase 5 Verification Checklist:**
- [x] All 12 homepage modules render with luxury restraint and smooth scroll reveals.
- [x] Lookbook hotspots open interactive product cards with quick add to bag.
- [x] Craft, Fabric Guide, About, and Bridal Appointment pages compile and return HTTP 200 OK.
- [x] Dev server opens cleanly on port 3000 with zero collisions and zero runtime errors.

---

### Phase 6: Customer Care Suite, Bag Upgrades & Asset Hardening (SRS §7.5, §7.11)
**Objective:** Deliver an uncompromised client care experience, shopping bag utilities, and eliminate broken asset dependencies.

- [x] **6.1 Enhanced Shopping Bag & Promo Engine (`components/CartPage.tsx`)**
  - Dynamic Free Delivery progress meter in PKR (`Rs. 5,000` threshold) with motivational milestone banner.
  - Destination city transit selector with real-time delivery estimates.
  - Interactive voucher system (`VELOUR10` for 10% off, `EID2026` for Rs. 1,500 off, `FIRST1000` for Rs. 1,000 off).
  - Keepsake Luxury Gift Box Option (+Rs. 450) with customizable handwritten calligraphy message card.
  - Move-to-wishlist and quantity steppers with live subtotal/total recalculation.
- [x] **6.2 Customer Care Suite (`app/shipping/page.tsx`, `app/exchanges/page.tsx`, `app/faqs/page.tsx`)**
  - `/shipping`: City transit table, delivery timelines, COD thresholds, courier partners (TCS, Leopards, PostEx).
  - `/exchanges`: 14-day domestic exchange window, eligible vs excluded items, reverse courier pickup booking.
  - `/faqs`: Grouped accordion topics (Orders & Delivery, Sizing & Stitching, Payments & COD, Fabric Care) + search filter.
- [x] **6.3 Comprehensive Luxury Footer (`components/Footer.tsx`)**
  - Updated collection links, customer care navigation, domestic logistics partner badge, and verified Pakistani payment rails.
- [x] **6.4 Image Asset Hardening**
  - Verified all product image references across catalog, lookbook, community gallery, and PDP point to existing high-resolution files in `public/images/products/`, eliminating 404 image errors.

**Phase 6 Verification Checklist:**
- [x] Cart page dynamically recalculates totals, validates promo codes, and toggles luxury gift wrapping.
- [x] `/shipping`, `/exchanges`, and `/faqs` routes compile and return HTTP 200 OK.
- [x] Footer navigation links properly connect to all active customer care pages.
- [x] Server logs confirm zero missing image 404 warnings across all routes.

