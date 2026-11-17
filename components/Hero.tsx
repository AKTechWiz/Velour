"use client";

import Link from "next/link";
import SmartImage from "./SmartImage";

export default function Hero() {
  return (
    <section className="hero hero-editorial-campaign" aria-label="Velour Seasonal Campaign">
      {/* High-Resolution Campaign Banner Image featuring 4 models in diverse luxury attire */}
      <SmartImage
        src="/images/hero-campaign-models.jpg"
        alt="VELOUR Autumn / Winter & Festive Campaign featuring luxury velvet, silk, lawn, and menswear ensembles"
        fill
        priority={true}
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "center 24%",
          transform: "translateZ(0)",
        }}
        className="hero-media"
      />

      {/* Crystal Clear Vignette Scrim (bottom legibility only, zero darkening on models) */}
      <div className="hero-editorial-overlay" />

      {/* Symmetrical Luxury Editorial Typography positioned with clear sightlines */}
      <div className="container hero-container-centered">
        <div className="hero-content-centered">
          <p className="hero-eyebrow-centered anim-item" style={{ animationDelay: "0.15s" }}>
            AUTUMN / WINTER &amp; FESTIVE &apos;26
          </p>

          <h1 className="hero-title-centered anim-item" style={{ animationDelay: "0.3s" }}>
            Subcontinental Couture
          </h1>

          <p className="hero-sub-centered anim-item" style={{ animationDelay: "0.45s" }}>
            Hand-worked velvet, fine lawn, and bespoke tailored pret for timeless celebrations.
          </p>

          <div className="hero-ctas-centered anim-item" style={{ animationDelay: "0.6s" }}>
            <Link href="/women" className="hero-btn-luxury hero-btn-luxury-solid">
              Shop Collection
            </Link>
            <Link href="/festive" className="hero-btn-luxury hero-btn-luxury-outline">
              Festive Couture
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Scroll Cue */}
      <a href="#categories" className="hero-scroll-centered" aria-label="Explore collections">
        <span>EXPLORE</span>
        <span className="hero-scroll-line" />
      </a>
    </section>
  );
}
