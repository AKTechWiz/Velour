"use client";

import React, { useEffect, useState } from "react";
import SmartImage from "./SmartImage";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

interface StickyMobileBuyBarProps {
  product: Product;
  selectedSize: string | null;
  totalPrice: number;
  onAdd: () => void;
  targetRefId?: string;
}

export default function StickyMobileBuyBar({
  product,
  selectedSize,
  totalPrice,
  onAdd,
  targetRefId = "pdp-main-add-btn",
}: StickyMobileBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetRefId);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      // Show when the main CTA button has scrolled out of view above viewport
      if (rect.bottom < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRefId]);

  if (!visible) return null;

  return (
    <div className="sticky-mobile-buy-bar" role="region" aria-label="Quick Purchase Bar">
      <div className="mobile-bar-product">
        <div className="mobile-bar-thumb">
          <SmartImage
            src={product.images[0]}
            alt=""
            fill
            sizes="48px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="mobile-bar-info">
          <span className="mobile-bar-title">{product.name}</span>
          <span className="mobile-bar-price">
            {money(totalPrice)} {selectedSize ? `• Size ${selectedSize}` : ""}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="mobile-bar-cta-btn"
        onClick={onAdd}
      >
        Add to Bag
      </button>
    </div>
  );
}
