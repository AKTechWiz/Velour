import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load environment variables manually
const envPath = resolve(process.cwd(), ".env.local");
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fljiltfjfgcxmnrgjnbb.supabase.co";
let supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
      if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseKey = val;
    }
  }
}

console.log("Connecting to Supabase at:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    const { data, error } = await supabase.from("products").select("id, name, stock").limit(5);
    if (error) {
      console.log("\n⚠️  Note: 'products' table does not exist in Supabase yet.");
      console.log("👉 Please run the SQL in 'supabase/schema.sql' inside your Supabase Dashboard SQL Editor!");
      console.log("   Error details:", error.message);
      return;
    }

    console.log(`\n✅ Connected to Supabase successfully!`);
    console.log(`Found ${data.length} products in your Supabase 'products' table:`);
    console.table(data);
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

checkConnection();
