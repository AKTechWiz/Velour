import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import Newsletter from "@/components/Newsletter";
import SmartImage from "@/components/SmartImage";
import { CATEGORIES } from "@/lib/data";
import { getFlagged } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const [featured, isNew, trending] = await Promise.all([
    getFlagged("featured", 8),
    getFlagged("isNew", 4),
    getFlagged("trending", 4),
  ]);

  return (
    <>
      <Hero />

      {/* Category highlights */}
      <section id="categories" className="section">
        <div className="container">
          <ScrollReveal className="section-head">
            <div>
              <p className="section-eyebrow">Collections</p>
              <h2 className="section-title">Shop by Category</h2>
            </div>
          </ScrollReveal>
          <div className="category-grid">
            {CATEGORIES.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 120}>
                <Link href={`/${c.slug}`} className="category-card">
                  <SmartImage
                    src={c.image}
                    alt={c.label}
                    fill
                    sizes="(max-width: 820px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center 8%" }}
                  />
                  <span className="category-card-label">
                    <h3>{c.label}</h3>
                    <span>Explore →</span>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal className="section-head">
            <div>
              <p className="section-eyebrow">Editor&apos;s Selection</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <Link href="/women" className="section-link">View all</Link>
          </ScrollReveal>
          <div className="product-grid">
            {featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="banner">
        <div className="container banner-content">
          <ScrollReveal>
            <h2>Winter Sale — Up to 40% Off</h2>
            <p>On selected outerwear and knitwear. Free shipping on orders over $75.</p>
            <Link href="/women" className="btn btn-light">Shop the Sale</Link>
          </ScrollReveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="section">
        <div className="container">
          <ScrollReveal className="section-head">
            <div>
              <p className="section-eyebrow">Just Landed</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link href="/women?sort=newest" className="section-link">View all</Link>
          </ScrollReveal>
          <div className="product-grid">
            {isNew.map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal className="section-head">
            <div>
              <p className="section-eyebrow">Most Wanted</p>
              <h2 className="section-title">Trending Now</h2>
            </div>
          </ScrollReveal>
          <div className="product-grid">
            {trending.map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 4) * 90}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
