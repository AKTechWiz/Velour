import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductCarousel from "@/components/ProductCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import SmartImage from "@/components/SmartImage";
import CampaignSpotlight from "@/components/CampaignSpotlight";
import Newsletter from "@/components/Newsletter";
import { getFlagged } from "@/lib/api";

export const dynamic = "force-dynamic";

const FEATURED_PORTALS = [
  {
    slug: "festive",
    label: "Festive & Formals",
    tag: "The Couture Edit",
    image: "/images/products/organza-festive-1.jpg",
    action: "Explore Festive",
  },
  {
    slug: "unstitched",
    label: "Luxury Unstitched",
    tag: "Artisanal Lawn",
    image: "/images/products/green-lawn-1.jpg",
    action: "Shop Unstitched",
  },
  {
    slug: "women",
    label: "Women's Pret",
    tag: "Ready-To-Wear",
    image: "/images/products/emerald-angrakha-1.jpg",
    action: "Explore Pret",
  },
  {
    slug: "men",
    label: "Men's Eastern",
    tag: "Gentlemen's Atelier",
    image: "/images/products/mens-rawsilk-1.jpg",
    action: "Shop Menswear",
  },
];

export default async function HomePage() {
  const [featured, isNew] = await Promise.all([
    getFlagged("featured", 8),
    getFlagged("isNew", 8),
  ]);

  return (
    <>
      {/* 1. EDITORIAL CAMPAIGN HERO WITH 4 MODELS */}
      <Hero />

      {/* 2. SYMMETRICAL 4-CARD CURATED PORTALS */}
      <section id="categories" className="section category-portals-section">
        <div className="container">
          <ScrollReveal className="section-head-centered">
            <p className="section-eyebrow">Atelier Portals</p>
            <h2 className="section-title">Curated Collections</h2>
            <p className="section-desc">
              Handcrafted festive edits, unstitched luxury lawn, and contemporary pret rooted in subcontinental heritage.
            </p>
          </ScrollReveal>

          <div className="category-portal-grid">
            {FEATURED_PORTALS.map((portal, idx) => (
              <ScrollReveal key={portal.slug} delay={idx * 80}>
                <Link href={`/${portal.slug}`} className="category-portal-card">
                  <SmartImage
                    src={portal.image}
                    alt={portal.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: "cover", objectPosition: "center 10%" }}
                  />
                  <div className="category-portal-scrim" />
                  <div className="category-portal-body">
                    <span className="category-portal-tag">{portal.tag}</span>
                    <h3 className="category-portal-title">{portal.label}</h3>
                    <span className="category-portal-link">{portal.action}</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EDITOR'S FESTIVE SELECTION (SYMMETRICAL 4-COLUMN PRODUCT GRID) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal className="section-head-centered">
            <p className="section-eyebrow">Curated Capsule</p>
            <h2 className="section-title">Season Highlights</h2>
            <p className="section-desc">
              Hand-selected formalwear and festive heirlooms ready for immediate dispatch.
            </p>
          </ScrollReveal>

          <div className="product-grid">
            {featured.slice(0, 4).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link
              href="/women"
              className="hero-btn-luxury hero-btn-luxury-solid"
              style={{ background: "var(--ink)", color: "var(--bg)", borderColor: "var(--ink)" }}
            >
              View Complete Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURAL CAMPAIGN SPOTLIGHT (HAUTE COUTURE EDITORIAL) */}
      <CampaignSpotlight />

      {/* 5. JUST LANDED (NEW ARRIVALS SYMMETRICAL CAROUSEL) */}
      <ProductCarousel
        products={isNew}
        title="New In This Week"
        eyebrow="Just Landed"
        viewAllHref="/women?sort=newest"
        viewAllLabel="Shop All Arrivals"
      />

      {/* 6. ATELIER CIRCLE PRIVILEGE & NEWSLETTER */}
      <Newsletter />
    </>
  );
}
