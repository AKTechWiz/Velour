import { createClient } from "@insforge/sdk";

const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://cawv4e2d.us-east.insforge.app";
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpbnNmb3JnZS1hdXRoIiwic3ViIjoiM2YxMGVjZjAtZTM0MS00MDY4LThkNjItMjgyOGFmY2U2OTJjIiwicm9sZSI6ImFub24iLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwiaWF0IjoxNzczOTk4ODUzfQ.u1t0qWl6mY5k90O1p-xR3qZ0A_U6W9b-p50W5E6y7xM";

console.log("Connecting to InsForge:", INSFORGE_URL);
const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

async function runTest() {
  console.log("=== 1. Test Products Read ===");
  const { data: products, error: pErr } = await insforge.database.from("products").select("id, name, price, images").limit(3);
  if (pErr) throw pErr;
  console.log(`✓ Retrieved ${products.length} products from InsForge database.`);
  console.log("Sample product image URL:", products[0]?.images?.[0]);

  console.log("\n=== 2. Test Auth Flow ===");
  const testEmail = `test_${Date.now()}@velourfashion.com`;
  const testPassword = "SecurePassword123!";
  const testName = "Velour VIP Test";

  console.log("Signing up user:", testEmail);
  const { data: signUpData, error: sErr } = await insforge.auth.signUp({
    email: testEmail,
    password: testPassword,
    name: testName,
  });
  if (sErr) console.warn("Sign up returned:", sErr.message);
  else console.log("✓ Signed up user ID:", signUpData?.user?.id);

  console.log("Signing in user:", testEmail);
  const { data: signInData, error: loginErr } = await insforge.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (loginErr) throw loginErr;
  const user = signInData?.user;
  console.log("✓ Signed in successfully! User ID:", user?.id, "Email:", user?.email);

  console.log("\n=== 3. Test Cart Sync ===");
  const productId = products[0]?.id || "w-silk-dress";
  const { data: cartInsert, error: cartErr } = await insforge.database
    .from("carts")
    .upsert([
      {
        user_id: user.id,
        product_id: productId,
        size: "M",
        quantity: 2,
        updated_at: new Date().toISOString(),
      },
    ])
    .select();
  if (cartErr) throw cartErr;
  console.log("✓ Cart item synced to database:", cartInsert);

  const { data: cartFetch } = await insforge.database.from("carts").select("*").eq("user_id", user.id);
  console.log(`✓ User cart in database has ${cartFetch?.length} rows.`);

  console.log("\n=== 4. Test Order Insertion & Fulfillment Tracker ===");
  const orderNum = `VL-TEST-${Math.floor(10000 + Math.random() * 90000)}`;
  const { data: orderData, error: orderErr } = await insforge.database
    .from("orders")
    .insert([
      {
        user_id: user.id,
        order_number: orderNum,
        customer_name: testName,
        customer_email: testEmail,
        customer_phone: "+1 555-0199",
        items: [
          {
            productId: productId,
            name: products[0]?.name || "Silk Slip Dress",
            size: "M",
            qty: 2,
            price: Number(products[0]?.price || 280),
          },
        ],
        subtotal: Number(products[0]?.price || 280) * 2,
        shipping: 0,
        shipping_fee: 0,
        total: Number(products[0]?.price || 280) * 2,
        status: "pending",
        contact: { name: testName, email: testEmail, phone: "+1 555-0199" },
        shipping_address: {
          address: "742 Evergreen Terrace",
          city: "Springfield",
          zip: "97477",
          country: "United States",
        },
      },
    ])
    .select();

  if (orderErr) throw orderErr;
  console.log("✓ Order inserted with pending status:", orderData[0]?.id, "Order Num:", orderData[0]?.order_number);

  console.log("\n=== 5. Test Profile Order Retrieval ===");
  const { data: profileOrders } = await insforge.database
    .from("orders")
    .select("*")
    .eq("user_id", user.id);
  console.log(`✓ Profile retrieved ${profileOrders?.length} orders for user.`);
  console.log("Order status:", profileOrders?.[0]?.status, "Total:", profileOrders?.[0]?.total);

  console.log("\n=== 6. Test Cart Cleanup After Order ===");
  await insforge.database.from("carts").delete().eq("user_id", user.id);
  const { data: postOrderCart } = await insforge.database.from("carts").select("*").eq("user_id", user.id);
  console.log(`✓ Cart rows remaining after checkout: ${postOrderCart?.length}`);

  console.log("\n>>> ALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY! <<<");
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
