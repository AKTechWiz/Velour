import Link from "next/link";

export default function HeroContent() {
  return (
    <>
      <div className="container hero-container-centered">
        <div className="hero-content-centered">
          <p className="hero-eyebrow-centered anim-item" style={{ animationDelay: "0.15s" }}>
            ATELIER 2026 · FESTIVE &amp; READY-TO-WEAR
          </p>

          <h1 className="hero-title-centered">
            <span className="anim-item" style={{ animationDelay: "0.3s", display: "inline-block" }}>
              The Art of Subcontinental
            </span>
            <br />
            <span className="anim-item" style={{ animationDelay: "0.45s", display: "inline-block" }}>
              Needlecraft &amp; Couture
            </span>
          </h1>

          <p className="hero-sub-centered anim-item" style={{ animationDelay: "0.6s" }}>
            Pure hand-spun raw silks, 80s combed lawn, and heirloom zardozi embroidery.
            <br />
            Timeless silhouettes tailored by master Karigars across Lahore and Multan.
          </p>

          <div className="hero-ctas-centered anim-item" style={{ animationDelay: "0.75s" }}>
            <Link href="/women" className="hero-btn-luxury hero-btn-luxury-solid">
              Shop Women&apos;s Pret
            </Link>
            <Link href="/festive" className="hero-btn-luxury hero-btn-luxury-outline">
              Explore Festive Edit
            </Link>
          </div>
        </div>
      </div>

      <a href="#trust" className="hero-scroll-centered" aria-label="Scroll to collections">
        <span>EXPLORE</span>
        <span className="hero-scroll-line" />
      </a>
    </>
  );
}
