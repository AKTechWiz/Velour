# Listings import

1. Copy `listings-template.csv` and fill in one row per product.
   - `category`: `women` or `men`
   - `sizes`: pipe-separated, e.g. `XS|S|M|L|XL` (leave empty for the default)
   - `featured` / `isNew` / `trending`: `yes` or `no`
   - `image1` / `image2`: file names of photos placed in `incoming/images/`
2. Run: `node scripts/import-listings.mjs`
3. The script slugs product ids, optimizes images with macOS `sips`
   (when available) into `public/images/products/`, and regenerates
   `lib/generated-products.ts`. Never hand-edit that file.
