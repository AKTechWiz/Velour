"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist";
import { useCart, useToast } from "@/lib/store";
import { money } from "@/lib/format";
import { IconClose, IconTrash } from "./Icons";
import SmartImage from "./SmartImage";

export default function WishlistDrawer() {
  const { items, count, drawerOpen, setDrawerOpen, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const { push } = useToast();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  const handleMoveToBag = (item: (typeof items)[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "M", // Default standard size
    });
    removeFromWishlist(item.productId);
    push(`Moved ${item.name} to Bag`);
  };

  return (
    <div
      className="drawer-overlay open"
      onClick={() => setDrawerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Wishlist Drawer"
    >
      <div
        className="drawer drawer-right"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Wishlist</h2>
            <span className="drawer-subtitle">
              {count} {count === 1 ? "saved piece" : "saved pieces"}
            </span>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close wishlist"
          >
            <IconClose />
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-title">Your wishlist is empty</p>
              <p className="drawer-empty-desc">
                Save your favourite pieces to review later or share with family.
              </p>
              <Link
                href="/women"
                className="btn"
                onClick={() => setDrawerOpen(false)}
              >
                Discover Collection
              </Link>
            </div>
          ) : (
            <div className="drawer-items">
              {items.map((item) => (
                <div key={item.productId} className="drawer-item">
                  <Link
                    href={`/product/${item.productId}`}
                    className="drawer-item-image"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: "cover" }}
                    />
                  </Link>

                  <div className="drawer-item-details">
                    <Link
                      href={`/product/${item.productId}`}
                      className="drawer-item-name"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <p className="drawer-item-meta">
                      {item.subcategory || item.category}
                    </p>
                    <p className="drawer-item-price">
                      <span>{money(item.price)}</span>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <s className="compare">{money(item.compareAtPrice)}</s>
                      )}
                    </p>

                    <div className="drawer-item-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => handleMoveToBag(item)}
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        className="icon-btn-sm"
                        onClick={() => removeFromWishlist(item.productId)}
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <Link
              href="/women"
              className="btn btn-outline"
              style={{ width: "100%" }}
              onClick={() => setDrawerOpen(false)}
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
