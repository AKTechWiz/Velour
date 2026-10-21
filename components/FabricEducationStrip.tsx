import Link from "next/link";

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
    characteristics: "Natural slub texture with rich sheen for structured formals.",
    care: "Dry Clean Only",
    filterSlug: "Raw Silk",
  },
  {
    name: "Silk Chiffon & Organza",
    season: "Festive & Wedding",
    weight: "60 GSM",
    characteristics: "Ethereal drape hand-crafted for intricate zardozi embroidery.",
    care: "Dry Clean Only",
    filterSlug: "Chiffon",
  },
  {
    name: "Plush Micro-Velvet",
    season: "Autumn / Winter",
    weight: "280 GSM",
    characteristics: "Sumptuous micro-pile with rich evening depth and warmth.",
    care: "Steam Only",
    filterSlug: "Velvet",
  },
];

export default function FabricEducationStrip() {
  return (
    <section className="section fabric-guide-section" style={{ background: "var(--surface)", padding: "72px 0" }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: "32px" }}>
          <div>
            <p className="section-eyebrow" style={{ color: "var(--gold)" }}>
              Textile Mastery
            </p>
            <h2 className="section-title">Fabric Glossary</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {FABRICS.map((f, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)", fontWeight: 700 }}>
                    {f.season}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{f.weight}</span>
                </div>

                <h3 style={{ fontSize: "1.25rem", margin: "0 0 12px", fontFamily: "var(--font-serif, serif)" }}>
                  {f.name}
                </h3>

                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                  {f.characteristics}
                </p>
              </div>

              <div>
                <div style={{ borderTop: "1px solid var(--line, #eee)", paddingTop: "12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>
                    Care: <strong>{f.care}</strong>
                  </span>
                </div>

                <Link
                  href={`/women?fabric=${encodeURIComponent(f.filterSlug)}`}
                  className="section-link"
                  style={{ fontSize: "0.82rem", fontWeight: 600 }}
                >
                  Shop {f.filterSlug} Pieces →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
