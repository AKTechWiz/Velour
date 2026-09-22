"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface OrderData {
  id: string;
  order_number: string;
  total: number;
  customer_name: string;
  customer_email: string;
  status: string;
  payment_status: string;
}

const PAYPAL_ME_URL = process.env.NEXT_PUBLIC_PAYPAL_ME_URL || "";
const DEMO_MODE = !PAYPAL_ME_URL || PAYPAL_ME_URL.includes("YourPayPalUsername");

export default function PaymentPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const redirected = useRef(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?orderNumber=${orderId}`);
        const json = await res.json();
        if (json.success && json.order) {
          setOrder(json.order as OrderData);
          setLoading(false);
          return;
        }
      } catch {}

      // Fallback: try to read from sessionStorage if network fails
      const cached = sessionStorage.getItem(`order_${orderId}`);
      if (cached) {
        try {
          setOrder(JSON.parse(cached));
        } catch {}
      }
      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  const handlePayPal = () => {
    if (!order) return;
    setRedirecting(true);
    const amount = order.total.toFixed(2);
    const paypalUrl = `${PAYPAL_ME_URL}/${amount}`;

    // Give user 1.5s to see the redirect message
    setTimeout(() => {
      window.open(paypalUrl, "_blank", "noopener,noreferrer");
    }, 800);
  };

  const handleSimulate = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = `/payment/return?orderId=${orderId}&simulated=true`;
    }, 1200);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "120px 20px" }}>
        <div className="loading-spinner" />
        <p style={{ marginTop: 16, color: "var(--color-muted, #888)" }}>Loading order details…</p>
      </div>
    );
  }

  const total = order?.total ?? 0;
  const orderNum = order?.order_number ?? orderId;
  const customerName = order?.customer_name ?? "Valued Customer";

  return (
    <div className="container" style={{ maxWidth: 560, padding: "80px 20px" }}>
      <div className="auth-card" style={{ textAlign: "center" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p className="section-eyebrow">Order Created</p>
          <h1 style={{ fontSize: "1.7rem", marginBottom: 8 }}>Complete Your Payment</h1>
          <p style={{ color: "var(--color-muted, #888)", fontSize: "0.95rem" }}>
            Hi {customerName}, your order has been placed. Complete payment to confirm it.
          </p>
        </div>

        {/* Order Summary Box */}
        <div
          style={{
            background: "var(--color-surface, #f8f8f8)",
            borderRadius: 12,
            padding: "24px 28px",
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "var(--color-muted, #888)", fontSize: "0.9rem" }}>Order number</span>
            <strong style={{ fontFamily: "monospace", letterSpacing: "0.04em" }}>{orderNum}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--color-muted, #888)", fontSize: "0.9rem" }}>Amount due</span>
            <strong style={{ fontSize: "1.3rem", color: "var(--color-accent, #000)" }}>
              ${total.toFixed(2)} {process.env.NEXT_PUBLIC_CURRENCY || "USD"}
            </strong>
          </div>
        </div>

        {/* Payment Button */}
        {DEMO_MODE ? (
          <div>
            <div
              style={{
                background: "#fff8e1",
                border: "1px solid #ffe082",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 20,
                fontSize: "0.85rem",
                color: "#795548",
                textAlign: "left",
              }}
            >
              <strong>Demo Mode:</strong> Set{" "}
              <code style={{ background: "#f5f5f5", padding: "1px 5px", borderRadius: 4 }}>
                NEXT_PUBLIC_PAYPAL_ME_URL
              </code>{" "}
              in your <code>.env.local</code> to enable live PayPal payments.
            </div>
            <button
              className="btn btn-wide"
              onClick={handleSimulate}
              disabled={redirecting}
              style={{ width: "100%", marginBottom: 12 }}
            >
              {redirecting ? "Simulating payment…" : "Simulate Payment (Demo)"}
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-muted, #888)", marginBottom: 16 }}>
              You will be redirected to PayPal to complete your payment of{" "}
              <strong>${total.toFixed(2)}</strong>.
            </p>
            <button
              className="btn btn-wide"
              onClick={handlePayPal}
              disabled={redirecting}
              style={{
                width: "100%",
                marginBottom: 12,
                background: "#0070ba",
                color: "#fff",
                border: "none",
              }}
            >
              {redirecting ? "Opening PayPal…" : `Pay $${total.toFixed(2)} via PayPal`}
            </button>
            {redirecting && (
              <p style={{ fontSize: "0.85rem", color: "var(--color-muted, #888)", margin: "8px 0 16px" }}>
                PayPal opened in a new tab. Complete payment there, then return here.
              </p>
            )}
            <Link
              href={`/payment/return?orderId=${orderNum}`}
              className="btn"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                marginTop: 8,
                background: "transparent",
                border: "1px solid currentColor",
              }}
            >
              ✓ I&apos;ve paid — confirm my order
            </Link>
          </div>
        )}

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: 24,
            fontSize: "0.85rem",
            color: "var(--color-muted, #888)",
            textDecoration: "underline",
          }}
        >
          Continue shopping without paying
        </Link>
      </div>
    </div>
  );
}
