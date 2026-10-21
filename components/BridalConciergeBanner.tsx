import Link from "next/link";

export default function BridalConciergeBanner() {
  return (
    <section
      className="bridal-banner"
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #1f1d1b 0%, #2e2624 100%)",
        color: "#fff",
        padding: "80px 20px",
        overflow: "hidden",
      }}
    >
      {/* Subtle Luxury Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: "radial-gradient(#d4af37 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 780 }}>
        <p
          className="section-eyebrow"
          style={{ color: "#d4af37", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.82rem", marginBottom: "10px" }}
        >
          Haute Couture
        </p>

        <h2
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.3rem)",
            fontFamily: "var(--font-serif, serif)",
            lineHeight: 1.25,
            marginBottom: "12px",
            color: "#faf8f5",
          }}
        >
          Bespoke Bridal Consultations
        </h2>

        <p
          style={{
            fontSize: "0.95rem",
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: 1.6,
            marginBottom: "28px",
            maxWidth: 540,
            margin: "0 auto 28px",
          }}
        >
          Private trousseau appointments at our Karachi &amp; Lahore flagship studios, or via virtual concierge.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://wa.me/923008259142?text=Hello%20Velour%20Bridal%20Team%2C%20I%20would%20like%20to%20inquire%20about%20a%20bridal%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "#d4af37",
              color: "#1c1c1a",
              padding: "14px 30px",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>WhatsApp Bridal Concierge</span>
          </a>

          <Link
            href="/contact"
            className="btn btn-outline"
            style={{
              borderColor: "rgba(255, 255, 255, 0.4)",
              color: "#fff",
              padding: "14px 28px",
              fontSize: "0.95rem",
            }}
          >
            Book Studio Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
