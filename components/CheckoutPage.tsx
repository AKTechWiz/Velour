"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { money } from "@/lib/format";
import { useCart, useToast } from "@/lib/store";
import { insforge } from "@/lib/insforge";

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FLAT = 8;

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  country: "",
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

interface ConfirmedOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  itemCount: number;
  email: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { push } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser({ id: data.user.id, email: data.user.email });
        setForm((f) => ({
          ...f,
          email: f.email || data.user.email || "",
          name: f.name || data.user.profile?.name || "",
        }));
      }
    });
  }, []);

  const set = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        push("Receipt file must be under 10MB", "info");
        return;
      }
      setReceiptFile(file);
      push(`Selected receipt: ${file.name}`);
    }
  };

  const validate = (): boolean => {
    const er: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) er.name = "Full name is required";
    if (!isEmail(form.email)) er.email = "Enter a valid email address";
    if (!form.phone.trim()) er.phone = "Phone number is required";
    if (!form.address.trim()) er.address = "Street address is required";
    if (!form.city.trim()) er.city = "City is required";
    if (!form.zip.trim()) er.zip = "ZIP / Postal code is required";
    if (!form.country.trim()) er.country = "Country is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      let receiptUrl: string | null = null;

      // 1. Upload receipt to payment-uploads bucket if attached
      if (receiptFile) {
        const { data: uploadData, error: uploadErr } = await insforge.storage
          .from("payment-uploads")
          .uploadAuto(receiptFile);

        if (uploadErr) {
          console.warn("Receipt upload warning:", uploadErr);
        } else if (uploadData?.url) {
          receiptUrl = uploadData.url;
        }
      }

      // 2. Generate clean order number
      const num = `VL-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      // 3. Item snapshots with real prices
      const itemsSnapshot = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        qty: i.qty,
        price: i.price,
        image: i.image,
      }));

      // 4. Insert order row into InsForge database
      const orderPayload = {
        user_id: currentUser?.id || null,
        items: itemsSnapshot,
        subtotal,
        shipping,
        shipping_fee: shipping,
        total,
        status: "pending",
        contact: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        shipping_address: {
          address: form.address.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
          country: form.country.trim(),
        },
        payment_receipt_url: receiptUrl,
        order_number: num,
        customer_name: form.name.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
      };

      const { data: insertedOrder, error: insertError } = await insforge.database
        .from("orders")
        .insert([orderPayload])
        .select("id, order_number, status, total");

      if (insertError) {
        console.error("Order insertion failed:", insertError);
        push(`Order creation failed: ${insertError.message}`, "info");
        setSubmitting(false);
        return;
      }

      const realId = insertedOrder?.[0]?.id || num;
      const realOrderNum = insertedOrder?.[0]?.order_number || num;

      // 5. Clear cart and set confirmation state
      clearCart();
      push("Order placed successfully! Initial status: pending");
      setConfirmedOrder({
        id: realId,
        orderNumber: realOrderNum,
        total,
        status: "pending",
        itemCount: items.length,
        email: form.email.trim(),
      });
    } catch (err: unknown) {
      console.error("Unexpected checkout error:", err);
      push(err instanceof Error ? err.message : "Error placing order", "info");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // CONFIRMATION VIEW
  // -------------------------------------------------------------
  if (confirmedOrder) {
    return (
      <div className="container cart-page" style={{ maxWidth: 640, margin: "60px auto" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--line, #e5e0d8)",
            borderRadius: "8px",
            padding: "40px 32px",
            textAlign: "center",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#2a9d8f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              margin: "0 auto 20px",
            }}
          >
            ✓
          </div>

          <p className="section-eyebrow" style={{ color: "#2a9d8f", marginBottom: 6 }}>
            Order Confirmed
          </p>
          <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>Thank You For Your Order</h1>
          <p style={{ color: "var(--muted, #777)", fontSize: "0.95rem", marginBottom: 28 }}>
            A confirmation receipt has been sent to <strong>{confirmedOrder.email}</strong>.
          </p>

          <div
            style={{
              background: "var(--color-surface, #faf8f5)",
              border: "1px solid var(--line, #eee)",
              borderRadius: "6px",
              padding: "20px 24px",
              textAlign: "left",
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Order Reference</span>
              <strong style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>{confirmedOrder.orderNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Database ID</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#555" }}>
                {confirmedOrder.id}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Initial Status</span>
              <span
                style={{
                  background: "#f4a261",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  padding: "3px 10px",
                  borderRadius: "12px",
                }}
              >
                {confirmedOrder.status}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--line)",
                paddingTop: 12,
              }}
            >
              <span style={{ fontWeight: 600 }}>Total Paid</span>
              <strong style={{ fontSize: "1.1rem" }}>{money(confirmedOrder.total)}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/profile" className="btn btn-primary" style={{ padding: "12px 24px" }}>
              View Order in Profile
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ padding: "12px 24px" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // EMPTY CART
  // -------------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <div className="empty-state">
          <h2>Nothing to check out</h2>
          <p>Your bag is empty.</p>
          <Link href="/women" className="btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const field = (
    k: keyof FormState,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div className={`field ${errors[k] ? "invalid" : ""}`}>
      <label htmlFor={k}>{label}</label>
      <input id={k} value={form[k]} onChange={set(k)} {...props} />
      {errors[k] && <span className="field-error">{errors[k]}</span>}
    </div>
  );

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      <form className="checkout-layout" onSubmit={placeOrder} noValidate>
        <div>
          <section className="form-section">
            <h2>Contact Information</h2>
            <div className="form-grid">
              <div className="full">{field("name", "Full name", { autoComplete: "name" })}</div>
              {field("email", "Email", { type: "email", autoComplete: "email" })}
              {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
            </div>
          </section>

          <section className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-grid">
              <div className="full">
                {field("address", "Street address", { autoComplete: "street-address" })}
              </div>
              {field("city", "City", { autoComplete: "address-level2" })}
              {field("zip", "ZIP / Postal code", { autoComplete: "postal-code" })}
              <div className="full">
                {field("country", "Country", { autoComplete: "country-name" })}
              </div>
            </div>
          </section>

          {/* Payment Receipt Upload */}
          <section className="form-section">
            <h2>Payment & Proof of Receipt</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 16 }}>
              Upload your payment receipt or transfer confirmation (PNG, JPG, or PDF). Your order will be placed with initial <strong>Pending</strong> status until verified.
            </p>
            <div
              style={{
                border: "2px dashed var(--line, #ddd)",
                borderRadius: "8px",
                padding: "24px 20px",
                background: "var(--color-surface, #faf8f5)",
                textAlign: "center",
              }}
            >
              <input
                type="file"
                id="receipt-file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label
                htmlFor="receipt-file"
                className="btn btn-ghost"
                style={{ cursor: "pointer", display: "inline-block", marginBottom: 10 }}
              >
                {receiptFile ? "Change Receipt File" : "Choose Receipt (Image / PDF)"}
              </label>
              {receiptFile ? (
                <p style={{ fontSize: "0.85rem", color: "#2a9d8f", fontWeight: 600, margin: 0 }}>
                  Selected: {receiptFile.name} ({(receiptFile.size / 1024).toFixed(1)} KB)
                </p>
              ) : (
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
                  Optional for online transfers / bank deposit verification
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="summary">
          <h2>Order Summary</h2>
          <div className="summary-mini" style={{ marginBottom: 16 }}>
            {items.map((i) => (
              <div className="summary-mini-item" key={`${i.productId}-${i.size}`}>
                <span>
                  {i.name} · {i.size} × {i.qty}
                </span>
                <span>{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <button type="submit" className="btn btn-wide" disabled={submitting}>
            {submitting ? "Placing order…" : "Place Order"}
          </button>
          <p className="shipping-note">
            Your order will be securely recorded in the InsForge database with initial pending status.
          </p>
        </aside>
      </form>
    </div>
  );
}
