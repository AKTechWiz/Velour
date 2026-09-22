import { createAdminClient } from "@insforge/sdk";
import fs from "fs";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://cawv4e2d.us-east.insforge.app";
const apiKey = process.env.INSFORGE_API_KEY || "";

const admin = createAdminClient({ baseUrl, apiKey });

const CLEAN_PRODUCTS = [
  // --- WOMEN ---
  {
    id: "wool-coat",
    slug: "wool-coat",
    name: "Wool Coat",
    category: "women",
    subcategory: "Outerwear",
    price: 289,
    compare_at_price: 360,
    description: "A tailored coat in brushed virgin wool with a clean, elongated silhouette. Fully lined in cupro, falling gracefully below the knee.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/images/products/wool-coat-1.jpg", "/images/products/wool-coat-2.jpg"],
    featured: true,
    is_new: false,
    trending: true,
    material: "100% Virgin Wool",
    color: "Oatmeal",
    stock: 14,
  },
  {
    id: "silk-slip-dress",
    slug: "silk-slip-dress",
    name: "Silk Slip Dress",
    category: "women",
    subcategory: "Dresses",
    price: 189,
    compare_at_price: 240,
    description: "Cut on the bias from 19mm sandwashed silk, this slip dress drapes fluidly across the body with delicate adjustable straps and a midi hemline.",
    sizes: ["XS", "S", "M", "L"],
    images: ["/images/products/silk-slip-dress-1.jpg", "/images/products/silk-slip-dress-2.jpg"],
    featured: true,
    is_new: true,
    trending: false,
    material: "100% Mulberry Silk",
    color: "Champagne",
    stock: 22,
  },
  {
    id: "cashmere-sweater",
    slug: "cashmere-sweater",
    name: "Cashmere Sweater",
    category: "women",
    subcategory: "Knitwear",
    price: 220,
    compare_at_price: 275,
    description: "Spun from 2-ply long-staple Mongolian cashmere. Subtly relaxed through the chest with delicately ribbed collar and cuffs.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/images/products/cashmere-sweater-1.jpg", "/images/products/cashmere-sweater-2.jpg"],
    featured: true,
    is_new: true,
    trending: true,
    material: "100% Mongolian Cashmere",
    color: "Heather Camel",
    stock: 18,
  },
  {
    id: "wide-leg-trousers",
    slug: "wide-leg-trousers",
    name: "Wide Leg Trousers",
    category: "women",
    subcategory: "Jeans",
    price: 135,
    compare_at_price: 170,
    description: "Heavyweight 13oz non-stretch organic denim in an authentic rinse wash. Sits high at the waist with an expansive wide-leg drape.",
    sizes: ["24", "25", "26", "27", "28", "29", "30"],
    images: ["/images/products/wide-leg-trousers-1.jpg", "/images/products/wide-leg-trousers-2.jpg"],
    featured: false,
    is_new: true,
    trending: true,
    material: "100% Organic Cotton",
    color: "Washed Indigo",
    stock: 20,
  },
  {
    id: "denim-blazer",
    slug: "denim-blazer",
    name: "Denim Blazer",
    category: "women",
    subcategory: "Outerwear",
    price: 168,
    compare_at_price: 210,
    description: "A softly relaxed blazer cut from mid-weight washed denim with a notched lapel, chest patch pockets, and a lightly structured shoulder.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/images/products/denim-blazer-1.jpg", "/images/products/denim-blazer-2.jpg"],
    featured: true,
    is_new: true,
    trending: false,
    material: "100% Cotton Denim",
    color: "Mid Indigo",
    stock: 18,
  },

  // --- MEN ---
  {
    id: "mens-overcoat",
    slug: "mens-overcoat",
    name: "Men's Overcoat",
    category: "men",
    subcategory: "Outerwear",
    price: 395,
    compare_at_price: 475,
    description: "A refined single-breasted overcoat in dense Italian wool with a structured shoulder, notch lapels, and a tailored straight fit.",
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/mens-overcoat-1.jpg", "/images/products/mens-overcoat-2.jpg"],
    featured: true,
    is_new: true,
    trending: true,
    material: "100% Italian Wool",
    color: "Charcoal",
    stock: 12,
  },
  {
    id: "fisherman-knit",
    slug: "fisherman-knit",
    name: "Fisherman Knit",
    category: "men",
    subcategory: "Knitwear",
    price: 155,
    compare_at_price: 195,
    description: "A heritage-style cable knit sweater in heavy 100% lambswool with ribbed collar, cuffs, and hem for a substantial, cozy hand feel.",
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/fisherman-knit-1.jpg", "/images/products/fisherman-knit-2.jpg"],
    featured: true,
    is_new: true,
    trending: false,
    material: "100% Lambswool",
    color: "Cream",
    stock: 21,
  },
  {
    id: "essential-tee",
    slug: "essential-tee",
    name: "Essential Tee",
    category: "men",
    subcategory: "Tops",
    price: 65,
    compare_at_price: 85,
    description: "Crafted from dense 280gsm combed organic cotton jersey with a relaxed drape, ribbed collar, and durable twin-needle stitching.",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: ["/images/products/essential-tee-1.jpg", "/images/products/essential-tee-2.jpg"],
    featured: true,
    is_new: true,
    trending: true,
    material: "100% Organic Combed Cotton",
    color: "Optic White",
    stock: 25,
  },
  {
    id: "oxford-shirt",
    slug: "oxford-shirt",
    name: "Oxford Shirt",
    category: "men",
    subcategory: "Shirts",
    price: 120,
    compare_at_price: 145,
    description: "Tailored from durable pinpoint Oxford cotton with a soft washed hand. Features genuine mother-of-pearl buttons, a button-down collar, and a box pleat.",
    sizes: ["S", "M", "L", "XL"],
    images: ["/images/products/oxford-shirt-1.jpg", "/images/products/oxford-shirt-2.jpg"],
    featured: false,
    is_new: true,
    trending: true,
    material: "100% Long-Staple Cotton",
    color: "Sky Blue",
    stock: 18,
  },
  {
    id: "pleated-trousers",
    slug: "pleated-trousers",
    name: "Pleated Trousers",
    category: "men",
    subcategory: "Trousers",
    price: 175,
    compare_at_price: 220,
    description: "Spun from breathable high-twist tropical wool. Features subtle front pleats, side adjusters, and a clean taper through the hem.",
    sizes: ["28", "30", "32", "34", "36"],
    images: ["/images/products/pleated-trousers-1.jpg", "/images/products/pleated-trousers-2.jpg"],
    featured: true,
    is_new: true,
    trending: false,
    material: "100% Tropical Wool",
    color: "Charcoal Taupe",
    stock: 16,
  },
];

// Also keep legacy aliases so foreign keys or past carts don't break
const LEGACY_ALIASES = [
  { oldId: "atelier-wool-coat", targetId: "wool-coat" },
  { oldId: "cashmere-crewneck", targetId: "cashmere-sweater" },
  { oldId: "wide-leg-organic-denim", targetId: "wide-leg-trousers" },
  { oldId: "heavyweight-jersey-tee", targetId: "essential-tee" },
  { oldId: "oxford-cotton-shirt", targetId: "oxford-shirt" },
  { oldId: "pleated-tailored-trousers", targetId: "pleated-trousers" },
];

async function seedCleanProducts() {
  console.log("Seeding clean products matching exact images in InsForge DB...");

  // 1. Delete extra mock products that aren't in the clean list
  const validIds = CLEAN_PRODUCTS.map((p) => p.id).concat(LEGACY_ALIASES.map((a) => a.oldId));
  const { data: allExisting, error: fetchErr } = await admin.database.from("products").select("id");
  if (!fetchErr && allExisting) {
    const toDelete = allExisting.filter((p) => !validIds.includes(p.id));
    console.log(`Found ${toDelete.length} mock products to remove...`);
    for (const item of toDelete) {
      await admin.database.from("products").delete().eq("id", item.id);
    }
  }

  // 2. Upsert each clean product
  for (const product of CLEAN_PRODUCTS) {
    const { error } = await admin.database
      .from("products")
      .upsert([product]);

    if (error) {
      console.error(`Failed to upsert ${product.id}:`, error);
    } else {
      console.log(`✓ Upserted product: ${product.name} (${product.id}) with images:`, product.images);
    }
  }

  console.log("\nAll 10 clean products seeded successfully!");
}

seedCleanProducts().catch(console.error);

