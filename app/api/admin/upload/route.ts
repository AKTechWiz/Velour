import { NextResponse } from "next/server";
import { insforgeAdmin } from "@/lib/insforge";
import { clearProductsCache } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const productId = (formData.get("productId") as string || "").trim();

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const bytes = await file.arrayBuffer();
      const blob = new Blob([bytes], { type: file.type || "image/jpeg" });

      // Clean file key
      const suffix = i === 0 ? "1" : "2";
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storageKey = productId
        ? `products/${productId}-${suffix}.jpg`
        : `uploads/${Date.now()}_${cleanName}`;

      const { data, error } = await insforgeAdmin.storage
        .from("product-images")
        .upload(storageKey, blob);

      if (error) {
        console.error("Storage upload error:", error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
      }

      const { data: urlData } = insforgeAdmin.storage
        .from("product-images")
        .getPublicUrl(storageKey);

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    // If productId was provided, attach to product in DB
    if (productId && uploadedUrls.length > 0) {
      const { data: existingRows } = await insforgeAdmin.database
        .from("products")
        .select("id, images")
        .or(`id.eq.${productId},slug.eq.${productId}`)
        .limit(1);

      const existing = existingRows?.[0];
      if (existing) {
        const currentImages = Array.isArray(existing.images) ? existing.images : [];
        const merged = Array.from(new Set([...currentImages, ...uploadedUrls]));
        await insforgeAdmin.database
          .from("products")
          .update({ images: merged })
          .eq("id", existing.id);
        clearProductsCache();
      }
    }

    return NextResponse.json({
      success: true,
      uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
