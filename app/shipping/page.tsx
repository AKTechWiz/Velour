import type { Metadata } from "next";
import Link from "next/link";
import { PAKISTAN_CITIES } from "@/lib/logistics";

export const metadata: Metadata = {
  title: "Nationwide Shipping & Courier Policy — VELOUR Pakistan",
  description: "Learn about VELOUR's domestic courier delivery windows, rates, Cash on Delivery (COD) limits, and courier partners including TCS, Leopards, and PostEx.",
};

export default function ShippingPage() {
  return (
    <div className="container static-page" style={{ maxWidth: 880, margin: "60px auto 100px", padding: "0 20px" }}>
      <p className="section-eyebrow" style={{ color: "var(--taupe-deep)", marginBottom: "6px" }}>
        Domestic Logistics
      </p>
      <h1 style={{ fontSize: "2.6rem", fontFamily: "var(--serif)", marginBottom: "20px" }}>
        Nationwide Delivery & Shipping Policy
      </h1>

      <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--ink-soft)", marginBottom: "32px" }}>
        VELOUR operates a centralized luxury fulfillment center in Karachi, dispatching daily across all four provinces, Islamabad Capital Territory, Gilgit-Baltistan, and Azad Jammu & Kashmir via our premier courier partners: <strong>TCS Express</strong>, <strong>Leopards Courier</strong>, and <strong>PostEx</strong>.
      </p>

      {/* Free Shipping Highlight Banner */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-sm)",
          padding: "20px 24px",
          marginBottom: "36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <strong style={{ fontSize: "1.1rem", color: "var(--ink)", display: "block" }}>
            Complimentary Nationwide Shipping on Orders Over Rs. 5,000
          </strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Standard courier fee of Rs. 250 applies to orders under Rs. 5,000.
          </span>
        </div>
        <Link href="/women" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.85rem" }}>
          Shop Collection
        </Link>
      </div>

      <h2>1. Transit Windows by Major City</h2>
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          margin: "20px 0 36px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "14px 18px", textAlign: "left" }}>City / Region</th>
              <th style={{ padding: "14px 18px", textAlign: "left" }}>Primary Courier</th>
              <th style={{ padding: "14px 18px", textAlign: "left" }}>Estimated Transit</th>
              <th style={{ padding: "14px 18px", textAlign: "center" }}>COD Available</th>
            </tr>
          </thead>
          <tbody>
            {PAKISTAN_CITIES.slice(0, 10).map((c, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "12px 18px", fontWeight: 600 }}>{c.name} ({c.province})</td>
                <td style={{ padding: "12px 18px", color: "var(--muted)" }}>{c.courier} Express</td>
                <td style={{ padding: "12px 18px", color: "var(--success)", fontWeight: 600 }}>{c.transitDays}</td>
                <td style={{ padding: "12px 18px", textAlign: "center" }}>{c.codAvailable ? "✓ Yes" : "Prepaid Only"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>2. Cash on Delivery (COD) Guidelines</h2>
      <p>
        Cash on Delivery is available across 150+ Pakistani cities for orders up to <strong>Rs. 40,000</strong>. To minimize return-to-origin loss and verify order legitimacy, every COD dispatch undergoes an automated 1-click WhatsApp or SMS OTP verification before leaving our warehouse.
      </p>

      <h2>3. Ready-to-Wear vs. Custom Stitched Orders</h2>
      <ul>
        <li><strong>Ready-to-Wear (Pret):</strong> Dispatched within 24–48 business hours.</li>
        <li><strong>Unstitched 3-Piece Fabrics:</strong> Dispatched within 24 hours.</li>
        <li><strong>Custom Stitching / Tailored Ensembles:</strong> Require an additional <strong>5 to 7 business days</strong> for hand-tailoring and quality check before courier dispatch.</li>
      </ul>

      <h2>4. Real-Time Tracking & WhatsApp Alerts</h2>
      <p>
        Once dispatched, you will receive an authentic Airway Bill (AWB) number via SMS and WhatsApp. You can track your shipment anytime via our <Link href="/track" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>Branded Order Tracking Portal</Link>.
      </p>
    </div>
  );
}
