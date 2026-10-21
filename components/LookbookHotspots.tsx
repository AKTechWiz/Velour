"use client";

import { useState } from "react";
import Link from "next/link";
import SmartImage from "./SmartImage";
import { money } from "@/lib/format";
import { useCart, useToast } from "@/lib/store";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  category: string;
  price: number;
  image: string;
  slug: string;
  size: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "spot-peshwas",
    x: 58,
    y: 46,
    title: "Crimson Velvet Zardozi Bridal Peshwas",
    category: "Haute Couture",
    price: 48500,
    image: "/images/products/crimson-velvet-peshwas-1.jpg",
    slug: "crimson-velvet-zardozi-peshwas",
    size: "M",
  },
  {
    id: "spot-dupatta",
    x: 34,
    y: 38,
    title: "Scalloped Organza Zari Bridal Dupatta",
    category: "Luxury Dupattas",
    price: 14500,
    image: "/images/products/scalloped-organza-dupatta-1.jpg",
    slug: "scalloped-organza-zari-dupatta",
    size: "Standard",
  },
  {
    id: "spot-jhumkas",
    x: 54,
    y: 23,
    title: "Heritage Kundan & Seed Pearl Jhumkas",
    category: "Artisanal Jewellery",
    price: 9800,
    image: "/images/products/kundan-pearl-jhumkas-1.jpg",
    slug: "kundan-pearl-statement-jhumkas",
    size: "One Size",
  },
  {
    id: "spot-potli",
    x: 49,
    y: 60,
    title: "Zardozi Embroidered Velvet Potli Pouch",
    category: "Heirloom Accessories",
    price: 7200,
    image: "/images/products/velvet-zardozi-potli-1.jpg",
    slug: "velvet-zardozi-potli-bag",
    size: "One Size",
  },
];

export default function LookbookHotspots() {
  const [activeSpot, setActiveSpot] = useState<Hotspot>(HOTSPOTS[0]);
  const { addItem, setMiniBagOpen } = useCart();
  const { push } = useToast();

  const handleQuickAdd = (spot: Hotspot) => {
    addItem({
      productId: spot.slug,
      name: spot.title,
      price: spot.price,
      image: spot.image,
      size: spot.size,
    });
    push(`Added ${spot.title} to bag`);
    setMiniBagOpen(true);
  };

  return (
    <section className="section lookbook-section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: "36px" }}>
          <div>
            <p className="section-eyebrow">Artisanal Editorial</p>
            <h2 className="section-title">Shop The Look — The Royal Crimson Ensemble</h2>
          </div>
          <p className="lookbook-intro" style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
            Select any piece from the campaign look to view individual details and order.
          </p>
        </div>

        <div className="lookbook-layout">
          {/* Campaign Image with Interactive Pins */}
          <div className="lookbook-visual-box">
            <SmartImage
              src="/images/products/lookbook-royal-crimson-ensemble.jpg"
              alt="Velour Royal Crimson Bridal Campaign Ensemble"
              fill
              priority={true}
              sizes="(max-width: 900px) 100vw, 60vw"
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
            />

            {/* Glowing Interactive Pins */}
            {HOTSPOTS.map((spot) => {
              const isSelected = activeSpot?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => setActiveSpot(spot)}
                  aria-label={`Select ${spot.title}`}
                  className={`hotspot-pin ${isSelected ? "active" : ""}`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                >
                  <span className="hotspot-pulse" />
                  <span className="hotspot-dot" />
                </button>
              );
            })}
          </div>

          {/* Active Piece Callout */}
          <div className="lookbook-details">
            {activeSpot ? (
              <div className="lookbook-active-card">
                <span className="lookbook-card-category">{activeSpot.category}</span>
                <h3 className="lookbook-card-title">{activeSpot.title}</h3>
                <p className="lookbook-card-price">{money(activeSpot.price)}</p>

                <div className="lookbook-card-img">
                  <SmartImage
                    src={activeSpot.image}
                    alt={activeSpot.title}
                    fill
                    sizes="320px"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="lookbook-card-actions">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(activeSpot)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Quick Add to Bag
                  </button>
                  <Link
                    href={`/product/${activeSpot.slug}`}
                    className="btn btn-ghost"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Look Selector Pills */}
            <div className="lookbook-pills">
              {HOTSPOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSpot(s)}
                  className={`lookbook-pill ${activeSpot?.id === s.id ? "active" : ""}`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
