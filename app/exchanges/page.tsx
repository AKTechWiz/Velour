import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy — VELOUR Pakistan",
  description: "VELOUR offers a hassle-free 14-day domestic exchange policy. Learn about eligible apparel items, reverse courier pickup, and salon exchanges.",
};

export default function ExchangesPage() {
  return (
    <div className="container static-page" style={{ maxWidth: 840, margin: "60px auto 100px", padding: "0 20px" }}>
      <p className="section-eyebrow" style={{ color: "var(--taupe-deep)", marginBottom: "6px" }}>
        Customer Satisfaction
      </p>
      <h1 style={{ fontSize: "2.6rem", fontFamily: "var(--serif)", marginBottom: "20px" }}>
        14-Day Hassle-Free Exchange Policy
      </h1>

      <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--ink-soft)", marginBottom: "28px" }}>
        We take immense pride in the craftsmanship and cut of our garments. If an unstitched suit or standard pret size does not meet your expectations, we offer a straightforward <strong>14-day domestic exchange window</strong> from the date of delivery.
      </p>

      <h2>1. Exchange Eligibility Window</h2>
      <p>
        Requests must be initiated within <strong>14 calendar days</strong> of receiving your parcel. Items must be returned in their original luxury packaging with all garment seals, tags, and embroidered extra borders intact.
      </p>

      <h2>2. Eligible vs. Non-Exchangeable Pieces</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", margin: "20px 0 28px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "20px" }}>
          <strong style={{ color: "var(--success)", display: "block", marginBottom: "8px" }}>✓ Eligible for Exchange</strong>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.6 }}>
            <li>Standard Ready-to-Wear (XS, S, M, L, XL) with size mismatch.</li>
            <li>Unstitched 3-Piece fabrics in uncut condition.</li>
            <li>Defective, flawed, or transit-damaged items.</li>
          </ul>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "20px" }}>
          <strong style={{ color: "var(--danger)", display: "block", marginBottom: "8px" }}>✕ Non-Exchangeable</strong>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem", color: "var(--ink)", lineHeight: 1.6 }}>
            <li>Custom Tailored or altered ensembles crafted to customer measurements.</li>
            <li>Worn, washed, or perfumed items.</li>
            <li>Clearance and Flash Sale items marked &apos;Final Sale&apos;.</li>
          </ul>
        </div>
      </div>

      <h2>3. How to Initiate an Exchange</h2>
      <ol style={{ lineHeight: 1.8, fontSize: "0.95rem" }}>
        <li>
          <strong>WhatsApp Concierge:</strong> Message our exchange desk at <a href="https://wa.me/923008259142?text=Hi%20Velour%2C%20I%20would%20like%20to%20request%20an%20exchange%20for%20my%20order." target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>+92 300 8259142</a> with your Order # and requested replacement size.
        </li>
        <li>
          <strong>Reverse Courier Pickup:</strong> We will book a reverse pickup with TCS or Leopards from your doorstep (nominal Rs. 250 reverse courier fee waived for size or quality flaws).
        </li>
        <li>
          <strong>Flagship Salon Drop-off:</strong> Alternatively, you may exchange directly at our Karachi or Lahore salons with your original digital invoice.
        </li>
      </ol>

      <div style={{ marginTop: "36px", padding: "24px", background: "var(--color-surface, #faf8f5)", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ margin: "0 0 12px", fontSize: "0.95rem" }}>Need immediate assistance with an exchange or size alteration?</p>
        <a
          href="https://wa.me/923008259142?text=Hello%20Velour%2C%20I%20need%20assistance%20with%20an%20exchange."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: "12px 24px", fontSize: "0.9rem" }}
        >
          <span>💬</span> Chat With Exchange Desk on WhatsApp
        </a>
      </div>
    </div>
  );
}
