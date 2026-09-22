import Link from "next/link";
import { IconFacebook, IconInstagram, IconX } from "./Icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/women", label: "Women" },
      { href: "/men", label: "Men" },
      { href: "/women?sort=newest", label: "New Arrivals" },
      { href: "/cart", label: "Your Cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/", label: "Careers" },
    ],
  },
  {
    title: "Support & Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/contact", label: "Shipping & Returns" },
      { href: "/contact", label: "FAQ" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="nav-logo">VELOUR</Link>
          <p>
            Premium minimal apparel for men and women. Considered design,
            honest materials, made to last beyond the season.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><IconInstagram /></a>
            <a href="#" aria-label="X"><IconX /></a>
            <a href="#" aria-label="Facebook"><IconFacebook /></a>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            {col.links.map((l) => (
              <Link key={l.label} href={l.href}>{l.label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {year} VELOUR. All rights reserved. This is a demo storefront.
        </div>
      </div>
    </footer>
  );
}
