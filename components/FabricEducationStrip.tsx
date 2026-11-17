import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface FabricGuide {
  name: string;
  season: string;
  weight: string;
  characteristics: string;
  care: string;
  filterSlug: string;
}

const FABRICS: FabricGuide[] = [
  {
    name: "Pure Lawn (80s)",
    season: "Spring / Summer",
    weight: "85 GSM",
    characteristics: "Combed Egyptian cotton with featherlight breathability and crisp drape.",
    care: "Gentle Hand Wash",
    filterSlug: "Lawn",
  },
  {
    name: "Pure Raw Silk",
    season: "All-Year Formals",
    weight: "120 GSM",
    characteristics: "Natural slub texture with lustrous sheen tailored for structured formal silhouettes.",
    care: "Dry Clean Only",
    filterSlug: "Raw Silk",
  },
  {
    name: "Silk Chiffon & Organza",
    season: "Festive & Wedding",
    weight: "60 GSM",
    characteristics: "Ethereal sheer drape hand-worked for intricate zardozi and scalloped dupattas.",
    care: "Dry Clean Only",
    filterSlug: "Chiffon",
  },
  {
    name: "Plush Micro-Velvet",
    season: "Autumn / Winter",
    weight: "280 GSM",
    characteristics: "Sumptuous dense micro-pile with rich evening depth and jewel-toned warmth.",
    care: "Steam Only",
    filterSlug: "Velvet",
  },
];

export default function FabricEducationStrip() {
  return (
    <section className="section fabric-guide-section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
      <div className="container">
        <ScrollReveal className="section-head-centered">
          <p className="section-eyebrow">Artisanal Provenance</p>
          <h2 className="section-title">Fabric Glossary</h2>
          <p className="section-desc">
            Crafted exclusively with certified pure natural fibres and traditional loom-spun weaves.
          </p>
        </ScrollReveal>

        <div className="trust-bar-grid" style={{ gap: "24px" }}>
          {FABRICS.map((f, i) => (
            <ScrollReveal key={f.name} delay={i * 80}>
              <div
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm, 2px)",
                  padding: "28px 22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gold)", fontWeight: 600 }}>
                      {f.season}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>{f.weight}</span>
                  </div>

                  <h3 style={{ fontSize: "18px", margin: "0 0 10px", fontFamily: "var(--serif)", color: "var(--ink)", fontWeight: 400 }}>
                    {f.name}
                  </h3>

                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "18px" }}>
                    {f.characteristics}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                  <p style={{ fontSize: "11.5px", color: "var(--muted)", margin: "0 0 12px" }}>
                    Care: <strong style={{ color: "var(--ink)" }}>{f.care}</strong>
                  </p>

                  <Link
                    href={`/women?fabric=${encodeURIComponent(f.filterSlug)}`}
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--ink)",
                      fontWeight: 600,
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Shop {f.filterSlug}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
