import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductCarousel from "@/components/ProductCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import Newsletter from "@/components/Newsletter";
import SmartImage from "@/components/SmartImage";
import LookbookHotspots from "@/components/LookbookHotspots";
import CraftHeritageModule from "@/components/CraftHeritageModule";
import FabricEducationStrip from "@/components/FabricEducationStrip";
import BridalConciergeBanner from "@/components/BridalConciergeBanner";
import CommunityGallery from "@/components/CommunityGallery";
import { CATEGORIES } from "@/lib/data";
import { getFlagged } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, isNew, trending] = await Promise.all([
    getFlagged("featured", 8),
    getFlagged("isNew", 8),
    getFlagged("trending", 8),
  ]);

  return (
    <>
      {/* 1. EDITORIAL HERO WITH VIDEO / POSTER */}
      <Hero />

      {/* 2. CATEGORY ENTRY TILES */}
      <section id="categories" className="section category-section">
        <div className="container">
          <ScrollReveal className="section-head" style={{ marginBottom: 36, textAlign: "center" }}>
            <p className="section-eyebrow">Atelier Collections</p>
            <h2 className="section-title">Shop by Category</h2>
          </ScrollReveal>

          <div className="category-grid">
            {CATEGORIES.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 90}>
                <Link href={`/${c.slug}`} className="category-card">
                  <SmartImage
                    src={c.image}
                    alt={c.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 380px"
                    style={{ objectFit: "cover", objectPosition: "center 8%" }}
                  />
                  <div className="category-card-scrim" />
                  <div className="category-card-content">
                    <span className="category-card-eyebrow">{c.eyebrow}</span>
                    <h3 className="category-card-title">{c.label}</h3>
                    <p className="category-card-subtitle">{c.subtitle}</p>
                    <span className="category-card-cta">
                      Explore Collection <span className="cta-arrow">→</span>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PIECES (EDITOR'S SELECTION) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal className="section-head">
            <div>
              <p className="section-eyebrow">Editor&apos;s Selection</p>
              <h2 className="section-title">Featured Ensembles</h2>
            </div>
            <Link href="/women" className="section-link">View all pieces</Link>
          </ScrollReveal>
          <div className="product-grid">
            {featured.slice(0, 4).map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SEASONAL CAMPAIGN BANNER */}
      <section className="banner">
        <div className="container banner-content">
          <ScrollReveal>
            <p className="section-eyebrow" style={{ color: "var(--gold)", marginBottom: 8 }}>
              Capsule Collection
            </p>
            <h2>The Festive Soirée</h2>
            <p style={{ maxWidth: 460, margin: "0 auto 20px", opacity: 0.9 }}>
              Hand-embellished zardozi work paired with ethereal scalloped dupattas.
            </p>
            <Link href="/festive" className="btn btn-light">
              Explore Festive Edit →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. INTERACTIVE LOOKBOOK (SHOP THE LOOK) */}
      <LookbookHotspots />

      {/* 6. JUST LANDED (NEW ARRIVALS HORIZONTAL CAROUSEL) */}
      <ProductCarousel
        products={isNew}
        title="New In This Week"
        eyebrow="Just Landed"
        viewAllHref="/women?sort=newest"
      />

      {/* 7. CRAFT HERITAGE & ARTISANS MODULE */}
      <CraftHeritageModule />

      {/* 8. MOST WANTED (TRENDING PIECES HORIZONTAL CAROUSEL) */}
      <ProductCarousel
        products={trending}
        title="Trending Across Pakistan"
        eyebrow="Most Wanted"
        viewAllHref="/unstitched"
        viewAllLabel="Shop Unstitched"
      />

      {/* 9. TEXTILE & FABRIC EDUCATION STRIP */}
      <FabricEducationStrip />

      {/* 10. BRIDAL & BESPOKE CONCIERGE BANNER */}
      <BridalConciergeBanner />

      {/* 11. COMMUNITY STYLING GALLERY */}
      <CommunityGallery />

      {/* 12. VIP NEWSLETTER & FIRST-ORDER PRIVILEGE */}
      <Newsletter />
    </>
  );
}
