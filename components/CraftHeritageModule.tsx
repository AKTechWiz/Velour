import Link from "next/link";
import SmartImage from "./SmartImage";

export default function CraftHeritageModule() {
  return (
    <section className="section craft-heritage-section">
      <div className="container">
        <div className="craft-layout">
          {/* Visual Pair */}
          <div className="craft-visual-wrapper">
            <div className="craft-image-box">
              <SmartImage
                src="/images/craft-embroidery-closeup.jpg"
                alt="Karigar hand-embroidery craftsmanship at Velour ateliers"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* In-bounds Floating Badge */}
            <div className="craft-floating-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold)", marginBottom: "6px" }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <strong className="craft-badge-hours">48+ Hours</strong>
              <p className="craft-badge-desc">
                Dedicated hand-needlework by master Karigars in Multan &amp; Lahore
              </p>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="craft-content">
            <p className="section-eyebrow">Artisanal Provenance</p>
            <h2 className="craft-heading">
              Preserving Heritage Needlework
            </h2>
            <p className="craft-desc">
              Every garment is hand-embellished across historic artisan clusters in Punjab and Sindh using pure natural fibres and multi-generational zardozi and tilla techniques.
            </p>

            <div className="craft-metrics-grid">
              <div className="craft-metric">
                <strong className="craft-metric-val">100%</strong>
                <span className="craft-metric-lbl">Pure Natural Yarns</span>
              </div>
              <div className="craft-metric">
                <strong className="craft-metric-val">Zero</strong>
                <span className="craft-metric-lbl">Synthetic Blends</span>
              </div>
              <div className="craft-metric">
                <strong className="craft-metric-val">Fair Wage</strong>
                <span className="craft-metric-lbl">Artisan Guilds</span>
              </div>
            </div>

            <div className="craft-ctas">
              <Link href="/about" className="btn btn-primary">
                Discover Our Heritage →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
