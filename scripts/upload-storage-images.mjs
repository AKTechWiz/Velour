import { createAdminClient } from "@insforge/sdk";
import fs from "fs";
import path from "path";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://cawv4e2d.us-east.insforge.app";
const apiKey = process.env.INSFORGE_API_KEY || "";

const admin = createAdminClient({ baseUrl, apiKey });

async function uploadAll() {
  const dir = "public/images/products";
  const files = fs.readdirSync(dir);
  const urlMap = {};

  console.log(`Starting upload of ${files.length} images to product-images bucket...`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer], { type: "image/jpeg" });

    const { data, error } = await admin.storage
      .from("product-images")
      .upload(file, blob);

    if (error) {
      console.error(`Failed to upload ${file}:`, error);
    } else {
      console.log(`Uploaded ${file} -> ${data.url}`);
      urlMap[file] = data.url;
    }
  }

  fs.writeFileSync("scripts/uploaded-image-urls.json", JSON.stringify(urlMap, null, 2));
  console.log("All uploads finished! Saved to scripts/uploaded-image-urls.json");
}

uploadAll().catch(console.error);
