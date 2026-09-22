import Link from "next/link";

export default function HeroContent() {
  return (
    <>
      <div className="container hero-container-left">
        <div className="hero-content-left">
          <p className="hero-eyebrow-minimal anim-item" style={{ animationDelay: "0.15s" }}>
            AUTUMN / WINTER COLLECTION
          </p>

          <h1 className="hero-title-left">
            <span className="anim-item" style={{ animationDelay: "0.3s", display: "inline-block" }}>
              Quiet luxury,
            </span>
            <br />
            <span className="anim-item" style={{ animationDelay: "0.45s", display: "inline-block" }}>
              worn daily.
            </span>
          </h1>

          <p className="hero-sub-left anim-item" style={{ animationDelay: "0.6s" }}>
            Considered fabrics and timeless silhouettes for women and men.
            <br />
            Essentials designed to outlast the season.
          </p>

          <div className="hero-ctas-left anim-item" style={{ animationDelay: "0.75s" }}>
            <Link href="/women" className="hero-btn">
              Shop Women
            </Link>
            <Link href="/men" className="hero-btn">
              Shop Men
            </Link>
          </div>
        </div>
      </div>

      <a href="#categories" className="hero-scroll-vertical" aria-label="Scroll to collections">
        <span>SCROLL</span>
        <span className="hero-scroll-bar" />
      </a>
    </>
  );
}