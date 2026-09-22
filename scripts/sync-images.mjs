import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fljiltfjfgcxmnrgjnbb.supabase.co";
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) {
      const k = m[1].trim();
      const v = m[2].trim().replace(/^["']|["']$/g, "");
      if (k === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = v;
      if (k === "SUPABASE_SERVICE_ROLE_KEY") supabaseKey = v;
    }
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imageUpdates = [
  { id: "atelier-wool-coat", images: ["/images/products/wool-coat-1.jpg", "/images/products/wool-coat-2.jpg"] },
  { id: "silk-slip-dress", images: ["/images/products/silk-slip-dress-1.jpg", "/images/products/silk-slip-dress-2.jpg"] },
  { id: "cashmere-crewneck", images: ["/images/products/cashmere-sweater-1.jpg", "/images/products/cashmere-sweater-2.jpg"] },
  { id: "wide-leg-organic-denim", images: ["/images/products/wide-leg-trousers-1.jpg", "/images/products/wide-leg-trousers-2.jpg"] },
];

const newProducts = [
  {
    id: "denim-blazer",
    slug: "denim-blazer",
    name: "Relaxed Denim Blazer",
    category: "women",
    subcategory: "Outerwear",
    price: 168,
    description:
      "A softly relaxed blazer cut from mid-weight washed denim with a notched lapel, chest patch pockets, and a lightly structured shoulder.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/images/products/denim-blazer-1.jpg", "/images/products/denim-blazer-2.jpg"],
    featured: true,
    is_new: true,
    trending: false,
    material: "100% Cotton Denim",
    color: "Mid Indigo",
    stock: 18,
  },
  {
    id: "fisherman-knit",
    slug: "fisherman-knit",
    name: "Chunky Fisherman Knit",
    category: "men",
    subcategory: "Knitwear",
    price: 155,
    description:
      "A heritage-style cable knit sweater in heavy 100% lambswool with ribbed collar, cuffs, and hem for a substantial, cozy hand feel.",
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/fisherman-knit-1.jpg"],
    featured: true,
    is_new: true,
    trending: false,
    material: "100% Lambswool",
    color: "Cream",
    stock: 21,
  },
  {
    id: "mens-overcoat",
    slug: "mens-overcoat",
    name: "Tailored Men's Overcoat",
    category: "men",
    subcategory: "Outerwear",
    price: 395,
    compare_at_price: 475,
    description:
      "A refined single-breasted overcoat in dense Italian wool with a structured shoulder, notch lapels, and a tailored straight fit.",
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/mens-overcoat-1.jpg"],
    featured: true,
    is_new: true,
    trending: true,
    material: "100% Italian Wool",
    color: "Charcoal",
    stock: 9,
  },
];

async function main() {
  for (const u of imageUpdates) {
    const { error } = await supabase.from("products").update({ images: u.images }).eq("id", u.id);
    console.log(error ? `UPDATE FAIL ${u.id}: ${error.message}` : `Updated images: ${u.id}`);
  }

  for (const p of newProducts) {
    const row = {
      ...p,
      compare_at_price: p.compare_at_price ?? null,
      created_at: new Date().toISOString().replace("T", " ").slice(0, 19) + "+00:00",
    };
    const { error } = await supabase.from("products").upsert(row, { onConflict: "id" });
    console.log(error ? `INSERT FAIL ${p.id}: ${error.message}` : `Upserted product: ${p.id} (${p.name})`);
  }
}

main().catch((e) => console.error("FATAL:", e));