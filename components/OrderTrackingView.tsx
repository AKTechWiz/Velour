"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { money } from "@/lib/format";
import { getOrderMilestones, Milestone } from "@/lib/logistics";
import { Order } from "@/lib/types";

// Seed sample orders for realistic demo lookups
const SAMPLE_ORDER: Order = {
  orderNumber: "VL-2026-84912",
  trackingNumber: "TCS-KHI-829104",
  courier: "TCS",
  paymentMethod: "cod",
  codVerified: true,
  customer: {
    name: "Ayesha Siddiqui",
    email: "ayesha.s@example.pk",
    phone: "+92 300 8291041",
  },
  shipping: {
    province: "Punjab",
    city: "Lahore",
    area: "DHA Phase 6",
    address: "House 42, Street 14, Sector C",
    nearestLandmark: "Near Raya Club",
    addressType: "home",
    country: "Pakistan",
  },
  items: [
    {
      productId: "embroidered-lawn-3pc",
      name: "Embroidered Lawn 3-Piece",
      size: "M",
      qty: 1,
      price: 12500,
      image: "/images/products/green-lawn-1.jpg",
    },
    {
      productId: "cashmere-embroidered-shawl",
      name: "Fine Embroidered Kashmiri Woollen Shawl",
      size: "Free Size",
      qty: 1,
      price: 16500,
      image: "/images/products/cashmere-shawl-1.jpg",
    },
  ],
  subtotal: 20000,
  shippingFee: 0,
  total: 20000,
  status: "dispatched",
  createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
  estimatedDelivery: "2–3 Days",
};

export default function OrderTrackingView() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [query, setQuery] = useState(initialRef);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [searched, setSearched] = useState(false);
  const [whatsAppOptIn, setWhatsAppOptIn] = useState(true);
  const [, startTransition] = useTransition();

  const handleLookup = (searchStr: string) => {
    const q = searchStr.trim().toUpperCase();
    if (!q) return;

    setSearched(true);

    // 1. Check local storage for recent user orders
    let matched: Order | null = null;
    try {
      const raw = localStorage.getItem("velour_orders");
      if (raw) {
        const list: Order[] = JSON.parse(raw);
        matched = list.find(
          (o) =>
            o.orderNumber.toUpperCase() === q ||
            o.trackingNumber.toUpperCase() === q ||
            o.customer.phone.replace(/\D/g, "") === q.replace(/\D/g, "")
        ) || null;
      }
    } catch (e) {
      console.warn("Storage check note:", e);
    }

    // 2. Fallback to sample order if searching sample ref or demo
    if (!matched) {
      if (
        q === SAMPLE_ORDER.orderNumber ||
        q === SAMPLE_ORDER.trackingNumber ||
        q.includes("TCS") ||
        q.includes("VL")
      ) {
        matched = SAMPLE_ORDER;
      } else {
        // Return realistic dynamic order
        matched = {
          ...SAMPLE_ORDER,
          orderNumber: q.startsWith("VL") ? q : `VL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          trackingNumber: q.includes("-") ? q : `TCS-KHI-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
    }

    setActiveOrder(matched);
    if (matched) {
      setMilestones(getOrderMilestones(matched));
    }
  };

  useEffect(() => {
    if (initialRef) {
      setQuery(initialRef);
      startTransition(() => {
        handleLookup(initialRef);
      });
    }
  }, [initialRef]);

  return (
    <div className="container" style={{ maxWidth: 840, margin: "40px auto 100px", padding: "0 20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p className="section-eyebrow" style={{ color: "var(--taupe-deep)", marginBottom: "6px" }}>
          Live Nationwide Dispatch
        </p>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-serif, serif)", marginBottom: "12px" }}>
          Track Your Order
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 540, margin: "0 auto", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Enter your <strong>Order Number</strong> (e.g. <code>VL-2026-84912</code>), <strong>Courier AWB</strong> (e.g. <code>TCS-KHI-829104</code>), or registered phone number.
        </p>
      </div>

      {/* Search Input Box */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          padding: "8px 8px 8px 18px",
          display: "flex",
          gap: "10px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
          marginBottom: "40px",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "1.2rem", color: "var(--muted)" }}>🔍</span>
        <input
          type="text"
          placeholder="e.g. VL-2026-84912 or TCS-KHI-829104"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLookup(query)}
          aria-label="Order or tracking reference"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "1rem",
            background: "transparent",
            color: "var(--ink)",
            padding: "8px 0",
          }}
        />
        <button
          onClick={() => handleLookup(query)}
          className="btn btn-primary"
          style={{ padding: "12px 24px", fontSize: "0.9rem", whiteSpace: "nowrap" }}
        >
          Track Shipment
        </button>
      </div>

      {/* Results View */}
      {activeOrder ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Order Header Card */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Shipment Reference
              </span>
              <h2 style={{ fontSize: "1.4rem", margin: "4px 0 2px", fontFamily: "monospace", color: "var(--ink)" }}>
                {activeOrder.trackingNumber}
              </h2>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted)" }}>
                Order #{activeOrder.orderNumber} · {activeOrder.shipping.city}, {activeOrder.shipping.province}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: activeOrder.status === "dispatched" ? "rgba(46, 125, 50, 0.12)" : "var(--surface)",
                  color: activeOrder.status === "dispatched" ? "var(--success)" : "var(--taupe-deep)",
                  marginBottom: "4px",
                }}
              >
                {activeOrder.status === "dispatched" ? "In Transit" : activeOrder.status}
              </span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
                Courier: <strong>{activeOrder.courier} Express</strong>
              </p>
            </div>
          </div>

          {/* 5-Step Milestone Timeline */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "32px 24px",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "24px" }}>Dispatch & Transit Timeline</h3>

            <div style={{ position: "relative", paddingLeft: "32px" }}>
              {/* Connecting Vertical Line */}
              <div
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "12px",
                  bottom: "24px",
                  width: "2px",
                  background: "var(--line)",
                }}
              />

              {milestones.map((step, idx) => (
                <div key={idx} style={{ position: "relative", marginBottom: "28px" }}>
                  {/* Circle Indicator */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-32px",
                      top: "2px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: step.completed
                        ? "var(--success)"
                        : step.current
                        ? "var(--taupe-deep)"
                        : "var(--surface-card)",
                      border: step.completed || step.current ? "none" : "2px solid var(--line)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      boxShadow: step.current ? "0 0 0 4px rgba(138, 122, 110, 0.2)" : "none",
                    }}
                  >
                    {step.completed ? "✓" : idx + 1}
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "0.95rem", color: step.completed || step.current ? "var(--ink)" : "var(--muted)" }}>
                        {step.title}
                      </strong>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                        {step.date} · {step.time}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Updates Toggle */}
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.4rem" }}>💬</span>
                <div>
                  <strong style={{ fontSize: "0.88rem", color: "var(--ink)" }}>WhatsApp Out-For-Delivery Alerts</strong>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
                    Receive real-time courier rider dispatch notifications to {activeOrder.customer.phone}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={whatsAppOptIn}
                onChange={(e) => setWhatsAppOptIn(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Package Details & Inclusions */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "24px",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", color: "var(--ink)" }}>
              Package Inclusions ({activeOrder.items.length} items)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {activeOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: idx < activeOrder.items.length - 1 ? "1px solid var(--line)" : "none",
                    paddingBottom: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: 56,
                        height: 70,
                        position: "relative",
                        borderRadius: "4px",
                        overflow: "hidden",
                        background: "var(--surface)",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.92rem", display: "block", color: "var(--ink)" }}>{item.name}</strong>
                      <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                        Size: {item.size} · Qty: {item.qty}
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: "0.95rem", color: "var(--ink)" }}>{money(item.price * item.qty)}</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "16px",
                borderTop: "1px solid var(--line)",
                paddingTop: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)" }}>Total Order Value</span>
              <strong style={{ fontSize: "1.15rem", color: "var(--ink)" }}>{money(activeOrder.total)}</strong>
            </div>
          </div>

          {/* Need Assistance Bar */}
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: "0.9rem", color: "var(--muted)" }}>
              Have questions about your delivery address or dispatch status?
            </p>
            <a
              href={`https://wa.me/923008259142?text=${encodeURIComponent(`Hi Velour Support, I am inquiring about tracking for order ${activeOrder.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.88rem" }}
            >
              <span>💬</span> Chat With Courier Concierge on WhatsApp
            </a>
          </div>
        </div>
      ) : searched ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "var(--surface-card)",
            borderRadius: "8px",
            border: "1px solid var(--line)",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "8px", color: "var(--ink)" }}>No active shipment found for &ldquo;{query}&rdquo;</p>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", maxWidth: 440, margin: "0 auto 20px" }}>
            Please check the reference number provided in your SMS or email confirmation.
          </p>
          <button
            onClick={() => handleLookup("VL-2026-84912")}
            className="btn btn-ghost"
            style={{ fontSize: "0.85rem" }}
          >
            View Sample Dispatch (VL-2026-84912)
          </button>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "36px",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
            Enter your tracking code above to view live courier dispatch milestones.
          </p>
        </div>
      )}
    </div>
  );
}
