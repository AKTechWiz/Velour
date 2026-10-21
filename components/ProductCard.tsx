"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { IconHeart, IconHeartFilled } from "./Icons";
import SmartImage from "./SmartImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const quickAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[Math.floor(product.sizes.length / 2)] ?? product.sizes[0],
    });
  };

  return (
    <article className="product-card">
      {/* prefetch={true} ensures the page is prefetched on hover for instant navigation */}
      <div className="product-card-media-wrapper">
        <Link href={`/product/${product.id}`} className="product-card-media" prefetch={true}>
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="product-img product-img-primary"
            priority={false}
          />
          {product.images[1] && (
            <SmartImage
              src={product.images[1]}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="product-img product-img-alt"
              priority={false}
            />
          )}
          <div className="product-card-badges">
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <span className="badge badge-sale">
                -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
              </span>
            ) : product.isNew ? (
              <span className="badge badge-new">New In</span>
            ) : product.trending ? (
              <span className="badge badge-trending">Bestseller</span>
            ) : null}
          </div>
          <button
            type="button"
            className="quick-add"
            onClick={(e) => {
              e.preventDefault();
              quickAdd();
            }}
          >
            Quick Add
          </button>
        </Link>
        <button
          type="button"
          className={`product-card-wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          {inWishlist ? <IconHeartFilled /> : <IconHeart />}
        </button>
      </div>

      <div className="product-card-info">
        {(product.pieceCount || product.fabric || product.material) && (
          <p className="product-card-subtitle">
            {[product.pieceCount, product.fabric || product.material].filter(Boolean).join(" • ")}
          </p>
        )}
        <Link href={`/product/${product.id}`} className="product-card-name" prefetch={true}>
          {product.name}
        </Link>
        <p className="product-card-price">
          <span className="current-price">{money(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <s className="compare">{money(product.compareAtPrice)}</s>
          )}
        </p>
      </div>
    </article>
  );
}
