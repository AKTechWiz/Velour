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

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export interface ProductQuery {
  category?: "women" | "men" | "outerwear" | "sale" | "accessories";
  sub?: string;
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

  return {
    id,
    slug,
    name,
    category: (["women", "men", "outerwear", "sale", "accessories"].includes(String(row.category))
      ? row.category
      : "women") as "women" | "men" | "outerwear" | "sale" | "accessories",
    subcategory: String(row.subcategory || ""),
    price: Number(row.price || 0),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    description: String(row.description || ""),
    sizes: Array.isArray(row.sizes) ? row.sizes : ["XS", "S", "M", "L", "XL"],
    images,
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    trending: Boolean(row.trending),
    material: row.material ? String(row.material) : undefined,
    color: row.color ? String(row.color) : undefined,
    stock: typeof row.stock === "number" ? row.stock : 20,
    createdAt: row.created_at ? String(row.created_at) : undefined,
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

  // 1. Fetch from InsForge database
  try {
    const { data, error } = await insforge.database
      .from("products")
      .select("*");

    if (!error && data && data.length > 0) {
      const liveList = data.map(mapProduct);
      cachedAllProducts = { data: liveList, timestamp: now };
      return liveList;
    }
  } catch (err) {
    console.warn("InsForge products query error:", err);
  }

  // 2. Fallback to Supabase if configured
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (!error && data && data.length > 0) {
      const liveList = data.map(mapProduct);
      cachedAllProducts = { data: liveList, timestamp: now };
      return liveList;
    }
  } catch {}

  // 3. Bundled fallback
  cachedAllProducts = { data: ALL_PRODUCTS, timestamp: now };
  return ALL_PRODUCTS;
}

export async function getProducts(q: ProductQuery = {}): Promise<Product[]> {
  const all = await fetchBaseProductList();
  let list = [...all];

  if (q.category) {
    if (q.category === "sale") {
      list = list.filter((p) => p.category === "sale" || (p.compareAtPrice && p.compareAtPrice > p.price));
    } else if (q.category === "outerwear") {
      list = list.filter((p) => p.category === "outerwear" || p.subcategory.toLowerCase() === "outerwear");
    } else {
      list = list.filter((p) => p.category === q.category);
    }
  }

  if (q.sub && q.sub !== "all") {
    const target = q.sub.toLowerCase();
    list = list.filter((p) => p.subcategory.toLowerCase() === target);
  }

  return applySort(list, q.sort ?? "featured");
}

export async function getProductsByCategory(
  category: "women" | "men" | "outerwear" | "sale" | "accessories",
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
