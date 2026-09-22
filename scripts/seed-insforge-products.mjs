#!/usr/bin/env node
import { createAdminClient } from "@insforge/sdk";
import { BASE_PRODUCTS } from "../lib/data.ts";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://cawv4e2d.us-east.insforge.app";
const apiKey = process.env.INSFORGE_API_KEY || "";

const insforge = createAdminClient({
  baseUrl,
  apiKey,
});

async function seed() {
  console.log(`Seeding ${BASE_PRODUCTS.length} products to InsForge (${baseUrl})...`);

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

    // InsForge insert/upsert takes an array of objects
    const { data, error } = await insforge.database.from("products").upsert([row]);
    if (error) {
      console.error(`Error upserting ${p.id}:`, error.message);
    } else {
      console.log(`✓ Upserted ${p.id} (${p.name}) with ${p.images.length} images`);
    }
  }

  const { data: allProds, error: countErr } = await insforge.database.from("products").select();
  console.log(`Total products in InsForge: ${allProds?.length} (error: ${countErr?.message ?? "none"})`);
}

seed().catch(console.error);
