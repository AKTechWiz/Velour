-- RLS for carts
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
CREATE POLICY "Users can manage own cart" ON public.carts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure orders columns and constraints match
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS contact JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_receipt_url TEXT;

-- Update status check constraint to support 'paid'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- RLS for orders: authenticated users can manage own orders, anyone can insert
DROP POLICY IF EXISTS "Customers can read own orders" ON public.orders;
CREATE POLICY "Customers can read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert checkout orders" ON public.orders;
CREATE POLICY "Anyone can insert checkout orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
