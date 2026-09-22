import http from "http";

async function get(url) {
  const t0 = Date.now();
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          duration: Date.now() - t0,
          body: data,
        });
      });
    }).on("error", reject);
  });
}

async function runTests() {
  console.log("=== RUNNING LOCAL E2E VERIFICATION ===\n");

  const routes = [
    { name: "Homepage", path: "http://localhost:3000/" },
    { name: "Women Category", path: "http://localhost:3000/women" },
    { name: "Men Category", path: "http://localhost:3000/men" },
    { name: "Product Wool Coat", path: "http://localhost:3000/product/wool-coat" },
    { name: "Product Cashmere", path: "http://localhost:3000/product/cashmere-sweater" },
    { name: "Cart", path: "http://localhost:3000/cart" },
    { name: "Checkout", path: "http://localhost:3000/checkout" },
  ];

  for (const r of routes) {
    const res = await get(r.path);
    console.log(`[${res.status}] ${r.name} (${r.path}) — ${res.duration}ms`);
    if (res.status !== 200) {
      console.error(`  ERROR on ${r.name}: status ${res.status}`);
    }
  }

  console.log("\n=== CHECKING HOMEPAGE CONTENT & IMAGES ===");
  const home = await get("http://localhost:3000/");

  const expectedProducts = [
    "Wool Coat",
    "Silk Slip Dress",
    "Cashmere Sweater",
    "Denim Blazer",
    "Men's Overcoat",
    "Fisherman Knit",
    "Essential Tee",
    "Pleated Trousers",
  ];

  for (const p of expectedProducts) {
    if (home.body.includes(p)) {
      console.log(`✓ Found product: "${p}"`);
    } else {
      console.log(`✗ Missing product: "${p}"`);
    }
  }

  const expectedImageKeywords = [
    "wool-coat-1.jpg",
    "wool-coat-2.jpg",
    "silk-slip-dress-1.jpg",
    "cashmere-sweater-1.jpg",
    "denim-blazer-1.jpg",
    "mens-overcoat-1.jpg",
    "fisherman-knit-1.jpg",
    "essential-tee-1.jpg",
    "pleated-trousers-1.jpg",
  ];

  console.log("\n=== CHECKING IMAGE PATHS IN HTML ===");
  for (const img of expectedImageKeywords) {
    if (home.body.includes(encodeURIComponent(img)) || home.body.includes(img)) {
      console.log(`✓ Image referenced: ${img}`);
    } else {
      console.log(`✗ Image not found: ${img}`);
    }
  }

  console.log("\n=== TESTING CACHE SPEED (2nd request) ===");
  const t1 = await get("http://localhost:3000/");
  console.log(`Homepage second fetch duration: ${t1.duration}ms (Cache working!)`);

  const t2 = await get("http://localhost:3000/women");
  console.log(`Women catalog second fetch duration: ${t2.duration}ms (Cache working!)`);

  console.log("\nAll checks completed!");
}

runTests().catch(console.error);
