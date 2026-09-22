import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { insforgeAdmin } from "@/lib/insforge";
import { clearProductsCache } from "@/lib/api";

function invalidateStorePaths() {
  try {
    revalidatePath("/");
    revalidatePath("/women");
    revalidatePath("/men");
    revalidatePath("/outerwear");
    revalidatePath("/sale");
    revalidatePath("/accessories");
  } catch (e) {
    console.warn("revalidatePath error:", e);
  }
}

const VALID_COLUMNS = new Set([
  "id",
  "slug",
  "name",
  "category",
  "subcategory",
  "price",
  "compare_at_price",
  "description",
  "sizes",
  "images",
  "featured",
  "is_new",
  "trending",
  "material",
  "color",
  "stock",
]);

function sanitizeProduct(raw: Record<string, unknown>) {
  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (VALID_COLUMNS.has(key) && val !== undefined) {
      sanitized[key] = val;
    }
  }

  // Ensure types
  if (sanitized.price !== undefined) sanitized.price = Number(sanitized.price) || 0;
  if (sanitized.compare_at_price !== undefined && sanitized.compare_at_price !== null) {
    sanitized.compare_at_price = Number(sanitized.compare_at_price) || null;
  }
  if (sanitized.stock !== undefined) sanitized.stock = Math.max(0, parseInt(String(sanitized.stock), 10) || 0);
  if (Array.isArray(sanitized.sizes)) sanitized.sizes = sanitized.sizes.map(String);
  if (Array.isArray(sanitized.images)) {
    sanitized.images = sanitized.images
      .map((img) => {
        let s = String(img).trim();
        if (!s) return "";
        // Convert Windows local path or file URL to web path
        if (s.includes("\\") || s.startsWith("C:") || s.startsWith("file:")) {
          const parts = s.split(/[\\/]/);
          const filename = parts[parts.length - 1];
          s = `/images/products/${filename}`;
        }
        // Ensure image extension if it's a relative path
        if (!/\.(jpg|jpeg|png|webp|avif)$/i.test(s) && !s.startsWith("http")) {
          s += ".jpg";
        }
        return s;
      })
      .filter(Boolean);
  }
  if (sanitized.featured !== undefined) sanitized.featured = Boolean(sanitized.featured);
  if (sanitized.is_new !== undefined) sanitized.is_new = Boolean(sanitized.is_new);
  if (sanitized.trending !== undefined) sanitized.trending = Boolean(sanitized.trending);

  return sanitized;
}

// GET /api/admin/products - List all products
export async function GET() {
  try {
    const { data, error } = await insforgeAdmin.database
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/admin/products - Create a new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sanitized = sanitizeProduct(body);

    if (!sanitized.name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    // Generate slug & id if not provided
    const baseSlug = String(sanitized.slug || sanitized.name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const id = String(sanitized.id || baseSlug || `prod-${Date.now()}`);
    const slug = baseSlug || id;

    sanitized.id = id;
    sanitized.slug = slug;
    if (!sanitized.category) sanitized.category = "women";
    if (!sanitized.subcategory) sanitized.subcategory = "Apparel";
    if (!sanitized.sizes || !Array.isArray(sanitized.sizes) || sanitized.sizes.length === 0) {
      sanitized.sizes = ["XS", "S", "M", "L", "XL"];
    }
    if (!sanitized.images || !Array.isArray(sanitized.images)) {
      sanitized.images = [];
    }

    const { data, error } = await insforgeAdmin.database
      .from("products")
      .insert([sanitized])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    clearProductsCache();
    invalidateStorePaths();
    return NextResponse.json({ success: true, product: data?.[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/admin/products - Update an existing product
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id || "");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const sanitized = sanitizeProduct(body);
    delete sanitized.id; // don't mutate primary key

    const { data, error } = await insforgeAdmin.database
      .from("products")
      .update(sanitized)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    clearProductsCache();
    invalidateStorePaths();
    return NextResponse.json({ success: true, product: data?.[0] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/admin/products?id=... - Delete a product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const { error } = await insforgeAdmin.database
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    clearProductsCache();
    invalidateStorePaths();
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
