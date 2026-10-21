# Requirements Specification: Premium E-commerce Clothing Website (Pakistan)

Prepared for: \[Brand Name\] | Version 1.0 | 14 October 2026 | Status: Draft for review

## 1. Purpose, Scope and How to Use This Document

**Purpose.** This document defines everything a premium or luxury-positioned clothing e-commerce website in Pakistan should contain: UI elements, page layouts, frontend behaviour, backend systems, admin tools, integrations and non-functional requirements. It is written so that designers can build mockups from Sections 5 to 7, developers can estimate and build from Sections 8 to 11, and you can audit your existing website against it using the checklist in Section 14.

**Suggested workflow for improving your current site.**

1. Open your live site next to Sections 6 and 7 and mark every requirement as Present, Partial or Missing.
2. Use the priority tags to decide what to fix first (Section 13 gives a phased roadmap).
3. Hand Sections 6 and 7 plus the design tokens in Section 12 to your designer for mockups.
4. Hand Sections 8 to 11 to your developers or agency for estimation.

**Priority legend.** M = Must have (launch blocker), S = Should have (first release after launch), C = Could have (later enhancement). Requirement IDs use prefixes: UI (interface), FR (functional), BE (backend), NFR (non-functional).

**Assumptions.** Single-brand direct-to-consumer store; primary currency PKR; nationwide delivery in Pakistan with optional international shipping; catalogue includes ready-to-wear, unstitched fabric (lawn, cotton, winter, khaddar), formal and bridal, menswear, kids and accessories; the current platform is not fixed (see Section 8.1 for options).

**A note on the benchmark.** The analysis in Section 3 reflects patterns visible on these sites and my knowledge of them. Fashion sites redesign often, so capture fresh screenshots of each benchmark before finalising mockups. Pakistan-specific payment and courier details in Section 9 were checked against current sources in October 2026, but confirm commercial terms directly with each provider.

## 2. Business Goals and Success Metrics

| Goal | Metric | Suggested target (to be agreed) |
| --- | --- | --- |
| Elevate brand perception | Brand search volume, time on site, editorial page views | Rising quarter on quarter |
| Increase mobile conversion | Mobile conversion rate | 1.5 to 2.5 percent |
| Increase average order value | AOV, items per order | Plus 15 percent via bundles, complete-the-look, free-shipping threshold |
| Reduce failed deliveries and returns | RTO (return to origin) rate for COD, return rate | Set baseline, then reduce by a third |
| Grow prepaid share | Share of orders paid online | Set baseline, grow steadily with incentives |
| Improve speed | Largest Contentful Paint on 4G mobile | Under 2.5 seconds |
| Retain customers | Repeat purchase rate, account creation rate | Rising quarter on quarter |

## 3. Benchmark Analysis

### 3.1 Benchmark set

| Group | Sites to study | What to learn from them |
| --- | --- | --- |
| Pakistani market leaders | Khaadi, Sapphire, Maria B., Gul Ahmed, Alkaram Studio, Ethnic, Bonanza Satrangi, Sana Safinaz, Nishat Linen, Cross Stitch | Seasonal drop structure, stitched vs unstitched toggle, sale mechanics, COD flows, store locators, collection naming, Eid and wedding campaigns |
| Pakistani luxury and couture | Elan, Asim Jofa, Faraz Manan, Zara Shahjahan, Sania Maskatiya | Bridal and formal presentation, appointment booking, lookbooks, WhatsApp consultation |
| Global luxury maisons | Gucci, Burberry, Louis Vuitton, Saint Laurent, Bottega Veneta, Loro Piana | Editorial restraint, full-bleed imagery, typography, white space, clienteling, motion |
| Global premium retailers | Net-a-Porter, Mytheresa, SSENSE, Farfetch | Filtering depth, product page structure, size guidance, delivery messaging, wishlist, styling suggestions |
| Contemporary premium DTC | COS, Massimo Dutti, Reiss, Zara, Aritzia, Reformation | Clean PDP, fit and fabric information, sustainability storytelling, fast checkout |
| South Asian heritage brands | Sabyasachi, Ritu Kumar, FabIndia, Anita Dongre | Craft storytelling, occasion-based navigation, heritage and artisan pages |

### 3.2 Pattern analysis: what the best sites do

| Area | Best-in-class pattern | Requirement for your site |
| --- | --- | --- |
| Homepage | One dominant hero, then 4 to 6 curated modules; heavy use of editorial imagery; very little promotional clutter on luxury sites | Maximum one promotional banner above the fold; rest is editorial and curated |
| Navigation | Mega menu with image tiles; occasion and fabric entry points; persistent search | Mega menu with Shop by Category, Occasion, Fabric and a featured visual |
| Listing page | Sticky filter bar, 2 to 4 column grid, second image on hover, quick colour swatches, product count, infinite scroll or Load More with position retention | Filters including size availability, colour, fabric, price, occasion, piece count; hover image swap |
| Product page | Large vertical gallery with zoom, sticky buy box, clear size selector with out-of-stock states, accordions for details, complete-the-look, recently viewed | Full PDP spec in Section 7.3 |
| Size and fit | Model height and size worn, size guide in a drawer, fit notes, some brands offer size recommendation | Model stats on every product, interactive size guide with cm and inches, optional size finder |
| Delivery messaging | Estimated delivery date shown on the PDP and cart; shipping threshold progress bar | City-based delivery estimate, COD availability indicator, free-shipping progress bar |
| Checkout | Guest checkout, express payment, address autocomplete, order summary always visible, minimal fields | Single-page or two-step checkout, phone-first identity, COD verification (Section 9) |
| Account | Orders, returns self-service, wishlist, saved addresses, loyalty tier | Full account area in Section 7.7 |
| Post-purchase | Order tracking page, email and SMS and WhatsApp updates, easy return initiation | Branded tracking page with courier status, WhatsApp notifications |
| Clienteling | Book an appointment, chat with a stylist, private sales | WhatsApp consultation, book a store or virtual appointment |
| Storytelling | Craft, fabric and artisan pages, journal, campaign films | Journal, Craft and Fabric pages, campaign lookbooks |

### 3.3 Common weaknesses on regional fashion sites (opportunities for you)

- Stacked popups (newsletter, WhatsApp, discount spinner, cookie) that appear before the visitor has seen a product.
- Homepages dominated by sale banners, which weakens premium positioning.
- Inconsistent product photography, with different crops and backgrounds across a collection.
- Heavy, unoptimised images that slow mobile pages on 4G.
- Weak filtering: no size-availability filter, inconsistent colour names, no fabric or occasion filter.
- Unstitched products that do not clearly state what is in the box (shirt, dupatta, trouser, lengths in metres) or whether stitching is offered.
- Basic size guides without measurement instructions or model measurements.
- Cash on delivery with no verification, leading to high return-to-origin rates.
- Order tracking that only redirects to a courier website.
- English-only interface and no consideration for overseas Pakistani shoppers (currency, duties, delivery time).
- Thin accessibility: low contrast text on images, no keyboard navigation, missing alt text.

## 4. Users, Personas and Journeys

| Persona | Profile | Key needs |
| --- | --- | --- |
| Urban professional | Woman, 25 to 40, shops mainly on mobile, discovers via Instagram | Fast browsing, reliable sizing, quick checkout, Instagram-consistent visuals |
| Occasion and bridal shopper | Buying for weddings, Eid, formals; high order value, often with family input | Detailed craftsmanship info, consultation, shareable wishlist, made-to-order options, WhatsApp support |
| Overseas Pakistani | UK, US, UAE, Canada, Saudi Arabia; seasonal bulk buyer | International shipping, foreign currency, duties clarity, delivery time estimates |
| Menswear and gift buyer | Buys kurtas, waistcoats, sherwanis, or gifts for family | Simple navigation, gift options, gift cards, size help |
| Internal team | Merchandiser, content editor, customer support, warehouse, marketing | Easy product upload, bulk edits, order management, reporting |

**Primary journeys to design and test:**

1. Discover via Instagram, land on a product, choose size, add to bag, pay by card or wallet.
2. Browse a new collection, filter by size and price, save favourites, return later and buy.
3. Choose unstitched fabric, understand the contents, optionally add stitching service.
4. Place a COD order, confirm by WhatsApp or OTP, track delivery, request exchange.
5. Overseas customer selects country, sees duties and delivery time, pays in foreign currency.

## 5. Information Architecture

### 5.1 Sitemap

- **Home**
- **Women**: New In, Ready to Wear (Kurtas, Co-ords, Dresses, Tops, Trousers and Pants, Shalwar, Dupattas and Shawls), Unstitched (Lawn, Cotton, Cambric, Khaddar, Winter, Silk and Chiffon), Formal and Festive, Bridal, Western Wear, Loungewear, Accessories, Fragrance and Beauty (optional)
- **Men**: New In, Kurtas, Shalwar Kameez, Waistcoats, Sherwanis, Shirts, Trousers, Winter Wear, Accessories
- **Kids**: Girls, Boys, Infants
- **Collections**: Current season, Eid Edit, Wedding Edit, Summer Lawn, Winter Collection, Capsule drops
- **Shop by Occasion**: Everyday, Work, Eid, Wedding Guest, Festive, Bridal
- **Sale**
- **Journal** (editorial, styling guides, lookbooks, craft stories)
- **Our Story**: Brand, Craft and Artisans, Fabric Guide, Sustainability, Press
- **Stores**: Store Locator, Book an Appointment
- **Customer Care**: Shipping and Delivery, Returns and Exchanges, Size Guide, Track Order, FAQs, Contact, Care Instructions, Gift Cards
- **Account**: Login and Register, Dashboard, Orders, Returns, Wishlist, Addresses, Measurements, Loyalty, Preferences
- **Cart and Checkout**: Cart, Checkout, Order Confirmation
- **Legal**: Privacy Policy, Terms of Service, Cookie Policy, Return Policy

### 5.2 URL structure (SEO-friendly)

- Categories: /women/ready-to-wear/kurtas
- Products: /products/embroidered-lawn-3-piece-ivory (stable slug, no IDs in URL)
- Collections: /collections/eid-edit-2026
- Journal: /journal/how-to-style-a-festive-kurta
- Rules: lowercase, hyphens, no duplicate paths, canonical tags on filtered URLs, 301 redirects when slugs change.

## 6. Global UI Elements (appear on every page)

### 6.1 Announcement bar

- UI-G-01 (M) Single line, 32 to 40px high, up to three rotating messages (free shipping threshold, dispatch cut-off before Eid, online payment benefit).
- UI-G-02 (M) Pause on hover, rotate every 5 seconds, readable by screen readers (polite live region).
- UI-G-03 (S) Admin-schedulable by date and by region (domestic vs international).

### 6.2 Header

| Element | Desktop | Mobile |
| --- | --- | --- |
| Logo | Centred or left, links to home, SVG | Centred |
| Primary navigation | Women, Men, Kids, Unstitched, Bridal and Formal, New In, Sale, Journal, Stores | Hamburger drawer with drill-down panels |
| Utilities | Search, Account, Wishlist with count, Bag with count, Region and currency | Search and Bag icons on right; Wishlist and Account inside menu or bottom bar |
| Height | 72 to 88px | 56 to 64px |

- UI-G-04 (M) Transparent over the hero on the homepage, solid on scroll; hides on scroll down and returns on scroll up.
- UI-G-05 (S) Mobile bottom tab bar (Home, Shop, Search, Wishlist, Account) with safe-area padding.
- UI-G-06 (M) Bag icon shows live count and animates when an item is added.

### 6.3 Mega menu

- UI-G-07 (M) Opens on hover with a 150ms intent delay and on keyboard focus; closes on Escape.
- UI-G-08 (M) Columns: Shop by Category, Shop by Occasion, Shop by Fabric, and 1 to 2 editorial image tiles linking to the current campaign.
- UI-G-09 (M) Mobile: full-screen drawer, accordion or drill-down with back button, large tap targets (minimum 44px), featured image tiles at the top.
- UI-G-10 (S) Last row shows New In and Sale with distinct styling.

### 6.4 Search

- UI-G-11 (M) Full-width overlay or expanding bar; focus placed in the input on open.
- UI-G-12 (M) Autocomplete after 2 characters showing categories, collections and product cards (thumbnail, name, price).
- UI-G-13 (M) Empty state shows recent searches and trending searches.
- UI-G-14 (M) Typo tolerance and synonyms covering English, Urdu terms written in Roman script, and local terms (kurta, kameez, shalwar, dupatta, lawn, 3-piece, co-ord, sherwani).
- UI-G-15 (M) No-results page with suggestions, popular categories and a contact option.
- UI-G-16 (C) Visual search or voice search.

### 6.5 Mini bag drawer

- UI-G-17 (M) Slides in from the right after Add to Bag; lists thumbnail, name, size, colour, quantity stepper, remove, price.
- UI-G-18 (M) Shows subtotal, free-shipping progress bar, primary Checkout button, secondary View Bag link.
- UI-G-19 (S) Recommendations (complete the look), gift note, order note, promo code field.
- UI-G-20 (S) Express payment buttons (wallet or Raast options where supported).

### 6.6 Wishlist

- UI-G-21 (M) Heart icon on every product card and PDP; works for guests (stored locally and merged into the account at login).
- UI-G-22 (S) Back-in-stock and price-drop alerts via email, SMS or WhatsApp.
- UI-G-23 (C) Shareable wishlist link (useful for family choosing wedding outfits).

### 6.7 Region, currency and language

- UI-G-24 (M) Default PKR; selector for international customers (suggested: USD, GBP, AED, CAD, SAR, with country-specific shipping and duties note).
- UI-G-25 (M) Never force-redirect by IP; show a dismissible Ships to prompt for non-Pakistan visitors.
- UI-G-26 (S) Urdu language option with full right-to-left layout (Section 8.6).

### 6.8 Footer

- UI-G-27 (M) Columns: Shop, Customer Care (Shipping and Delivery, Returns and Exchanges, Size Guide, Track Order, FAQs, Contact), Company (Our Story, Craft, Sustainability, Careers, Press), Stores, Legal.
- UI-G-28 (M) Newsletter sign-up (email, optional phone for WhatsApp updates), social icons (Instagram, Facebook, TikTok, YouTube, Pinterest), payment method icons, legal company name and registered address.
- UI-G-29 (M) Helpline number, customer-service hours, and email.

### 6.9 Persistent helpers and overlays

- UI-G-30 (M) WhatsApp button: fixed at bottom right, above mobile safe area, prefilled message containing the current product URL, shows business hours state (online or offline).
- UI-G-31 (M) Cookie and consent banner: required for visitors in the UK and EU (many overseas customers); simple accept, reject, manage choices; must not cover the whole screen.
- UI-G-32 (S) Newsletter popup only after meaningful engagement (for example 45 seconds or two pages), once per session, never on checkout; the inline footer form is the default.
- UI-G-33 (M) Breadcrumbs on category and product pages with structured data.
- UI-G-34 (M) Toast notifications for add to bag, wishlist, errors.
- UI-G-35 (M) Skeleton loaders for grids and PDP; branded 404 and 500 pages with search and popular categories.
- UI-G-36 (S) Back-to-top button, smooth scroll restoration when returning from a product to a listing.

## 7. Page-by-Page UI Specification

Use this section directly to produce wireframes and mockups. Each page lists its modules in top-to-bottom order.

### 7.1 Homepage

| # | Module | Specification | Priority |
| --- | --- | --- | --- |
| 1 | Hero | Full-bleed image or muted autoplay video with poster image; 80 to 100 percent viewport height on desktop, about 70 percent on mobile; one headline, one subline, one or two CTAs; text contrast overlay; ideally a single hero (maximum three slides, no auto-rotation under 6 seconds) | M |
| 2 | Category entry tiles | Women, Men, Kids, Unstitched, Bridal; large editorial images, label on image, equal sizing | M |
| 3 | New arrivals | Horizontal product carousel, 4 cards desktop, 2.2 cards mobile (peek of the next card), View All link | M |
| 4 | Editorial split banner | 50/50 image and text about the current campaign or collection; CTA to the collection | M |
| 5 | Shop by occasion | Eid, Wedding Guest, Festive, Work, Everyday; tiles or tabs | S |
| 6 | Shop the look | Lookbook image with clickable hotspots opening a mini product card | S |
| 7 | Bestsellers | Product carousel or grid, 8 items | M |
| 8 | Unstitched season module | Highlight fabric (lawn, winter, khaddar), what is in the box, stitching service entry point | M |
| 9 | Craft and heritage band | Artisan photography, short story on embroidery or weaving, link to Craft page | S |
| 10 | Social proof | Shoppable Instagram or customer gallery, press logos, review highlights | S |
| 11 | Trust band | Icons with short text: Nationwide delivery, Easy exchange, Secure payments, COD available, Authentic craftsmanship | M |
| 12 | Store and newsletter | Store locator CTA, newsletter sign-up | M |

**Homepage rules.** Only one promotional (sale) message above the fold. All hero imagery must carry descriptive alt text. Total homepage weight under 2 MB on mobile at first load. Modules must be reorderable from the admin without developer help (BE-CMS-01).

### 7.2 Collection and category listing page

- UI-L-01 (M) Header area: breadcrumb, collection title, short description, optional banner image or video; long SEO text collapsed under Read more at the bottom.
- UI-L-02 (M) Toolbar: Filter button (or left sidebar on desktop), Sort dropdown, product count, grid toggle (desktop 2, 3 or 4 columns; mobile 1 or 2 columns). Toolbar is sticky on scroll.
- UI-L-03 (M) Filters:
  - Size, with in-stock sizes only selectable
  - Colour, shown as swatches using a controlled colour vocabulary
  - Price range in PKR
  - Fabric (lawn, cotton, cambric, khaddar, karandi, silk, chiffon, organza, velvet, wool and others)
  - Piece count (1, 2, 3 piece)
  - Occasion
  - Work type (embroidered, printed, solid, digital print, block print)
  - Availability (ready to ship, made to order, pre-order)
  - Discount (sale only)
  - Collection or season
- UI-L-04 (M) Applied filters appear as removable chips with a Clear all link; filter and sort state is reflected in the URL so pages can be shared and bookmarked.
- UI-L-05 (M) Mobile filters open as a bottom sheet or full-screen panel with a sticky Show N results button.
- UI-L-06 (M) Sort options: Featured (merchandised), New, Best selling, Price low to high, Price high to low, Biggest discount.
- UI-L-07 (M) Pagination: Load More button with a progress line (Showing 24 of 186). Returning from a product page must restore scroll position and loaded items.
- UI-L-08 (S) Editorial tiles inserted into the grid every 8 to 12 products (campaign image or video).
- UI-L-09 (M) Empty state when filters return nothing: message, chips to remove filters, popular alternatives.

**Product card specification.**

| Element | Requirement |
| --- | --- |
| Image | Ratio 3:4 or 4:5, consistent across the whole site; lazy loaded, responsive sizes |
| Hover | Second image (model or back view) on desktop; swipe or dots on mobile optional |
| Wishlist | Heart icon at top right |
| Badges | New, Sale with percentage, Low stock, Bestseller, Made to order; maximum one badge at a time |
| Name | Maximum two lines, sentence case |
| Price | Currency formatting such as Rs. 12,500; original price struck through with sale price when discounted |
| Colour swatches | Up to five swatches then +N; selecting a swatch changes the card image |
| Quick add | Sizes appear on hover (desktop) or via a plus button (mobile) so shoppers can add without opening the page (S) |
| Rating | Star average and count (C) |

### 7.3 Product detail page (PDP)

The PDP drives conversion, so it carries the most detail.

**Layout.** Desktop: gallery on the left (about 60 percent) and a sticky buy box on the right (about 40 percent). Mobile: swipeable gallery, then buy box, then accordions.

**Gallery (M).** 6 to 10 images in a consistent order: front on model, back, side, detail close-up (embroidery, hem, buttons), fabric texture, flat lay, full outfit. Click or hover zoom with lightbox. Short product video of about 10 to 15 seconds where available (S). Mobile shows an image counter or dots. 360-degree view (C).

**Buy box (M).**

- Breadcrumb, product name, SKU, price including applicable taxes, sale price with discount percentage.
- Colour variants as swatches that link to the matching variant page or image set.
- Size selector: button group, unavailable sizes shown struck through with a Notify me option; low stock note only when true (for example Only 2 left).
- Size guide link opening a drawer (see below) and model information (height, size worn).
- Quantity stepper (hidden for made-to-order items if not applicable).
- Primary Add to Bag button, full width in the buy box; secondary wishlist button; share button.
- Delivery estimator: enter city, shows estimated delivery window and whether COD is available.
- Ask about this piece via WhatsApp (prefilled with product link).
- Check store availability (C) if you operate physical stores.
- Buy Now or express wallet buttons (S).

**Information accordions (M).** Description, Details and Composition (fabric, embroidery type, lining, closure), What is in the box, Size and Fit, Care instructions, Delivery and Returns, Craft and authenticity.

**Unstitched-specific requirements (M for unstitched brands).**

- What is in the box table: shirt, dupatta, trouser (and any extras such as embroidered border or sleeves) with length in metres for each, and a clear label such as 3-piece unstitched.
- Optional Add Stitching service: choose a standard size or enter custom measurements, shows added price, added lead time and the return policy for stitched goods.
- Fabric guidance: shrinkage note, wash care.

**Made-to-order and pre-order (S).** Clear lead time on the PDP, in the cart and in the confirmation email; different cancellation rule shown before purchase.

**Size guide drawer (M).** Tabs for women, men, kids; measurements table in both centimetres and inches; How to measure with simple illustrations; fit notes (relaxed, tailored, oversized); conversion to international sizes for overseas buyers. Size finder quiz (height, weight, usual size) is a Could have (C).

**Cross-sell and discovery (M/S).** Complete the Look (outfit pairing, can add multiple items at once), You May Also Like, Recently Viewed.

**Reviews (S).** Verified-buyer reviews with photos, star rating breakdown, fit feedback slider (runs small, true to size, runs large), Questions and Answers (C).

**Mobile sticky bar (M).** When the main Add to Bag button scrolls out of view, show a sticky bottom bar with size selection and Add to Bag.

**Technical (M).** Product structured data (name, image, price, currency, availability, review rating), Open Graph tags for sharing, canonical URL per colour variant policy.

### 7.4 Search results page

- UI-S-01 (M) Heading with the query and result count; Did you mean suggestions.
- UI-S-02 (M) Same filters, sorting and product cards as listing pages.
- UI-S-03 (S) Related content results (Journal articles, collections) in a separate tab.
- UI-S-04 (S) Merchandiser can pin products to a keyword and manage synonyms in admin.

### 7.5 Bag (cart) page

- UI-C-01 (M) Line items: image, name, colour, size, edit size option, quantity stepper, price, remove, Move to wishlist.
- UI-C-02 (M) Order summary: subtotal, discount, estimated shipping (by city), COD fee if applicable, total.
- UI-C-03 (M) Free-shipping progress bar and, if relevant, a complementary add-on suggestion.
- UI-C-04 (M) Promo or gift card code field with clear success and error states.
- UI-C-05 (S) Gift wrap and gift message options; order note.
- UI-C-06 (M) Trust signals under the CTA: secure payment, exchange policy, customer support.
- UI-C-07 (M) Cart persists across devices for logged-in users and for 30 days for guests; items that go out of stock are flagged clearly.
- UI-C-08 (S) Recommended products row.

### 7.6 Checkout

Checkout must be fast on mobile and tuned for Pakistani buying behaviour.

**Structure (M).** Single page with collapsible sections, or two steps (Information and Delivery, then Payment). Order summary stays visible (collapsible on mobile). Guest checkout is the default; account creation is offered after purchase.

**Contact and address fields (M).**

- Full name; mobile number first with Pakistan validation (03XX-XXXXXXX or +92 format); email (required for receipts, but do not block checkout if you prefer phone-first).
- Province, City (select from cities served by your couriers), Area or locality, House and street address, Nearest landmark, Postal code (optional).
- Address autocomplete or map pin (S); address type (home, office).
- Separate billing address toggle; international address formats for overseas orders.

**Delivery options (M).** Standard; Express in selected cities (S); Store pickup (S); each with price and estimated date. Free shipping above a threshold.

**Payment options (M unless marked).**

| Method | Notes |
| --- | --- |
| Debit and credit cards | Visa, Mastercard, UnionPay; use gateway-hosted fields or redirect with 3-D Secure |
| Mobile wallets | JazzCash and Easypaisa via your gateway |
| Raast and bank account payment | Instant account-based payment supported by modern local gateways |
| Google Pay | Where your gateway supports it (S) |
| Cash on delivery | With limits, optional fee and verification (Section 9.3) |
| Manual bank transfer with receipt upload | Optional fallback (C) |
| Buy now, pay later | When a local provider is chosen (C) |

- UI-K-01 (M) Prepaid incentive messaging such as Pay online for priority dispatch (only if commercially approved).
- UI-K-02 (M) Order notes, gift message, and promo code field.
- UI-K-03 (M) Clear inline validation, preserved inputs on error, accessible error summary.
- UI-K-04 (M) Security cues: padlock, accepted payment icons, links to policies; no distracting header navigation during checkout.
- UI-K-05 (M) Place Order button disabled once clicked to prevent duplicates (idempotent order creation, see BE-ORD-02).
- UI-K-06 (S) International checkout shows duties and taxes treatment (included or payable on delivery), delivery time and currency clearly before payment.

### 7.7 Account area

- UI-A-01 (M) Login and register: email plus password, or mobile number with OTP; Continue with Google or Apple (S); forgot password; guest order lookup.
- UI-A-02 (M) Dashboard: greeting, recent orders, quick links.
- UI-A-03 (M) Orders: list with status chips; detail page with items, address, payment, timeline, invoice download, Track and Reorder buttons.
- UI-A-04 (M) Returns and exchanges: self-service request, choose items and reason, upload photos, choose exchange size or refund method, see status.
- UI-A-05 (M) Address book with default addresses.
- UI-A-06 (M) Wishlist page with move to bag, remove, and availability notices.
- UI-A-07 (S) My measurements profile used for stitching and size suggestions.
- UI-A-08 (S) Communication preferences for email, SMS and WhatsApp; unsubscribe links.
- UI-A-09 (C) Loyalty tier, points, birthday perk, early access to drops, gift card balance.
- UI-A-10 (M) Security: change password, delete account and data request.

### 7.8 Order confirmation and tracking

- UI-O-01 (M) Confirmation page: order number, summary, delivery estimate, payment status, next steps, option to create an account, continue shopping.
- UI-O-02 (M) Confirmations by email, SMS and WhatsApp with order summary and support contact.
- UI-O-03 (M) Branded tracking page (accessible without login with order number plus phone or email): timeline of Placed, Confirmed, Packed, Dispatched, Out for delivery, Delivered; courier name, tracking number, expected date; links to start an exchange or contact support.

### 7.9 Editorial and brand pages

| Page | Contents |
| --- | --- |
| Journal list | Featured story, category filters (Style Guides, Behind the Craft, Campaigns, Care), card grid |
| Journal article | Hero image, long-form text, inline shoppable products, related stories, share |
| Our Story | Founder and brand narrative, values, timeline, imagery |
| Craft and Artisans | Techniques such as zari, tilla, dabka, resham, mirror work, block print, ajrak; artisan profiles and regions |
| Fabric Guide | Lawn, cambric, khaddar, karandi, jacquard, organza, chiffon, raw silk, velvet, wool; feel, season, care |
| Lookbooks | Full-bleed sequence with shoppable hotspots |
| Sustainability | Materials, production, packaging, commitments (only claims you can support) |
| Press | Logos and links |

### 7.10 Store locator and appointments

- UI-ST-01 (M) Map and list split view; search by city or use my location; each store shows address, phone, hours, services (alterations, bridal consultation), Get directions link.
- UI-ST-02 (S) Book an appointment form (store, date, time, purpose, phone) with confirmation by WhatsApp or SMS.
- UI-ST-03 (S) Individual store pages for SEO.

### 7.11 Customer care pages

- Shipping and Delivery: coverage, delivery times by city, charges, courier partners, international rules.
- Returns and Exchanges: eligibility window, conditions (unworn, tags attached, stitched or customised items excluded), step-by-step process, refund timelines and methods.
- FAQs: searchable accordion grouped by topic.
- Contact: form, WhatsApp, phone, email, hours, live chat if available.
- Gift cards: purchase flow with amount presets, recipient details and message, delivery by email or WhatsApp, balance check.
- Privacy Policy, Terms, Cookie Policy.

### 7.12 States and edge cases to include in mockups

Designers should produce these variations so the build team has no gaps:

- Loading, skeleton and empty states for grids, bag, wishlist, orders.
- Out of stock, low stock, back-in-stock subscription, pre-order, made-to-order.
- Sale pricing, free shipping reached, promo applied and invalid.
- Long product names, many colour swatches, missing second image.
- Payment failed, payment pending (wallet or Raast awaiting confirmation), address validation error, COD verification pending.
- Mobile at 360px width, tablet, desktop at 1440px and 1920px.
- Right-to-left Urdu layout if Phase 2 is planned.
- Dark mode is optional; high-contrast and focus states are required.

## 8. Frontend Requirements and Platform Choice

### 8.1 Platform options

| Option | Strengths | Risks for Pakistan | Best when |
| --- | --- | --- | --- |
| Shopify (themed or Hydrogen) | Fast to launch, strong checkout, mature app store, good admin | Shopify Payments is generally not available to Pakistani merchants, so you depend on third-party gateway apps; subscription and app costs in USD; some local courier integrations need custom work | You want speed and low maintenance and your gateway has a maintained Shopify app |
| WooCommerce (WordPress) | Large local developer pool, many local courier and gateway plugins, full control, low licence cost | Needs careful hosting, caching and security; plugin sprawl harms performance | You want control and local plugin support on a moderate budget |
| Headless (Next.js storefront with a commerce backend such as Shopify Storefront API, Medusa, Saleor or commercetools) | Best performance and design freedom, ideal for a luxury editorial experience | Higher build and maintenance cost; needs a competent team | Premium brand with campaigns, custom PDP features (stitching configurator) and scale |
| Fully custom | Maximum flexibility | Highest cost and time; you own every feature | Rarely recommended unless you have a large engineering team |

**Recommendation.** If your current site is on WooCommerce or Shopify and mostly works, improve it in place first (themes, performance, checkout, filters, PDP) and plan a headless storefront as a later step if the brand needs a more editorial experience than the theme allows. Decide based on your current platform, team and budget; the requirements in this document are platform-neutral.

### 8.2 Recommended frontend stack (if building or going headless)

- Framework: Next.js or Remix with server-side rendering or static generation and incremental regeneration for catalogue pages; TypeScript.
- Styling: design tokens with Tailwind CSS or CSS variables; a documented component library (Storybook).
- State: server state with React Query or similar; cart state persisted server-side with a local mirror.
- Images: image CDN with automatic AVIF and WebP, responsive srcset, blur-up placeholders.
- Fonts: self-hosted, subsetted, font-display swap; maximum two families plus an Urdu face if needed.
- Hosting: edge CDN (for example Cloudflare or Vercel) with a Pakistan or Middle East point of presence if possible.

### 8.3 Responsive breakpoints

Mobile first. Design and test at 360, 390, 768, 1024, 1280, 1440 and 1920 pixels. The majority of shoppers will arrive on mid-range Android phones over 4G, so mobile is the primary design target and desktop is the enhancement.

### 8.4 Imagery and media standards

| Item | Standard |
| --- | --- |
| Product image ratio | 4:5 (or 3:4) consistently across all products |
| Master resolution | At least 2400 px on the long edge; delivered via CDN in AVIF or WebP |
| Shots per product | Front, back, side, detail, fabric texture, flat lay, styled look (minimum 5) |
| Background and lighting | One consistent studio style per season; campaign shots may differ but live in editorial areas |
| Model information | Height, bust or chest, waist, size worn (recorded per product) |
| Video | Short silent clips for hero and PDP, under 3 MB, with poster images |
| File naming | SKU-colour-sequence (for example KH1234-ivory-01.jpg) so bulk upload maps automatically |
| Alt text | Descriptive, written by content team; never keyword-stuffed |

### 8.4a Typography, colour and motion guidance

See the design tokens in Section 12. Motion must be subtle (200 to 400 ms, ease-out), never block interaction, and respect the reduced-motion setting.

### 8.5 Accessibility (WCAG 2.2 AA)

- Text contrast at least 4.5 to 1 (3 to 1 for large text); never place thin text directly on busy images without an overlay.
- Full keyboard navigation for menus, drawers, filters, galleries and checkout; visible focus states.
- Drawers and modals trap focus, close with Escape and return focus to the trigger.
- All images have alt text; decorative images are hidden from assistive technology.
- Form fields have labels, error messages are linked to fields and announced.
- Target size at least 44 by 44 px on mobile; no hover-only functionality.

### 8.6 Language, Urdu and right-to-left support

- FR-L-01 (S) Urdu interface with RTL layout, mirrored icons where directional, and an Urdu typeface such as Noto Nastaliq Urdu with generous line height.
- FR-L-02 (M) Search understands Roman Urdu spellings (kameez, shalwar, dupatta, lehnga) and common misspellings.
- FR-L-03 (S) Product titles and descriptions can be stored in English and Urdu.
- FR-L-04 (M) Currency, dates and numbers formatted consistently (for example Rs. 12,500); decide a single convention for large amounts.

### 8.7 SEO and analytics (frontend)

- Structured data: Product, Offer, BreadcrumbList, Organization, FAQ, Article.
- XML sitemaps, canonical tags for filtered URLs, hreflang if multiple languages or regions.
- Meta titles and descriptions editable per page; Open Graph and Twitter card images.
- Tracking plan: GA4 ecommerce events (view\_item\_list, select\_item, view\_item, add\_to\_cart, begin\_checkout, add\_payment\_info, purchase), Meta Pixel with Conversions API, TikTok pixel, Google Search Console, heatmaps and session replay (Clarity or similar).
- Consent-aware tagging so scripts only fire after consent where required.

## 9. Pakistan-Specific Requirements

### 9.1 Payments

Local acquiring is dominated by Pakistani gateways and wallets, and international platforms such as Stripe do not serve Pakistani merchants directly. Current options include PayFast and Safepay, which both support cards, wallets and Raast-based account payments and publish plugins or APIs for common platforms. PayFast has also announced Google Pay support for its merchants. Bank gateways (for example from your acquiring bank) are an alternative. Confirm fees, settlement times and platform support with each provider before choosing.

- FR-P-01 (M) Support at least: cards (Visa, Mastercard, UnionPay), JazzCash, Easypaisa, Raast or bank account payment, and COD.
- FR-P-02 (M) Handle asynchronous payment states: wallet and Raast payments may stay pending for minutes. Orders must show Awaiting payment, update via webhook, and release stock if unpaid after a timeout (for example 15 to 30 minutes).
- FR-P-03 (M) Never store card data; use hosted fields or hosted redirect so the site stays within the lightest PCI DSS scope; support 3-D Secure.
- FR-P-04 (M) Webhook verification (signatures), idempotent processing, and a nightly reconciliation report matching gateway settlements to orders.
- FR-P-05 (M) Refunds from the admin through the gateway API where supported, otherwise a tracked manual refund workflow (bank transfer, wallet reversal).
- FR-P-06 (S) Provide a fallback gateway or payment method list that can be switched in admin if one provider has downtime.

### 9.2 Couriers and delivery

Pakistani courier APIs differ widely and can be unreliable, which is why many merchants use an integration layer rather than calling each courier directly. Commonly used couriers include TCS, Leopards, PostEx, Trax (Sonic), M&P, Call Courier, BlueEx and Daewoo FastEx.

- FR-D-01 (M) Courier adapter layer: one internal interface (create booking, cancel, track, print label, return) with a separate adapter per courier, so a courier can be added or replaced without touching storefront code.
- FR-D-02 (M) Rules engine for courier selection by city, weight, order value and COD vs prepaid; manual override per order.
- FR-D-03 (M) Maintain a city and area master list mapped to each courier's own city codes; unserviceable pin codes or cities blocked at checkout.
- FR-D-04 (M) Automatic tracking number capture, airway bill and label printing, bulk booking for many orders at once.
- FR-D-05 (M) Status sync by webhook where available, otherwise scheduled polling with retry and alerting when a courier API fails.
- FR-D-06 (M) Failed delivery workflow: courier reports attempt failed, system notifies customer by SMS or WhatsApp with option to confirm address or reschedule, then auto-escalates to return to origin (RTO) after set attempts.
- FR-D-07 (M) COD cash reconciliation: track collected amounts per courier, settlement dates and mismatches.
- FR-D-08 (S) Delivery estimate by city shown on PDP and cart, updated from courier performance data.
- FR-D-09 (S) Return pickup booking for exchanges and returns.

### 9.3 Cash on delivery controls

COD remains widely used and is the largest driver of return-to-origin losses, so the site needs controls rather than a plain COD option.

- FR-C-01 (M) Order confirmation by OTP, WhatsApp reply or call-centre confirmation before dispatch; unconfirmed orders auto-cancel after a configurable period.
- FR-C-02 (M) Configurable COD limits (minimum and maximum order value), optional COD fee, and per-city enablement.
- FR-C-03 (S) Risk scoring: repeat refusers by phone number or address, abnormal quantities, suspicious addresses; high-risk orders require partial prepayment or are blocked.
- FR-C-04 (S) Offer a small incentive to switch to prepaid at checkout and on the confirmation message.
- FR-C-05 (M) Customer service queue in admin for orders pending confirmation, with call outcome and notes.

### 9.4 Tax, legal and compliance

- Prices displayed inclusive of applicable sales tax; invoices carry the legal business name, NTN and sales tax registration details as applicable.
- Confirm with your tax adviser the current sales tax invoicing rules and any FBR requirements for online retailers and point-of-sale integration, because rules change.
- Publish clear Terms, Privacy Policy, Return and Refund Policy and delivery terms; customers must accept terms at checkout.
- Data protection: Pakistani law on personal data is still evolving, so confirm the current position with a lawyer. Apply GDPR and UK GDPR practices (consent, access, deletion) for overseas visitors.
- International sales: confirm export documentation, foreign exchange handling through your bank, and customs duty responsibility (delivered duty paid vs customer pays on delivery).

### 9.5 Local shopping behaviour and campaigns

- Seasonal peaks: spring and summer lawn launches, Eid ul-Fitr, Eid ul-Adha, wedding season (autumn to early spring), winter collections, Independence Day, 11.11 and Black Friday. The system must handle several times normal traffic on launch days (see NFR section).
- Early-access and drop mechanics: scheduled launches, waiting room or queue (C), purchase limits per customer to curb bots and resellers.
- WhatsApp is the primary support channel; every key page should offer a click-to-chat option with prefilled context.
- Instagram, Facebook and TikTok drive discovery: landing pages must be fast and match ad creative; support UTM tracking and shoppable social feeds.
- Phone-first identity: customers are often reached by phone; capture a valid mobile number at checkout.
- Network quality varies: design for low bandwidth with compressed images, lazy loading and an optional lightweight mode.

### 9.6 International customers

- FR-I-01 (S) Country selector with shipping rates, delivery times and currency (USD, GBP, AED, CAD, SAR as a starting list).
- FR-I-02 (S) International carriers such as DHL, FedEx, UPS, Aramex or TCS international with rate calculation at checkout.
- FR-I-03 (S) International card acquiring is a known challenge for Pakistani merchants; confirm with your bank or gateway what is available before promising it.
- FR-I-04 (S) Clear duties and taxes message, returns policy for international orders, and size conversion.

## 10. Backend and Admin Requirements

### 10.1 Logical architecture

| Layer | Responsibility |
| --- | --- |
| Storefront (web) | Rendering, routing, caching, analytics, consent |
| API layer | REST or GraphQL for catalogue, cart, checkout, account; versioned; rate limited |
| Commerce core | Catalogue, pricing, promotions, cart, orders, customers |
| Services | Inventory, payments, shipping adapters, notifications, search, reviews, loyalty |
| Data stores | Relational database for transactions, search index, cache (Redis), object storage for media |
| Integrations | ERP or POS, accounting, email, SMS, WhatsApp, courier APIs, payment gateways |
| Platform | CDN and WAF, queues and workers, monitoring, backups, CI/CD |

### 10.2 Core modules and requirements

| Module | Key requirements | Priority |
| --- | --- | --- |
| Catalogue (BE-CAT) | Products with variants (size and colour), SKUs, categories and collections, many-to-many tagging, attributes (fabric, composition, work type, piece count, season, occasion, care), model info, size chart assignment, what-is-in-the-box items, bundles and Complete the Look sets, SEO fields, scheduled publish and unpublish, draft status | M |
| Inventory (BE-INV) | Per-variant stock, multiple locations (warehouse, stores), reservation at checkout with timeout, low-stock alerts, safety stock, backorder and pre-order flags, inventory history, sync with POS or ERP | M |
| Pricing and promotions (BE-PRC) | Compare-at and sale prices, scheduled sales, percent and fixed discounts, buy-more-save-more, bundles, free-shipping thresholds, coupon codes with limits, customer segments, gift cards, rules that prevent stacking errors | M |
| Cart and orders (BE-ORD) | Persistent carts, price and stock revalidation, order state machine, partial fulfilment, order editing, notes and timeline, idempotent order creation, fraud flags | M |
| Payments (BE-PAY) | Gateway abstraction, payment intents, webhooks, refunds, reconciliation, payment method switching | M |
| Shipping and fulfilment (BE-SHP) | Courier adapters, rate tables, zone rules, labels, tracking sync, packing slips, bulk actions | M |
| Returns (BE-RET) | RMA workflow, reasons, inspection, exchange or refund, restocking rules, store credit | M |
| Customers (BE-CUS) | Profiles, addresses, measurements, order history, segments, consent records, data export and deletion | M |
| Content and CMS (BE-CMS) | Homepage and campaign page builder with reorderable modules, banner scheduling, menu editor, Journal, static pages, SEO fields, redirects manager | M |
| Search (BE-SRC) | Dedicated search engine (Algolia, Typesense, Meilisearch or Elasticsearch), synonyms, pinned results, faceted filters, analytics on zero-result queries | M |
| Notifications (BE-NTF) | Templated email, SMS and WhatsApp for confirmation, dispatch, out for delivery, delivered, abandoned cart, back in stock, review request; template editor with preview | M |
| Reviews (BE-REV) | Verified-buyer reviews, photo uploads, moderation, replies | S |
| Loyalty (BE-LOY) | Points, tiers, referral, birthday offers | C |
| Reporting (BE-RPT) | Sales, conversion funnel, AOV, product performance, stock ageing, discount impact, courier performance, COD vs prepaid, RTO rate | M |

### 10.3 Order state machine

Pending payment, then Paid; or Pending confirmation (COD), then Confirmed; then Processing, Packed, Dispatched, Out for delivery, Delivered. Exceptional states: Payment failed, Cancelled, Failed delivery, Returned to origin, Return requested, Return received, Refunded, Exchanged. Every transition is logged with user, time and reason, triggers the right notification and updates stock appropriately.

- BE-ORD-01 (M) Stock is reserved when an online payment starts and committed on success; released on failure or timeout.
- BE-ORD-02 (M) Idempotency keys on order creation and payment callbacks to avoid duplicate orders or double charges.
- BE-ORD-03 (M) Orders can be split into shipments (for example in-stock items first and made-to-order later).
- BE-ORD-04 (S) Manual order creation for call and WhatsApp orders by staff.

### 10.4 Admin panel capabilities

- Role-based access control (admin, merchandiser, content editor, customer support, warehouse, finance) with audit logs.
- Dashboard with today's sales, orders awaiting confirmation, low stock, failed payments and courier exceptions.
- Bulk product import and export (CSV or Excel), bulk image upload matched by SKU, bulk price and stock updates.
- Order list with filters, saved views, bulk actions (confirm, book courier, print labels, mark packed), printable invoices and packing slips.
- Customer service tools: order lookup by phone, internal notes, issue refunds, resend notifications.
- Content tools: drag-and-drop homepage modules, banner and announcement scheduling, size guide and policy editors, previews and staging.
- Two-factor authentication for all admin users.

### 10.5 Integrations summary

| Area | Examples | Notes |
| --- | --- | --- |
| POS and ERP | Your retail POS, Odoo, NetSuite, SAP Business One, local ERPs | Two-way inventory and order sync if you have physical stores |
| Accounting | Zoho Books, QuickBooks, local systems | Daily sales and settlement export |
| Email marketing | Klaviyo, Mailchimp, Brevo | Flows for welcome, abandoned cart, post-purchase, win-back |
| SMS | Local bulk SMS providers | Transactional and OTP messages; sender ID registration |
| WhatsApp | WhatsApp Business Platform through an approved provider | Template messages for order updates; opt-in required |
| Support | Freshdesk, Zendesk, Gorgias | Order context inside tickets |
| Search | Algolia, Typesense, Meilisearch, Elasticsearch | See BE-SRC |
| Monitoring | Sentry, Uptime monitoring, log aggregation | Alerts to a shared channel |

### 10.6 API and data standards

- Versioned REST or GraphQL APIs with authentication, rate limiting and request logging.
- Webhooks for order, payment, shipment and inventory events with retries and signature verification.
- Data model keeps cost price, supplier and internal notes private to admin APIs only.
- Timestamps in UTC stored, displayed in Pakistan Standard Time.

## 11. Non-Functional Requirements

| Area | Requirement | Priority |
| --- | --- | --- |
| Performance | On a mid-range phone over 4G, at the 75th percentile: Largest Contentful Paint at most 2.5 s, Interaction to Next Paint at most 200 ms, Cumulative Layout Shift at most 0.1; initial JavaScript under about 200 KB compressed; server response under 800 ms for cached pages | M |
| Scalability | Handles at least 5 to 10 times normal traffic on launch and sale days without degraded checkout; autoscaling, CDN caching of catalogue pages, queues for emails and webhooks; load test before every major season | M |
| Availability | 99.9 percent monthly uptime target; status monitoring with alerts; graceful degradation (if search or reviews fail, the shop still sells) | M |
| Backup and recovery | Daily backups, point-in-time recovery; recovery point objective 1 hour, recovery time objective 4 hours; restore tested quarterly | M |
| Security | OWASP Top 10 mitigations, TLS 1.2 or higher with HSTS, web application firewall, bot and rate limiting on login, checkout and drops, hosted payment fields (PCI DSS scope reduction), secrets in a vault, admin two-factor authentication, dependency scanning, penetration test before launch and yearly | M |
| Privacy | Data minimisation, consent records, customer data export and deletion, encryption at rest for personal data | M |
| Accessibility | WCAG 2.2 AA verified by automated and manual testing | M |
| Browser and device support | Last two versions of Chrome, Safari, Edge, Firefox, Samsung Internet; iOS 15 and later; Android 9 and later | M |
| Observability | Error tracking, structured logs, uptime checks, order and payment funnel dashboards, alerts on failed payments and courier API errors | M |
| Quality | Automated unit and end-to-end tests for add to bag, checkout, payment callback, order status changes; staging environment mirroring production; feature flags for risky releases | M |
| Maintainability | Version-controlled code, CI/CD with rollback, documented components, runbooks for launch days | S |
| Content governance | Style guide for copy, naming conventions for products, colour vocabulary, approval workflow for campaigns | S |

## 12. Design System and Visual Direction

These are starting recommendations for a premium, restrained look. Adapt colours and typefaces to your brand identity; keep the structure.

### 12.1 Principles

1. Let the garment lead: imagery is large and uncluttered, interface chrome is quiet.
2. Generous white space and a strict grid communicate quality.
3. One primary action per view; secondary actions are visually calmer.
4. Consistency over novelty: the same card, button and form patterns everywhere.
5. Fast and thumb-friendly on mobile first.

### 12.2 Design tokens (suggested)

| Token | Suggested value | Use |
| --- | --- | --- |
| Background | Ivory #F7F4EF or white #FFFFFF | Page background |
| Ink | #111111 | Text, primary buttons |
| Muted text | #6B6760 | Secondary text (check contrast at least 4.5 to 1) |
| Border | #E6E1D8 | Dividers, inputs |
| Accent | A single muted brand colour such as deep olive, oxblood or antique gold #B08D57 | Links, badges, highlights; use sparingly |
| Sale | #9B1C1C | Sale price and badge only |
| Success / Error | #2E7D4F / #B3261E | Status messages |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96 px | Margins and padding |
| Grid | Desktop 12 columns, 24 px gutter, max content width 1440 px; mobile 4 columns, 16 px gutter and margin | Layout |
| Corner radius | 0 to 2 px for buttons and inputs (sharp edges read as luxury); 0 on images | Shapes |
| Elevation | Hairline borders preferred; light shadows only for drawers and menus | Depth |

### 12.3 Typography

- Display and headings: a refined serif (for example Cormorant Garamond, Playfair Display, or a licensed face such as Canela) for headlines and editorial moments.
- Interface and body: a clean sans-serif (for example Inter, Jost or similar) for navigation, product information and forms.
- Scale (desktop / mobile): H1 48 / 32, H2 36 / 26, H3 24 / 20, body 16 / 16, caption 13 / 13; line height about 1.5 for body.
- Buttons and navigation labels in small capitals or uppercase with slight letter spacing (0.05 to 0.1 em) is a common luxury convention; keep readable.
- Urdu: Noto Nastaliq Urdu or similar with larger line height.

### 12.4 Core components

| Component | Variants and states |
| --- | --- |
| Buttons | Primary (solid ink), Secondary (outline), Tertiary (underlined text); default, hover, focus, active, disabled, loading; height 48 px |
| Form fields | Text, phone with +92 prefix, select, textarea, checkbox, radio, toggle; label, helper text, error, success, disabled |
| Size selector | Square chips with states: available, selected, unavailable (struck through), low stock |
| Swatches | Circle or square with selected ring; tooltip with colour name |
| Badges | New, Sale, Low stock, Bestseller, Made to order |
| Product card | Default, hover with second image, quick add, out of stock, sale |
| Navigation | Mega menu, mobile drill-down, breadcrumbs, tabs, pagination or Load More |
| Feedback | Toast, inline alert, modal, drawer, bottom sheet, tooltip, progress bar, skeleton |
| Media | Image gallery, lightbox zoom, video block, hotspot lookbook |
| Content | Accordion, editorial banner, quote, press logos, FAQ list |

### 12.5 Photography and tone of voice

- Consistent lighting and crop within each collection; natural and editorial rather than heavily retouched; show movement, drape and embroidery detail.
- Represent a range of body types and ages where relevant to your audience.
- Tone: warm, confident, understated; avoid shouting capitals and excessive exclamation marks; keep sale language measured.
- Bilingual microcopy where useful (English with selected Urdu phrases) but never mixed within one sentence without intent.

## 13. Phased Roadmap (indicative)

Durations depend on team size and the current state of your site.

| Phase | Focus | Key deliverables |
| --- | --- | --- |
| Phase 0: Audit and discovery (about 2 weeks) | Measure current state and decide scope | Gap analysis using Section 14, analytics baseline, platform decision, content and photography inventory, backlog with priorities |
| Phase 1: Foundation and quick wins (about 4 to 6 weeks) | Fix what loses money today | Performance and image optimisation, cleaner navigation and mega menu, improved filters and listing cards, PDP restructure with size guide and delivery estimator, checkout simplification, payment method cleanup, COD verification, branded tracking page, WhatsApp click-to-chat, cookie consent |
| Phase 2: Premium experience (about 6 to 10 weeks) | Raise brand perception and AOV | New homepage and campaign templates, editorial Journal and Craft pages, shop the look, complete the look, reviews, wishlist alerts, store locator and appointments, unstitched stitching configurator, returns self-service, email and WhatsApp flows |
| Phase 3: Growth and scale (ongoing) | Retention and expansion | Urdu and RTL, international shipping and currencies, loyalty programme, personalisation, size finder, search tuning, A/B testing programme, consider headless storefront, ERP and POS deep integration |

## 14. Audit Checklist for Your Existing Website

Mark each item as Present (P), Partial (X) or Missing (M) and note the priority. Then rank the Missing and Partial items by impact on revenue.

**Global and navigation**

- ☐ Single announcement bar with at most one promotion
- ☐ Sticky header that hides on scroll down and returns on scroll up
- ☐ Mega menu with image tiles and occasion or fabric entries
- ☐ Mobile drill-down menu with large tap targets
- ☐ Search with autocomplete, recent and trending searches, typo tolerance, Roman Urdu synonyms
- ☐ Mini bag drawer with free-shipping progress bar
- ☐ Wishlist for guests and logged-in users
- ☐ WhatsApp click-to-chat with prefilled context
- ☐ Cookie consent for overseas visitors; no stacked popups

**Homepage**

- ☐ One strong hero, premium editorial modules, minimal sale clutter
- ☐ Category entry tiles, new arrivals, bestsellers, shop by occasion
- ☐ Trust band (delivery, exchange, secure payment, COD)
- ☐ Admin-editable module order

**Listing pages**

- ☐ Filters for size availability, colour, fabric, price, occasion, piece count
- ☐ Filter chips and shareable URLs
- ☐ Hover second image, colour swatches, consistent badges
- ☐ Load More with scroll restoration
- ☐ Editorial tiles in the grid

**Product pages**

- ☐ 6 or more consistent images plus zoom, video where possible
- ☐ Sticky buy box with size selector, out-of-stock handling, Notify me
- ☐ Interactive size guide in cm and inches, model measurements
- ☐ Delivery estimate by city and COD availability
- ☐ What is in the box and stitching option for unstitched products
- ☐ Complete the Look, recently viewed, reviews with photos
- ☐ Sticky mobile Add to Bag bar
- ☐ Product structured data

**Cart and checkout**

- ☐ Guest checkout with phone-first fields and valid +92 validation
- ☐ City list matches couriers; landmark field present
- ☐ Cards, JazzCash, Easypaisa, Raast, COD available
- ☐ Pending wallet and Raast payment states handled
- ☐ COD confirmation by OTP or WhatsApp; auto-cancel unconfirmed orders
- ☐ Order summary always visible; clear errors; no duplicate orders

**Post-purchase and account**

- ☐ Confirmation by email, SMS and WhatsApp
- ☐ Branded tracking page with courier status
- ☐ Self-service returns and exchanges
- ☐ Address book, order history, measurements profile

**Brand and content**

- ☐ Journal, Craft, Fabric Guide, Our Story, lookbooks
- ☐ Store locator and appointment booking
- ☐ Clear shipping, returns, privacy and terms pages

**Backend and operations**

- ☐ Bulk product import, image upload by SKU, bulk price and stock edits
- ☐ Courier integration with bulk booking and label printing
- ☐ Stock reservation and low-stock alerts; POS or ERP sync
- ☐ Promotions engine (scheduled sales, bundles, free-shipping thresholds)
- ☐ Reports: funnel, AOV, RTO, COD vs prepaid, courier performance
- ☐ Roles and permissions, audit log, admin two-factor authentication

**Quality**

- ☐ Core Web Vitals pass on mobile 4G
- ☐ WCAG 2.2 AA checks done
- ☐ Security scan and penetration test
- ☐ Backups tested; staging environment exists

## 15. Mockup Deliverables (screens to design)

Produce each screen in mobile (390 px) and desktop (1440 px) unless noted.

1. Homepage (full length)
2. Mega menu open (desktop); mobile menu and drill-down panels
3. Search overlay with suggestions; search results page; no-results state
4. Collection page with filters (desktop sidebar and mobile bottom sheet), empty state
5. Product page: ready-to-wear, unstitched with stitching option, made-to-order, out of stock; size guide drawer; zoom lightbox
6. Mini bag drawer; full bag page
7. Checkout: contact and address, delivery, payment (with wallet pending and COD confirmation states), error states
8. Order confirmation; tracking page
9. Account: login and register, dashboard, orders, order detail, return request, addresses, wishlist, measurements
10. Store locator and appointment booking
11. Journal list and article; Craft page; Fabric Guide; Lookbook with hotspots
12. Customer care: shipping, returns, FAQs, contact
13. Gift card purchase
14. 404 and error pages
15. Email, SMS and WhatsApp templates: order confirmation, dispatched, out for delivery, delivered, COD confirmation, abandoned cart, back in stock
16. Component sheet and design tokens (Section 12)

## 16. Open Questions to Confirm Before Finalising

1. Which platform is the current website built on, and who maintains it?
2. Which product lines do you sell (ready-to-wear, unstitched, bridal, menswear, kids, accessories) and roughly how many SKUs per season?
3. Do you have physical stores, and do they share inventory with the website?
4. What share of orders is COD today, and what is your return-to-origin rate?
5. Which payment gateway and couriers do you use or have contracts with?
6. Do you ship internationally, and which countries matter most?
7. Is Urdu support a launch requirement or a later phase?
8. What is the brand's positioning (accessible premium, luxury, couture) and do you have a brand guideline and photography standard?
9. Do you offer made-to-order, stitching or customisation, and what are the lead times?
10. What budget and timeline apply to Phase 1 and Phase 2?

Once these are answered, the requirements above can be turned into a prioritised backlog with estimates.
