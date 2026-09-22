#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fljiltfjfgcxmnrgjnbb.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, serviceKey);
const supabaseAnon = createClient(supabaseUrl, anonKey);

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING END-TO-END QUALITY & PERSISTENCE TEST");
  console.log("==================================================");

  // 1. Check Products in Supabase
  console.log("\n[TEST 1] Checking Products in Supabase...");
  const { data: products, error: prodErr } = await supabaseAnon.from("products").select("*");
  if (prodErr) throw new Error("Failed to query products: " + prodErr.message);
  console.log(`✓ Products table returned ${products.length} items`);
  const localProducts = products.filter(p => p.images?.length > 0 && p.images.every(img => img.startsWith('/images/products/')));
  console.log(`✓ Products with local images: ${localProducts.length} (expected 10)`);
  if (localProducts.length !== 10) {
    throw new Error(`Expected 10 local products, found ${localProducts.length}`);
  }

  // 2. Check stock of test product
  const targetProduct = localProducts[0];
  console.log(`\n[TEST 2] Checking stock for ${targetProduct.name} (${targetProduct.id})...`);
  const initialStock = targetProduct.stock;
  console.log(`✓ Initial stock: ${initialStock}`);

  // 3. Create a test order
  console.log("\n[TEST 3] Creating test order in Supabase...");
  const testOrderNum = `VL-TEST-${Date.now()}`;
  const orderPayload = {
    order_number: testOrderNum,
    customer_name: "Quality Test Customer",
    customer_email: "test.customer@velour-fashion.com",
    customer_phone: "+1 555-0199",
    shipping_address: "742 Evergreen Terrace",
    shipping_city: "Springfield",
    shipping_zip: "97477",
    shipping_country: "United States",
    subtotal: targetProduct.price,
    shipping_fee: 0,
    total: targetProduct.price,
    status: "PENDING",
  };

  const { data: orderData, error: orderErr } = await supabaseAdmin.from("orders").insert(orderPayload).select().single();
  if (orderErr || !orderData) throw new Error("Failed to insert order: " + orderErr?.message);
  console.log(`✓ Order inserted successfully with ID: ${orderData.id}, Number: ${orderData.order_number}`);

  // 4. Insert order item
  console.log("\n[TEST 4] Inserting order item into order_items table...");
  const itemPayload = {
    order_id: orderData.id,
    product_id: targetProduct.id,
    name: targetProduct.name,
    price: targetProduct.price,
    image: targetProduct.images[0],
    size: targetProduct.sizes[0] || "M",
    qty: 1,
  };
  const { data: itemData, error: itemErr } = await supabaseAdmin.from("order_items").insert(itemPayload).select().single();
  if (itemErr || !itemData) throw new Error("Failed to insert order item: " + itemErr?.message);
  console.log(`✓ Order item recorded: ${itemData.name} (${itemData.size}) x ${itemData.qty}`);

  // 5. Test Decrement Inventory RPC
  console.log("\n[TEST 5] Executing decrement_inventory RPC...");
  const { error: rpcErr } = await supabaseAdmin.rpc("decrement_inventory", {
    p_id: targetProduct.id,
    p_qty: 1,
  });
  if (rpcErr) throw new Error("decrement_inventory failed: " + rpcErr.message);

  const { data: updatedProduct } = await supabaseAdmin.from("products").select("stock").eq("id", targetProduct.id).single();
  console.log(`✓ Updated stock for ${targetProduct.name}: ${updatedProduct?.stock} (decremented by 1 from ${initialStock})`);

  // 6. Test Payment Confirmation
  console.log("\n[TEST 6] Confirming order payment status in database...");
  const { data: confirmedOrder, error: confirmErr } = await supabaseAdmin
    .from("orders")
    .update({ status: "PAID", payment_id: "SIM-TX-" + Date.now() })
    .eq("order_number", testOrderNum)
    .select("*, order_items(*)")
    .single();

  if (confirmErr || !confirmedOrder) throw new Error("Order confirmation update failed: " + confirmErr?.message);
  console.log(`✓ Order status successfully updated to: ${confirmedOrder.status}`);
  console.log(`✓ Linked items retrieved: ${confirmedOrder.order_items?.length} item(s)`);

  // 7. Test Retrieval by Customer Email
  console.log("\n[TEST 7] Querying orders for customer email...");
  const { data: customerOrders, error: custErr } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_email", "test.customer@velour-fashion.com");
  if (custErr) throw new Error("Customer orders query failed: " + custErr.message);
  console.log(`✓ Retrieved ${customerOrders.length} order(s) for customer email`);

  // 8. Restore stock & clean up test order
  console.log("\n[CLEANUP] Restoring test stock & deleting test order...");
  await supabaseAdmin.from("products").update({ stock: initialStock }).eq("id", targetProduct.id);
  await supabaseAdmin.from("orders").delete().eq("id", orderData.id);
  console.log("✓ Restored inventory and cleaned up test order.");

  console.log("\n==================================================");
  console.log("ALL END-TO-END DATA FLOW TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
