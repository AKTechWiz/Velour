"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart, useToast } from "@/lib/store";
import SmartImage from "./SmartImage";
import { IconMinus, IconPlus } from "./Icons";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { push } = useToast();
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tried, setTried] = useState(false);

  const handleAdd = () => {
    if (!size) {
      setTried(true);
      push("Please select a size first", "info");
      return;
    }
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
      },
      qty
    );
    push(`${product.name} (${size}) added to bag`);
  };

  return (
    <div className="pdp">
      <div>
        <div className="pdp-gallery-main">
          <SmartImage
            src={product.images[imageIndex]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 820px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="pdp-thumbs">
          {product.images.map((img, i) => (
            <button
              key={img}
              type="button"
              className={`pdp-thumb ${i === imageIndex ? "active" : ""}`}
              onClick={() => setImageIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <SmartImage src={img} alt="" fill sizes="76px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>

      <div className="pdp-info">
        <h1>{product.name}</h1>
        <p className="pdp-sub">{product.subcategory} · {product.category === "women" ? "Women" : "Men"}</p>
        <p className="pdp-price">
          <span>{money(product.price)}</span>
          {product.compareAtPrice && <s className="compare">{money(product.compareAtPrice)}</s>}
        </p>
        <p className="pdp-desc">{product.description}</p>

        <p className="pdp-label">
          <span>Select size</span>
          {tried && !size && <span className="error">Size required</span>}
        </p>
        <div className="size-row">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              className={`size-btn ${size === s ? "active" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="qty-stepper" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <IconMinus />
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
            <IconPlus />
          </button>
        </div>

        <div className="pdp-ctas">
          <button type="button" className="btn btn-wide" onClick={handleAdd}>
            Add to Cart — {money(product.price * qty)}
          </button>
        </div>

        <div className="pdp-meta">
          <span>Free shipping over $75 · 30-day returns</span>
          <span>SKU {product.id.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
