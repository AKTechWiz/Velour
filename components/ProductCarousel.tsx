"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  eyebrow?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function ProductCarousel({
  products,
  title,
  eyebrow,
  viewAllHref,
  viewAllLabel = "View all",
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const handleScroll = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section className="section product-carousel-section" style={{ overflow: "hidden" }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: "28px" }}>
          <div>
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            <h2 className="section-title">{title}</h2>
          </div>

          <div className="carousel-controls-wrapper">
            {viewAllHref && (
              <Link href={viewAllHref} className="section-link carousel-view-all">
                {viewAllLabel}
              </Link>
            )}

            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                title="Previous products"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                title="Next products"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="carousel-track-container">
          <div ref={trackRef} className="carousel-track">
            {products.map((p) => (
              <div key={p.id} className="carousel-item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
