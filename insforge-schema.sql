-- ==============================================================================
-- VELOUR E-COMMERCE - COMPLETE INSFORGE DATABASE SCHEMA & SEED DATA
-- ==============================================================================
-- Run this SQL in your InsForge Dashboard:
-- Dashboard -> SQL / Database -> New Query -> Paste this script -> Click "Run"
-- ==============================================================================

-- 1. DROP EXISTING TABLES (CLEAN SLATE IF RECREATING)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.decrement_inventory(TEXT, INT);

DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- PROFILES (Linked to InsForge Auth users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS (Catalog & Inventory)
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('women', 'men')),
  subcategory TEXT NOT NULL,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  description TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  material TEXT,
  color TEXT,
  stock INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS (Checkout & Payment Status)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_method TEXT DEFAULT 'paypal',
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS (Purchased Items with Snapshot Details)
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  size TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. STORED FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Automatic profile creation on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atomic inventory decrement on purchase
CREATE OR REPLACE FUNCTION public.decrement_inventory(p_id TEXT, p_qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - p_qty)
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Products: Everyone can read
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (true);

-- Products: Admins can manage
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin')
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = (SELECT auth.uid())) = 'admin');

-- Profiles: Self view and edit
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Orders: View own orders
DROP POLICY IF EXISTS "Customers can read own orders" ON public.orders;
CREATE POLICY "Customers can read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Orders: Anyone (including guest checkout) can create orders
DROP POLICY IF EXISTS "Anyone can create order on checkout" ON public.orders;
CREATE POLICY "Anyone can create order on checkout" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Orders: Authenticated users can update their orders
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Orders: Confirm payment by order number
DROP POLICY IF EXISTS "Anon can confirm payment by order number" ON public.orders;
CREATE POLICY "Anon can confirm payment by order number" ON public.orders
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Order Items: Anyone can insert on checkout
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Order Items: Customers can view items belonging to their orders
DROP POLICY IF EXISTS "Customers can read order items" ON public.order_items;
CREATE POLICY "Customers can read order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
    )
  );

-- ==============================================================================
-- 5. SEED PRODUCTS (28 HIGH QUALITY GARMENTS WITH LOCAL IMAGES)
-- ==============================================================================

INSERT INTO public.products (id, slug, name, category, subcategory, price, compare_at_price, description, sizes, images, featured, is_new, trending, material, color, stock)
VALUES
-- 10 Local Image Hero & Feature Garments
('atelier-wool-coat', 'atelier-wool-coat', 'Atelier Wool Coat', 'women', 'Outerwear', 289, 360, 'A single-breasted coat in brushed Italian virgin wool with a clean, elongated silhouette. Fully lined in cupro, falling gracefully below the knee.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['/images/products/wool-coat-1.jpg', '/images/products/wool-coat-2.jpg'], true, false, true, '100% Virgin Wool', 'Oatmeal', 14),
('silk-slip-dress', 'silk-slip-dress', 'Bias-Cut Silk Slip Dress', 'women', 'Dresses', 189, NULL, 'Cut on the bias from 19mm sandwashed silk, this slip dress drapes fluidly across the body with delicate adjustable straps and a midi hemline.', ARRAY['XS', 'S', 'M', 'L'], ARRAY['/images/products/silk-slip-dress-1.jpg', '/images/products/silk-slip-dress-2.jpg'], true, true, false, '100% Mulberry Silk', 'Champagne', 22),
('cashmere-crewneck', 'cashmere-crewneck', 'Grade-A Cashmere Crewneck', 'women', 'Knitwear', 220, NULL, 'Spun from 2-ply long-staple Mongolian cashmere. Subtly relaxed through the chest with delicately ribbed collar and cuffs.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['/images/products/cashmere-sweater-1.jpg', '/images/products/cashmere-sweater-2.jpg'], true, true, true, '100% Mongolian Cashmere', 'Heather Camel', 12),
('wide-leg-organic-denim', 'wide-leg-organic-denim', 'Wide-Leg Organic Denim', 'women', 'Jeans', 135, NULL, 'Heavyweight 13oz non-stretch organic denim in an authentic rinse wash. Sits high at the waist with an expansive wide-leg drape.', ARRAY['24', '25', '26', '27', '28', '29', '30'], ARRAY['/images/products/wide-leg-trousers-1.jpg', '/images/products/wide-leg-trousers-2.jpg'], false, true, true, '100% Organic Cotton', 'Washed Indigo', 20),
('denim-blazer', 'denim-blazer', 'Relaxed Denim Blazer', 'women', 'Outerwear', 210, 260, 'Subtly structured blazer crafted from pure Japanese denim with notch lapels and natural horn buttons.', ARRAY['XS', 'S', 'M', 'L'], ARRAY['/images/products/denim-blazer-1.jpg', '/images/products/denim-blazer-2.jpg'], true, true, false, '100% Cotton Denim', 'Deep Indigo', 15),
('oxford-cotton-shirt', 'oxford-cotton-shirt', 'Classic Oxford Cotton Shirt', 'men', 'Shirts', 95, NULL, 'Pre-washed substantial oxford cotton featuring a classic button-down collar, single chest pocket, and relaxed tailoring.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['/images/products/oxford-shirt-1.jpg', '/images/products/oxford-shirt-2.jpg'], false, true, false, '100% Pima Cotton', 'Sky Blue', 40),
('heavyweight-jersey-tee', 'heavyweight-jersey-tee', 'Essential Heavyweight Tee', 'men', 'Tops', 48, NULL, 'Knitted from 240gsm combed cotton jersey. Cut with a relaxed boxy drape, taped shoulders, and a dense ribbed collar.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['/images/products/essential-tee-1.jpg', '/images/products/essential-tee-2.jpg'], false, false, false, '100% Combed Cotton', 'Bone', 55),
('mens-overcoat', 'mens-overcoat', 'Tailored Men''s Overcoat', 'men', 'Outerwear', 340, 420, 'A single-breasted overcoat tailored from double-faced camel wool with notch lapels, horn buttons, and a clean center back vent.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['/images/products/mens-overcoat-1.jpg', '/images/products/mens-overcoat-2.jpg'], true, false, true, '90% Wool, 10% Cashmere', 'Camel', 10),
('fisherman-knit', 'fisherman-knit', 'Chunky Fisherman Knit', 'men', 'Knitwear', 195, NULL, 'Heavy-gauge ribbed knit sweater spun from pure British wool. Warm, tactile, and built for a relaxed everyday fit.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['/images/products/fisherman-knit-1.jpg', '/images/products/fisherman-knit-2.jpg'], true, true, false, '100% British Wool', 'Cream', 18),
('pleated-tailored-trousers', 'pleated-tailored-trousers', 'Single-Pleat Tailored Trousers', 'men', 'Trousers', 160, 200, 'Modern high-rise wool flannel trouser with a crisp single reverse pleat, side waist adjusters, and a softly tapered leg opening.', ARRAY['28', '30', '32', '34', '36'], ARRAY['/images/products/pleated-trousers-1.jpg', '/images/products/pleated-trousers-2.jpg'], false, true, true, '100% Wool Flannel', 'Charcoal Grey', 20),

-- Additional Collection Pieces
('relaxed-linen-shirt', 'relaxed-linen-shirt', 'Relaxed Linen Shirt', 'women', 'Shirts', 98, NULL, 'Washed European flax linen with a fluid dropped shoulder, convertible camp collar, and genuine mother-of-pearl buttons.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=900&q=80', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80'], false, true, true, '100% European Flax', 'Chalk White', 35),
('tailored-trouser', 'tailored-trouser', 'High-Rise Tailored Trouser', 'women', 'Trousers', 145, 180, 'High-rise trousers in fluid wool crepe with front pleats, pressed center crease, and a concealed hook-and-bar waistband.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80'], true, false, false, '98% Wool, 2% Elastane', 'Charcoal', 18),
('poplin-shirt-dress', 'poplin-shirt-dress', 'Pleated Poplin Shirtdress', 'women', 'Dresses', 158, 195, 'Crisp organic cotton poplin shirtdress featuring a detachable fabric self-belt, hidden button placket, and deep side-seam pockets.', ARRAY['XS', 'S', 'M', 'L'], ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80'], false, true, true, '100% Organic Cotton', 'Ecru', 19),
('structured-wool-blazer', 'structured-wool-blazer', 'Structured Wool Blazer', 'women', 'Outerwear', 265, NULL, 'Defined shoulders and a clean, menswear-inspired straight silhouette tailored from refined Italian wool twill with horn buttons.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=900&q=80'], false, true, false, '100% Italian Wool', 'Deep Navy', 15),
('ribbed-merino-turtleneck', 'ribbed-merino-turtleneck', 'Ribbed Merino Turtleneck', 'women', 'Knitwear', 115, NULL, 'Second-skin fine gauge turtleneck crafted from extra-fine merino wool. Incredibly soft, naturally thermoregulating.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80'], false, false, false, '100% Extra-Fine Merino', 'Espresso', 28),
('satin-camisole-top', 'satin-camisole-top', 'Satin Camisole Top', 'women', 'Tops', 85, NULL, 'Minimalist V-neck camisole tailored from matte satin with clean turned seams and subtle side slits.', ARRAY['XS', 'S', 'M', 'L'], ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80'], false, false, false, '100% Viscose Satin', 'Pewter', 30),
('boucle-tweed-jacket', 'boucle-tweed-jacket', 'Boucle Tweed Jacket', 'women', 'Outerwear', 298, NULL, 'Boxy cropped jacket in textured Italian boucle tweed with raw fringe edges, patch pockets, and hand-cast metal buttons.', ARRAY['XS', 'S', 'M', 'L'], ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=80'], true, true, false, '75% Wool, 25% Cotton', 'Ivory Multi', 11),
('slim-flare-denim', 'slim-flare-denim', 'Slim Flare Raw Hem Denim', 'women', 'Jeans', 140, 170, 'Flattering mid-rise jeans fitted through the thigh and gently flaring from the knee down. Finished with a subtle clean hem.', ARRAY['24', '25', '26', '27', '28', '29', '30'], ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80'], false, false, true, '99% Cotton, 1% Elastane', 'True Black', 24),
('merino-crew-sweater', 'merino-crew-sweater', 'Merino Crew Sweater', 'men', 'Knitwear', 145, NULL, 'Fully fashioned 12-gauge Italian merino wool sweater with clean saddle shoulders and refined micro-ribbed finishes.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80', 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=900&q=80'], true, true, false, '100% Italian Merino Wool', 'Taupe', 25),
('camel-tailored-overcoat', 'camel-tailored-overcoat', 'Camel Tailored Overcoat', 'men', 'Outerwear', 340, 420, 'A single-breasted overcoat tailored from double-faced camel wool with notch lapels, horn buttons, and a clean center back vent.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=80'], true, false, true, '90% Wool, 10% Cashmere', 'Camel', 10),
('selvedge-slim-jean', 'selvedge-slim-jean', 'Slim Selvedge Jean', 'men', 'Jeans', 155, NULL, '13.5oz Kuroki mill Japanese selvedge denim in a clean slim-straight cut. Ring-spun indigo yarns that fade distinctively over time.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80'], true, false, true, '100% Japanese Selvedge Cotton', 'Raw Indigo', 22),
('cashmere-crew-men', 'cashmere-crew-men', 'Substantial Cashmere Knit', 'men', 'Knitwear', 240, 295, 'Heavier 4-ply Mongolian cashmere with raglan sleeves and a relaxed silhouette that delivers unmatched warmth and softness.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=900&q=80', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900&q=80'], false, true, true, '100% Mongolian Cashmere', 'Mushroom', 16),
('technical-field-jacket', 'technical-field-jacket', 'Technical Field Jacket', 'men', 'Jackets', 215, NULL, 'Water-repellent bonded cotton twill with four exterior flap bellows pockets, a concealed zip placket, and adjustable waist cinch.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=80', 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=80'], false, false, false, '70% Cotton, 30% Polyamide', 'Olive Drab', 18),
('pleated-wool-trouser', 'pleated-wool-trouser', 'Single-Pleat Wool Trouser', 'men', 'Trousers', 160, 200, 'Modern high-rise wool flannel trouser with a crisp single reverse pleat, side waist adjusters, and a softly tapered leg opening.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80'], false, true, true, '100% Wool Flannel', 'Charcoal Grey', 20),
('linen-drawstring-trouser', 'linen-drawstring-trouser', 'Linen Drawstring Trouser', 'men', 'Trousers', 125, NULL, 'Garment-washed pure linen trouser fitted with an elasticated waistband and cotton herringbone drawstring. Breathable and easy.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80'], false, true, false, '100% French Linen', 'Sandstone', 28),
('brushed-wool-overshirt', 'brushed-wool-overshirt', 'Brushed Wool Overshirt', 'men', 'Jackets', 185, NULL, 'A versatile shirt-jacket hybrid crafted from heavy brushed wool melton with patch pockets and natural horn button closures.', ARRAY['S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1608234807905-4466023792f5?w=900&q=80', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=80'], true, true, false, '85% Wool, 15% Polyamide', 'Dark Espresso', 14),
('organic-pocket-tee', 'organic-pocket-tee', 'Relaxed Organic Pocket Tee', 'men', 'T-Shirts', 52, NULL, 'Garment-dyed organic slub jersey with a chest patch pocket and a subtly washed vintage finish that softens with every cycle.', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80'], false, false, true, '100% Organic Cotton', 'Washed Black', 42),
('straight-vintage-denim', 'straight-vintage-denim', 'Straight Cut Vintage Denim', 'men', 'Jeans', 148, NULL, 'Classic five-pocket jeans crafted from 12.5oz cotton denim in an authentic faded wash with subtle whiskering and copper hardware.', ARRAY['28', '30', '32', '34', '36'], ARRAY['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80'], false, false, false, '100% Cotton', 'Vintage Mid Blue', 26)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  images = EXCLUDED.images,
  description = EXCLUDED.description;
