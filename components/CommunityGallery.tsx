import Link from "next/link";
import SmartImage from "./SmartImage";

interface CommunityPost {
  image: string;
  handle: string;
  city: string;
  tag: string;
  link: string;
}

const POSTS: CommunityPost[] = [
  {
    image: "/images/products/green-lawn-1.jpg",
    handle: "@anumsheikh",
    city: "Karachi",
    tag: "Embroidered Lawn 3-Piece",
    link: "/product/embroidered-lawn-3pc",
  },
  {
    image: "/images/products/velvet-suit-1.jpg",
    handle: "@zaratahir.official",
    city: "Lahore",
    tag: "Royal Velvet Festive Suit",
    link: "/product/royal-velvet-festive-suit",
  },
  {
    image: "/images/products/chikankari-kurta-1.jpg",
    handle: "@mahanoor_k",
    city: "Islamabad",
    tag: "Chikankari Cotton Kurta",
    link: "/product/ivory-chikankari-kurta",
  },
  {
    image: "/images/products/mens-rawsilk-1.jpg",
    handle: "@danial.q",
    city: "Karachi",
    tag: "Men's Raw Silk Kurta Set",
    link: "/men",
  },
];

export default function CommunityGallery() {
  return (
    <section className="section community-section" style={{ padding: "80px 0", background: "var(--bg)" }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: "36px", textAlign: "center" }}>
          <div>
            <p className="section-eyebrow" style={{ color: "var(--gold)" }}>
              #VelourWomen &amp; #VelourMen
            </p>
            <h2 className="section-title">Styled by You</h2>
          </div>
          <p style={{ maxWidth: 520, margin: "0 auto", color: "var(--muted)", fontSize: "0.92rem" }}>
            Tag <strong>@VelourOfficial</strong> on Instagram to be featured in our seasonal customer style retrospective.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {POSTS.map((post, idx) => (
            <Link
              key={idx}
              href={post.link}
              className="community-card"
              style={{
                display: "block",
                position: "relative",
                aspectRatio: "4/5",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                textDecoration: "none",
              }}
            >
              <SmartImage
                src={post.image}
                alt={`${post.handle} wearing ${post.tag}`}
                fill
                sizes="(max-width: 600px) 100vw, 25vw"
                style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              />

              {/* Gradient Overlay & Tag */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "16px",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "0.85rem" }}>{post.handle}</strong>
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{post.city}</span>
                </div>
                <span style={{ fontSize: "0.78rem", color: "#f0ece1" }}>{post.tag} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
