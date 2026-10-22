"use client";

import HeroContent from "./HeroContent";

export default function HeroVideo() {
  return (
    <section className="hero hero-video-section" aria-label="Velour seasonal collection">
      <video
        className="hero-media hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/products/lookbook-royal-crimson-ensemble.jpg"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        style={{
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: "transform",
          filter: "contrast(1.05) saturate(1.12) brightness(1.02)",
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay-video" />
      <HeroContent />
    </section>
  );
}