import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";

export const metadata: Metadata = {
  title: "Our Heritage & Craftsmanship — VELOUR Pakistan",
  description: "Rooted in historic weaving clusters of Lahore and Multan. Discover Velour's philosophy of authentic Pakistani luxury, pure natural textiles, and ethical karigar ateliers.",
};

export default function AboutPage() {
  return (
    <div className="container static-page" style={{ maxWidth: 860, margin: "60px auto 100px", padding: "0 20px" }}>
      <p className="section-eyebrow" style={{ color: "var(--taupe-deep)", marginBottom: "8px" }}>
        Artisanal Provenance
      </p>
      <h1 style={{ fontSize: "clamp(1.9rem, 5vw, 2.8rem)", fontFamily: "var(--serif)", lineHeight: 1.2, marginBottom: "24px" }}>
        Rooted in Heritage. Crafted for the Modern Subcontinent.
      </h1>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "380px",
          borderRadius: "8px",
          overflow: "hidden",
          margin: "32px 0 40px",
        }}
      >
        <SmartImage
          src="/images/about-karigar-atelier.jpg"
          alt="Master Pakistani Karigar crafting zardozi embroidery on traditional wooden frame"
          fill
          sizes="860px"
          style={{ objectFit: "cover" }}
        />
      </div>

      <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--ink)", marginBottom: "28px" }}>
        Founded with a singular vision to redefine Pakistani luxury apparel, <strong>VELOUR</strong> merges time-honored artisanal needlework with contemporary tailored silhouettes. We reject transient fast-fashion cycles in favor of heirloom textiles: hand-spun raw silks, 80s compact combed lawn, and opulent velvets that drape effortlessly season after season.
      </p>

      <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-serif, serif)", margin: "40px 0 16px" }}>
        The Karigar Guild
      </h2>
      <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "24px" }}>
        At the heart of every Velour ensemble is our guild of master artisans across Multan, Bahawalpur, and Lahore. A single festive formal can take up to 48 hours of concentrated needlecraft — incorporating delicate <em>Kashidakari</em>, hand-embellished <em>Zardozi</em>, metallic <em>Marori</em> wirework, and delicate cutwork hems. We ensure fair living wages, safe dignified ateliers, and healthcare stipends for every craftsperson preserving these heritage crafts.
      </p>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          padding: "32px",
          margin: "40px 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <strong style={{ fontSize: "2rem", fontFamily: "var(--font-serif, serif)", color: "var(--taupe-deep)" }}>
            100%
          </strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block", marginTop: 4 }}>
            Pure Natural Fibers
          </span>
        </div>
        <div>
          <strong style={{ fontSize: "2rem", fontFamily: "var(--font-serif, serif)", color: "var(--taupe-deep)" }}>
            48+ hrs
          </strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block", marginTop: 4 }}>
            Handcraft Per Formal Suit
          </span>
        </div>
        <div>
          <strong style={{ fontSize: "2rem", fontFamily: "var(--font-serif, serif)", color: "var(--taupe-deep)" }}>
            Nationwide
          </strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", display: "block", marginTop: 4 }}>
            Cash on Delivery Dispatch
          </span>
        </div>
      </div>

      <h2 style={{ fontSize: "1.8rem", fontFamily: "var(--font-serif, serif)", margin: "40px 0 16px" }}>
        Our Flagship Studios & Appointments
      </h2>
      <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", marginBottom: "32px" }}>
        Experience our bespoke collections, custom tailoring, and bridal consultations in person at our flagship salons in Clifton, Karachi and Gulberg, Lahore.
      </p>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Link href="/contact" className="btn btn-primary" style={{ padding: "14px 28px" }}>
          Book Private Studio Visit →
        </Link>
        <Link href="/festive" className="btn btn-ghost" style={{ padding: "14px 28px" }}>
          Explore Collections
        </Link>
      </div>
    </div>
  );
}
