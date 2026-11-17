import Link from "next/link";
import SmartImage from "./SmartImage";
import ScrollReveal from "./ScrollReveal";

export default function CampaignSpotlight() {
  return (
    <section className="campaign-feature-section" aria-label="Haute Couture Campaign Feature">
      <div className="container">
        <div className="campaign-feature-grid">
          {/* Left: Symmetrical Architectural Portrait Frame */}
          <ScrollReveal>
            <div className="campaign-feature-media">
              <SmartImage
                src="/images/products/lookbook-royal-crimson-ensemble.jpg"
                alt="Festive Bridal Peshwas — Royal Crimson Ensemble"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </ScrollReveal>

          {/* Right: Evocative Editorial Narrative */}
          <ScrollReveal delay={120}>
            <div className="campaign-feature-content">
              <span className="campaign-tag">Haute Couture &amp; Bespoke Trousseau</span>
              <h2 className="campaign-title">
                The Festive Soirée
              </h2>
              <p className="campaign-desc">
                Hand-embellished over 48 hours by master Karigars across Lahore and Multan. Intricate gold marori wirework, antique zardozi needlework, and pure micro-velvet tailored for timeless celebrations.
              </p>

              <div className="campaign-ctas">
                <a
                  href="https://wa.me/923008259142?text=Hello%20Velour%20Bridal%20Team%2C%20I%20would%20like%20to%20inquire%20about%20a%20bridal%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-luxury hero-btn-luxury-solid"
                >
                  Book Atelier Consultation
                </a>
                <Link
                  href="/festive"
                  className="hero-btn-luxury hero-btn-luxury-outline"
                >
                  Explore Festive Edit
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
