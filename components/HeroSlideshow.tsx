"use client";

import { useEffect, useState } from "react";
import HeroContent from "./HeroContent";

const SLIDES = [
  "/images/products/wool-coat-1.jpg",
  "/images/products/silk-slip-dress-1.jpg",
  "/images/products/mens-overcoat-1.jpg",
];

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero" aria-label="Velour seasonal collection">
      <div className="hero-slides">
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`hero-slide ${i === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <HeroContent />
    </section>
  );
}