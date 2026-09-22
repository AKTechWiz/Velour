#!/usr/bin/env node
// Sync products with local images to Supabase 'products' table
import { createClient } from "@supabase/supabase-js";
import { BASE_PRODUCTS } from "../lib/data.ts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fljiltfjfgcxmnrgjnbb.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, serviceKey);

async function seed() {
  console.log(`Seeding ${BASE_PRODUCTS.length} products to Supabase...`);

  for (const p of BASE_PRODUCTS) {
    const row = {
      id: p.id,
      slug: p.slug || p.id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      compare_at_price: p.compareAtPrice ?? null,
      description: p.description,
      sizes: p.sizes,
      images: p.images,
      featured: p.featured,
      is_new: p.isNew,
      trending: p.trending,
      material: p.material ?? null,
      color: p.color ?? null,
      stock: p.stock ?? 20,
    };

    const { error } = await supabase.from("products").upsert(row, { onConflict: "id" });
    if (error) {
      console.error(`Error upserting ${p.id}:`, error.message);
    } else {
      console.log(`✓ Upserted ${p.id} (${p.name}) with ${p.images.length} images`);
    }
  }

  const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true });
  console.log(`Total products in Supabase: ${count} (error: ${error?.message ?? "none"})`);
}

seed().catch(console.error);
