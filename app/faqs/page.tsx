"use client";

import { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
  category: "Orders & Delivery" | "Sizing & Stitching" | "Payments & COD" | "Fabric & Care";
}

const FAQS: FaqItem[] = [
  {
    category: "Orders & Delivery",
    q: "How many days will delivery take to my city?",
    a: "Orders in Karachi arrive within 1–2 business days. Deliveries to Lahore, Islamabad, and Rawalpindi take 2–3 business days. Other cities and regional districts across Pakistan take 3–5 business days via TCS or Leopards Express.",
  },
  {
    category: "Orders & Delivery",
    q: "Is nationwide delivery free?",
    a: "Yes! All domestic orders over Rs. 5,000 qualify for complimentary nationwide shipping. For orders below Rs. 5,000, a flat courier fee of Rs. 250 is applied at checkout.",
  },
  {
    category: "Orders & Delivery",
    q: "How do I track my parcel once dispatched?",
    a: "Once dispatched, you will receive an SMS and WhatsApp notification with your unique Airway Bill (AWB) number. You can also track your shipment live anytime on our website at /track.",
  },
  {
    category: "Sizing & Stitching",
    q: "How does the optional Add Stitching service work for unstitched suits?",
    a: "When purchasing an unstitched 3-piece lawn or festive suit, you can opt for Standard Stitched (+Rs. 2,800 in XS to XL) or Custom Tailored (+Rs. 3,800 with your exact bust, waist, and length measurements). Please allow 5 to 7 additional business days for stitching.",
  },
  {
    category: "Sizing & Stitching",
    q: "Where can I view the size chart and measurements?",
    a: "Every product page features an interactive Size Guide link with measurements in both centimeters and inches for Women and Men, as well as model statistics and a 'How to Measure' guide.",
  },
  {
    category: "Payments & COD",
    q: "What payment methods are supported in Pakistan?",
    a: "We support Cash on Delivery (COD) nationwide up to Rs. 40,000, Debit/Credit Cards (Visa, Mastercard, PayPak), Mobile Wallets (JazzCash & Easypaisa), State Bank Raast Instant IBAN payment, and direct bank wire to Meezan Bank.",
  },
  {
    category: "Payments & COD",
    q: "Why do I need to verify my Cash on Delivery (COD) order?",
    a: "To confirm dispatch readiness and prevent courier delivery failures (RTO), COD orders undergo a fast 1-click WhatsApp or SMS OTP verification before warehouse packing.",
  },
  {
    category: "Fabric & Care",
    q: "Are your fabrics 100% pure?",
    a: "Yes. All our lawn suits are woven from combed 80s compact pure cotton, our silks are 100% natural raw and mulberry silks, and our winter suits use authentic handloom khaddar and plush micro-velvet. We do not use polyester blends in our luxury pret lines.",
  },
  {
    category: "Fabric & Care",
    q: "How should I care for embroidered formal garments?",
    a: "Heavily embellished garments (zardozi, tilla, gota, and sequins) should always be dry cleaned by a garment specialist. Do not spray perfume directly on metallic embroidery.",
  },
];

const CATEGORIES = ["All", "Orders & Delivery", "Sizing & Stitching", "Payments & COD", "Fabric & Care"] as const;

export default function FaqsPage() {
  const [activeCat, setActiveCat] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter((f) => {
    const matchCat = activeCat === "All" || f.category === activeCat;
    const matchSearch =
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="container static-page" style={{ maxWidth: 840, margin: "60px auto 100px", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p className="section-eyebrow" style={{ color: "var(--color-primary, #b76e79)", marginBottom: "6px" }}>
          Client Care
        </p>
        <h1 style={{ fontSize: "2.6rem", fontFamily: "var(--font-serif, serif)", marginBottom: "16px" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 520, margin: "0 auto", fontSize: "0.95rem" }}>
          Everything you need to know about deliveries across Pakistan, sizing, custom tailoring, and payments.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "28px" }}>
        <input
          type="text"
          placeholder="Search questions (e.g. delivery time, stitching, COD, lawn)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search frequently asked questions"
          style={{
            width: "100%",
            padding: "14px 18px",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            fontSize: "0.95rem",
            outline: "none",
            background: "var(--surface-card)",
            color: "var(--ink)",
          }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveCat(c)}
            aria-pressed={activeCat === c}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "0.82rem",
              fontWeight: 600,
              border: activeCat === c ? "1px solid var(--taupe-deep)" : "1px solid var(--line)",
              background: activeCat === c ? "var(--taupe-deep)" : "var(--surface-card)",
              color: activeCat === c ? "var(--white)" : "var(--muted)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((item, idx) => {
          const isOpen = openIndex === idx;
          const faqId = `faq-panel-${idx}`;
          const btnId = `faq-btn-${idx}`;
          return (
            <div
              key={idx}
              style={{
                border: "1px solid var(--line)",
                borderRadius: "8px",
                background: "var(--surface-card)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={faqId}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--ink)",
                }}
              >
                <span>{item.q}</span>
                <span style={{ fontSize: "1.2rem", color: "var(--taupe-deep)", marginLeft: "12px" }} aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div
                  id={faqId}
                  role="region"
                  aria-labelledby={btnId}
                  style={{
                    padding: "0 20px 20px",
                    fontSize: "0.92rem",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    borderTop: "1px solid var(--line)",
                    paddingTop: "14px",
                  }}
                >
                  <p style={{ margin: 0 }}>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Banner */}
      <div
        style={{
          marginTop: "48px",
          padding: "24px",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: "0.95rem", color: "var(--ink)" }}>Still have questions? Our client concierge is available 7 days a week.</p>
        <a
          href="https://wa.me/923008259142"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: "12px 24px", fontSize: "0.9rem" }}
        >
          <span>💬</span> WhatsApp Client Support
        </a>
      </div>
    </div>
  );
}
