-- Policies for carts
DROP POLICY IF EXISTS "Users can manage own cart" ON public.carts;
CREATE POLICY "Users can manage own cart" ON public.carts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for orders
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
CREATE POLICY "Users can read own orders" ON public.orders
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

DROP POLICY IF EXISTS "Anon can update orders for payment" ON public.orders;
CREATE POLICY "Anon can update orders for payment" ON public.orders
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);
