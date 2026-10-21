import type { Product, Order } from "./types";
import { BASE_PRODUCTS } from "./data";
import { GENERATED_PRODUCTS } from "./generated-products";
import { supabase } from "./supabase";
import { insforge } from "./insforge";

export const ALL_PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GENERATED_PRODUCTS];

// Map legacy IDs to clean image-matched IDs
export const LEGACY_ID_ALIASES: Record<string, string> = {
  "atelier-wool-coat": "wool-coat",
  "cashmere-crewneck": "cashmere-sweater",
  "wide-leg-organic-denim": "wide-leg-trousers",
  "heavyweight-jersey-tee": "essential-tee",
  "oxford-cotton-shirt": "oxford-shirt",
  "pleated-tailored-trousers": "pleated-trousers",
};

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "discount";

export interface ProductQuery {
  category?: import("./types").Category;
  sub?: string;
  fabric?: string | string[];
  pieceCount?: string | string[];
  occasion?: string | string[];
  sizes?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SortKey;
}

// ------------------------------------------------------------------------------
// FAST IN-MEMORY CACHE
// ------------------------------------------------------------------------------
interface CacheEntry {
  data: Product[];
  timestamp: number;
}

let cachedAllProducts: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function clearProductsCache() {
  cachedAllProducts = null;
}

function mapProduct(row: Record<string, unknown>): Product {
  const id = String(row.id);
  const slug = String(row.slug || row.id);
  const name = String(row.name);
  let images: string[] = [];

  if (Array.isArray(row.images) && row.images.length > 0) {
    images = row.images
      .map((img) => {
        let s = String(img).trim();
        if (!s) return "";
        if (s.includes("\\") || s.startsWith("C:") || s.startsWith("file:")) {
          const parts = s.split(/[\\/]/);
          const filename = parts[parts.length - 1];
          s = `/images/products/${filename}`;
        }
        if (!/\.(jpg|jpeg|png|webp|avif)$/i.test(s) && !s.startsWith("http")) {
          s += ".jpg";
        }
        return s;
      })
      .filter(Boolean);
  }

  // If only 1 primary image is provided ending in -1.jpg, auto-add -2.jpg hover
  if (images.length === 1 && images[0].includes("-1.jpg")) {
    images.push(images[0].replace("-1.jpg", "-2.jpg"));
  }

  // Fallback to local image pairs if empty or broken
  if (images.length === 0) {
    const canonicalId = LEGACY_ID_ALIASES[id] || id;
    images = [`/images/products/${canonicalId}-1.jpg`, `/images/products/${canonicalId}-2.jpg`];
  }

  const validCategories = ["women", "men", "unstitched", "festive", "outerwear", "sale", "accessories"];
  const cat = validCategories.includes(String(row.category)) ? (row.category as import("./types").Category) : "women";

  return {
    id,
    slug,
    name,
    category: cat,
    subcategory: String(row.subcategory || ""),
    price: Number(row.price || 0),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : (row.compareAtPrice ? Number(row.compareAtPrice) : undefined),
    description: String(row.description || ""),
    sizes: Array.isArray(row.sizes) ? row.sizes : ["XS", "S", "M", "L", "XL"],
    images,
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new ?? row.isNew),
    trending: Boolean(row.trending),
    material: row.material ? String(row.material) : undefined,
    color: row.color ? String(row.color) : undefined,
    fabric: row.fabric ? String(row.fabric) : undefined,
    pieceCount: (row.piece_count ? String(row.piece_count) : (row.pieceCount ? String(row.pieceCount) : undefined)) as any,
    workType: (row.work_type ? String(row.work_type) : (row.workType ? String(row.workType) : undefined)) as any,
    occasion: (row.occasion ? String(row.occasion) : undefined) as any,
    unstitchedDetails: (row.unstitched_details || row.unstitchedDetails) as any,
    stitchingAvailable: typeof row.stitching_available === "boolean" ? row.stitching_available : (typeof row.stitchingAvailable === "boolean" ? row.stitchingAvailable : undefined),
    stitchingFee: row.stitching_fee ? Number(row.stitching_fee) : (row.stitchingFee ? Number(row.stitchingFee) : undefined),
    modelInfo: (row.model_info || row.modelInfo) as any,
    stock: typeof row.stock === "number" ? row.stock : 20,
    createdAt: row.created_at ? String(row.created_at) : (row.createdAt ? String(row.createdAt) : undefined),
  };
}

function applySort(list: Product[], sort: SortKey): Product[] {
  const arr = [...list];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "discount":
      return arr.sort((a, b) => {
        const discA = a.compareAtPrice && a.compareAtPrice > a.price ? (a.compareAtPrice - a.price) / a.compareAtPrice : 0;
        const discB = b.compareAtPrice && b.compareAtPrice > b.price ? (b.compareAtPrice - b.price) / b.compareAtPrice : 0;
        return discB - discA;
      });
    case "featured":
    default:
      return arr.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || Number(b.trending) - Number(a.trending)
      );
  }
}

async function fetchBaseProductList(): Promise<Product[]> {
  const now = Date.now();
  if (cachedAllProducts && now - cachedAllProducts.timestamp < CACHE_TTL_MS) {
    return cachedAllProducts.data;
  }

  let dbProducts: Product[] = [];

  // 1. Fetch from InsForge database
  try {
    const { data, error } = await insforge.database
      .from("products")
      .select("*");

    if (!error && data && data.length > 0) {
      dbProducts = data.map(mapProduct);
    }
  } catch (err) {
    console.warn("InsForge products query error:", err);
  }

  // 2. Fallback to Supabase if InsForge is empty
  if (dbProducts.length === 0) {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data && data.length > 0) {
        dbProducts = data.map(mapProduct);
      }
    } catch {}
  }

  // 3. Merge: Guarantee all BASE_PRODUCTS (Pakistani luxury catalogue) are loaded,
  // supplemented by any database products.
  const combinedMap = new Map<string, Product>();

  // Add all curated Pakistani apparel items first
  for (const p of ALL_PRODUCTS) {
    combinedMap.set(p.id, p);
    if (p.slug) combinedMap.set(p.slug, p);
  }

  // Merge database products
  for (const p of dbProducts) {
    const key = p.id;
    if (combinedMap.has(key)) {
      const existing = combinedMap.get(key)!;
      combinedMap.set(key, {
        ...existing,
        stock: p.stock ?? existing.stock,
        // Only override price if DB price is in PKR range (> 1000)
        price: p.price > 1000 ? p.price : existing.price,
      });
    } else {
      // If it's a legacy USD product from early tests, convert to realistic PKR
      const adjustedPrice = p.price < 1000 ? Math.round((p.price * 280) / 100) * 100 : p.price;
      const adjustedCompare = p.compareAtPrice
        ? (p.compareAtPrice < 1000 ? Math.round((p.compareAtPrice * 280) / 100) * 100 : p.compareAtPrice)
        : undefined;

      combinedMap.set(key, {
        ...p,
        price: adjustedPrice,
        compareAtPrice: adjustedCompare,
      });
    }
  }

  // Unique list by ID
  const uniqueProducts: Product[] = [];
  const seenIds = new Set<string>();
  for (const prod of combinedMap.values()) {
    if (!seenIds.has(prod.id)) {
      seenIds.add(prod.id);
      uniqueProducts.push(prod);
    }
  }

  cachedAllProducts = { data: uniqueProducts, timestamp: now };
  return uniqueProducts;
}

export async function getProducts(q: ProductQuery = {}): Promise<Product[]> {
  const all = await fetchBaseProductList();
  let list = [...all];

  if (q.category) {
    if (q.category === "sale") {
      list = list.filter((p) => p.category === "sale" || (p.compareAtPrice && p.compareAtPrice > p.price));
    } else if (q.category === "outerwear") {
      list = list.filter((p) => p.category === "outerwear" || p.subcategory.toLowerCase() === "outerwear" || p.fabric?.toLowerCase() === "velvet");
    } else if (q.category === "unstitched") {
      list = list.filter((p) => p.category === "unstitched" || p.subcategory.toLowerCase() === "unstitched" || Boolean(p.unstitchedDetails));
    } else if (q.category === "festive") {
      list = list.filter((p) => p.category === "festive" || p.subcategory.toLowerCase() === "festive" || p.occasion === "Festive" || p.occasion === "Wedding Guest" || p.occasion === "Bridal");
    } else {
      list = list.filter((p) => p.category === q.category);
    }
  }

  if (q.sub && q.sub !== "all") {
    const target = q.sub.toLowerCase();
    list = list.filter((p) => p.subcategory.toLowerCase() === target);
  }

  // Fabric filter
  if (q.fabric) {
    const fabrics = Array.isArray(q.fabric) ? q.fabric.map(f => f.toLowerCase()) : [q.fabric.toLowerCase()];
    list = list.filter((p) => p.fabric && fabrics.includes(p.fabric.toLowerCase()));
  }

  // Piece count filter
  if (q.pieceCount) {
    const pieces = Array.isArray(q.pieceCount) ? q.pieceCount.map(p => p.toLowerCase()) : [q.pieceCount.toLowerCase()];
    list = list.filter((p) => p.pieceCount && pieces.includes(p.pieceCount.toLowerCase()));
  }

  // Occasion filter
  if (q.occasion) {
    const occasions = Array.isArray(q.occasion) ? q.occasion.map(o => o.toLowerCase()) : [q.occasion.toLowerCase()];
    list = list.filter((p) => p.occasion && occasions.includes(p.occasion.toLowerCase()));
  }

  // Sizes filter
  if (q.sizes) {
    const sizeList = Array.isArray(q.sizes) ? q.sizes : [q.sizes];
    list = list.filter((p) => p.sizes && sizeList.some((s) => p.sizes.includes(s)));
  }

  // Price range filter
  if (typeof q.minPrice === "number") {
    list = list.filter((p) => p.price >= q.minPrice!);
  }
  if (typeof q.maxPrice === "number") {
    list = list.filter((p) => p.price <= q.maxPrice!);
  }

  // In-stock filter
  if (q.inStockOnly) {
    list = list.filter((p) => typeof p.stock === "number" ? p.stock > 0 : true);
  }

  return applySort(list, q.sort ?? "featured");
}

export async function getProductsByCategory(
  category: import("./types").Category,
  sub?: string,
  sort: SortKey = "featured"
): Promise<Product[]> {
  return getProducts({ category, sub, sort });
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const canonicalId = LEGACY_ID_ALIASES[id] || id;

  // 1. Check cached list first (near 0ms)
  const all = await fetchBaseProductList();
  const cachedMatch = all.find(
    (p) => p.id === canonicalId || p.slug === canonicalId || p.id === id || p.slug === id
  );
  if (cachedMatch) return cachedMatch;

  // 2. Try direct InsForge DB query
  try {
    const { data, error } = await insforge.database
      .from("products")
      .select("*")
      .or(`id.eq.${canonicalId},slug.eq.${canonicalId},id.eq.${id},slug.eq.${id}`)
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return mapProduct(data);
    }
  } catch {}

  // 3. Fallback to static bundled list
  return ALL_PRODUCTS.find(
    (p) => p.id === canonicalId || p.slug === canonicalId || p.id === id || p.slug === id
  );
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return getProduct(id);
}

export async function getRelated(id: string, limit = 4): Promise<Product[]> {
  const current = await getProduct(id);
  if (!current) return [];
  const all = await getProducts({ category: current.category });
  return all.filter((p) => p.id !== current.id && p.slug !== current.slug).slice(0, limit);
}

export async function getRelatedProducts(id: string, limit = 4): Promise<Product[]> {
  return getRelated(id, limit);
}

export async function getFlagged(flag: "featured" | "isNew" | "trending", limit = 8): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p[flag]).slice(0, limit);
}

export async function getFeatured(limit = 8): Promise<Product[]> {
  return getFlagged("featured", limit);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return getFeatured(limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return getFlagged("isNew", limit);
}

export async function getNewProducts(limit = 8): Promise<Product[]> {
  return getNewArrivals(limit);
}

export async function getTrending(limit = 8): Promise<Product[]> {
  return getFlagged("trending", limit);
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  return getTrending(limit);
}

export async function searchProducts(term: string, limit = 6): Promise<Product[]> {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const all = await getProducts();
  return all
    .filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.subcategory.toLowerCase().includes(t) ||
        p.category.includes(t) ||
        (p.material && p.material.toLowerCase().includes(t))
    )
    .slice(0, limit);
}

// ------------------------------------------------------------------------------
// REAL DATABASE ORDER & INVENTORY SUBMISSION
// ------------------------------------------------------------------------------
export async function createSupabaseOrder(order: Order): Promise<{ success: boolean; error?: string; orderId?: string }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...order,
        userId: user?.id ?? null,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to place order";
    return { success: false, error: message };
  }
}
