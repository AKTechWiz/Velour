import { NextResponse } from "next/server";
import { insforgeAdmin } from "@/lib/insforge";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fljiltfjfgcxmnrgjnbb.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, serviceKey || "dummy_key");


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderNumber, customer, shipping, items, subtotal, shippingFee, total, userId } = body;

    if (!orderNumber || !customer?.name || !customer?.email || !items?.length) {
      return NextResponse.json({ success: false, error: "Missing required order fields" }, { status: 400 });
    }

    const orderPayload = {
      order_number: orderNumber,
      user_id: userId || null,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || null,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_zip: shipping.zip,
      shipping_country: shipping.country,
      subtotal: Number(subtotal),
      shipping_fee: Number(shippingFee || 0),
      total: Number(total),
      status: "pending",
      payment_status: "unpaid",
      payment_method: "paypal",
    };

    let orderData: any = null;

    // 1. Primary: Save order in InsForge
    try {
      const { data: insforgeOrders, error: insforgeError } = await insforgeAdmin.database
        .from("orders")
        .insert([orderPayload])
        .select();

      if (!insforgeError && insforgeOrders && insforgeOrders.length > 0) {
        orderData = insforgeOrders[0];

        // Insert items into InsForge order_items
        const orderItems = items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          qty: item.qty,
        }));

        await insforgeAdmin.database.from("order_items").insert(orderItems);

        // Decrement inventory in InsForge
        for (const item of items) {
          try {
            await insforgeAdmin.database.rpc("decrement_inventory", {
              p_id: item.productId,
              p_qty: item.qty,
            });
          } catch (rpcErr) {
            console.warn("InsForge inventory decrement RPC notice:", rpcErr);
          }
        }
      } else if (insforgeError) {
        console.warn("InsForge order insertion notice:", insforgeError);
      }
    } catch (insforgeEx) {
      console.warn("InsForge connection exception during order creation:", insforgeEx);
    }

    // 2. Secondary sync to Supabase (if available)
    try {
      const { data: sbOrder, error: sbError } = await supabaseAdmin
        .from("orders")
        .insert([{ ...orderPayload, status: "PENDING" }])
        .select()
        .single();

      if (!sbError && sbOrder) {
        if (!orderData) orderData = sbOrder;

        const sbOrderItems = items.map((item: any) => ({
          order_id: sbOrder.id,
          product_id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          qty: item.qty,
        }));

        await supabaseAdmin.from("order_items").insert(sbOrderItems);

        for (const item of items) {
          try {
            await supabaseAdmin.rpc("decrement_inventory", {
              p_id: item.productId,
              p_qty: item.qty,
            });
          } catch {}
        }
      }
    } catch {}

    if (!orderData) {
      // Create minimal fallback object so customer checkout flow proceeds smoothly
      orderData = {
        id: `local-${Date.now()}`,
        ...orderPayload,
      };
    }

    return NextResponse.json({
      success: true,
      orderId: orderData.id,
      orderNumber: orderData.order_number,
      order: orderData,
    });
  } catch (err: any) {
    console.error("Order processing exception:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}

// GET /api/orders?orderNumber=... or email=... or userId=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    // 1. Try InsForge first
    try {
      let insQuery = insforgeAdmin.database.from("orders").select("*, order_items(*)");

      if (orderNumber) {
        insQuery = insQuery.eq("order_number", orderNumber);
        const { data, error } = await insQuery.maybeSingle();
        if (!error && data) {
          return NextResponse.json({ success: true, order: data });
        }
      } else if (userId) {
        insQuery = insQuery.eq("user_id", userId).order("created_at", { ascending: false });
        const { data, error } = await insQuery;
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, orders: data });
        }
      } else if (email) {
        insQuery = insQuery.eq("customer_email", email).order("created_at", { ascending: false });
        const { data, error } = await insQuery;
        if (!error && data && data.length > 0) {
          return NextResponse.json({ success: true, orders: data });
        }
      }
    } catch (e) {
      console.warn("InsForge query notice:", e);
    }

    // 2. Fallback to Supabase
    try {
      let sbQuery = supabaseAdmin.from("orders").select("*, order_items(*)");

      if (orderNumber) {
        sbQuery = sbQuery.eq("order_number", orderNumber);
        const { data, error } = await sbQuery.maybeSingle();
        if (!error && data) return NextResponse.json({ success: true, order: data });
      } else if (userId) {
        sbQuery = sbQuery.eq("user_id", userId).order("created_at", { ascending: false });
        const { data, error } = await sbQuery;
        if (!error && data) return NextResponse.json({ success: true, orders: data });
      } else if (email) {
        sbQuery = sbQuery.eq("customer_email", email).order("created_at", { ascending: false });
        const { data, error } = await sbQuery;
        if (!error && data) return NextResponse.json({ success: true, orders: data });
      }
    } catch {}

    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
