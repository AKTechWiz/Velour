import { createAdminClient } from "@insforge/sdk";
import fs from "fs";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://cawv4e2d.us-east.insforge.app";
const apiKey = process.env.INSFORGE_API_KEY || "";

const admin = createAdminClient({ baseUrl, apiKey });

const urlMap = JSON.parse(fs.readFileSync("scripts/uploaded-image-urls.json", "utf8"));

const productMappings = [
  { id: "atelier-wool-coat", img1: "wool-coat-1.jpg", img2: "wool-coat-2.jpg" },
  { id: "silk-slip-dress", img1: "silk-slip-dress-1.jpg", img2: "silk-slip-dress-2.jpg" },
  { id: "cashmere-crewneck", img1: "cashmere-sweater-1.jpg", img2: "cashmere-sweater-2.jpg" },
  { id: "wide-leg-organic-denim", img1: "wide-leg-trousers-1.jpg", img2: "wide-leg-trousers-2.jpg" },
  { id: "denim-blazer", img1: "denim-blazer-1.jpg", img2: "denim-blazer-2.jpg" },
  { id: "oxford-cotton-shirt", img1: "oxford-shirt-1.jpg", img2: "oxford-shirt-2.jpg" },
  { id: "heavyweight-jersey-tee", img1: "essential-tee-1.jpg", img2: "essential-tee-2.jpg" },
  { id: "mens-overcoat", img1: "mens-overcoat-1.jpg", img2: "mens-overcoat-2.jpg" },
  { id: "fisherman-knit", img1: "fisherman-knit-1.jpg", img2: "fisherman-knit-2.jpg" },
  { id: "pleated-tailored-trousers", img1: "pleated-trousers-1.jpg", img2: "pleated-trousers-2.jpg" }
];

async function updateProductsWithStorageUrls() {
  console.log("Updating products with storage URLs...");
  for (const m of productMappings) {
    const images = [urlMap[m.img1], urlMap[m.img2]];
    const { data, error } = await admin.database
      .from("products")
      .update({ images })
      .eq("id", m.id)
      .select();

    if (error) {
      console.error(`Error updating product ${m.id}:`, error);
    } else {
      console.log(`Updated ${m.id} with storage URLs:`, images);
    }
  }
  console.log("Product storage URL update complete!");
}

updateProductsWithStorageUrls().catch(console.error);
