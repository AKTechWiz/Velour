import Link from "next/link";
import { IconFacebook, IconInstagram, IconX } from "./Icons";

const COLUMNS = [
  {
    title: "Collections",
    links: [
      { href: "/women", label: "Ready-to-Wear (Pret)" },
      { href: "/unstitched", label: "Luxury Unstitched Lawn" },
      { href: "/festive", label: "Festive & Wedding Formals" },
      { href: "/men", label: "Men's Kurtas & Waistcoats" },
      { href: "/sale", label: "Seasonal Sale" },
    ],
  },
  {
    title: "Client Concierge",
    links: [
      { href: "/track", label: "Track Your Shipment" },
      { href: "/contact", label: "Flagship Salons (Karachi & Lahore)" },
      { href: "/contact", label: "Book Bridal Appointment" },
      { href: "/about", label: "The Karigar Guild & Heritage" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { href: "/shipping", label: "Nationwide Shipping & Rates" },
      { href: "/exchanges", label: "14-Day Hassle-Free Exchanges" },
      { href: "/faqs", label: "Frequently Asked Questions" },
      { href: "/privacy", label: "Privacy & Data Protection" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" style={{ borderTop: "1px solid var(--line)", background: "var(--white)", paddingTop: "60px" }}>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="nav-logo" style={{ fontSize: "1.6rem", letterSpacing: "0.15em", fontFamily: "var(--serif)" }}>
            VELOUR
          </Link>
          <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, margin: "16px 0 20px" }}>
            Contemporary Pakistani luxury apparel crafted from pure natural textiles. Hand-embroidered in Multan and Lahore; dispatched nationwide with authentic courier tracking.
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Client Hotline:</span>
            <strong style={{ fontSize: "0.85rem", color: "var(--ink)" }}>+92 (21) 3584-9142</strong>
          </div>

          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X"><IconX /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook /></a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="footer-col">
            <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", color: "var(--ink)" }}>
              {col.title}
            </h4>
            {col.links.map((l, i) => (
              <Link key={i} href={l.href} style={{ display: "block", marginBottom: "10px", fontSize: "0.85rem", color: "var(--muted)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Payment Badges Strip */}
      <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "18px 0", background: "var(--surface)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--muted)" }}>
            <span>Verified Domestic Logistics:</span>
            <strong style={{ color: "var(--ink)" }}>TCS Express · Leopards · PostEx</strong>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", background: "var(--white)", border: "1px solid var(--line)", color: "var(--ink)", padding: "4px 8px", borderRadius: "4px", fontWeight: 600 }}>
              Cash on Delivery (COD)
            </span>
            <span style={{ fontSize: "0.75rem", background: "var(--white)", border: "1px solid var(--line)", color: "var(--ink)", padding: "4px 8px", borderRadius: "4px", fontWeight: 600 }}>
              Visa / Mastercard
            </span>
            <span style={{ fontSize: "0.75rem", background: "var(--white)", border: "1px solid var(--line)", color: "var(--ink)", padding: "4px 8px", borderRadius: "4px", fontWeight: 600 }}>
              PayPak
            </span>
            <span style={{ fontSize: "0.75rem", background: "var(--white)", border: "1px solid var(--line)", color: "var(--ink)", padding: "4px 8px", borderRadius: "4px", fontWeight: 600 }}>
              JazzCash
            </span>
            <span style={{ fontSize: "0.75rem", background: "var(--white)", border: "1px solid var(--line)", color: "var(--ink)", padding: "4px 8px", borderRadius: "4px", fontWeight: 600 }}>
              Easypaisa
            </span>
            <span style={{ fontSize: "0.75rem", background: "var(--white)", border: "1px solid var(--line)", padding: "4px 8px", borderRadius: "4px", fontWeight: 600, color: "var(--success)" }}>
              State Bank Raast
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
            © {year} VELOUR APPAREL (PVT.) LTD. All rights reserved. NTN: 8941029-7. Karachi · Lahore · Islamabad.
          </p>
          <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem" }}>
            <Link href="/privacy" style={{ color: "var(--muted)" }}>Privacy</Link>
            <Link href="/shipping" style={{ color: "var(--muted)" }}>Shipping</Link>
            <Link href="/exchanges" style={{ color: "var(--muted)" }}>Exchanges</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
