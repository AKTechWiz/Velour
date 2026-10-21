"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/store";
import { money, FREE_SHIPPING_THRESHOLD_PKR } from "@/lib/format";
import { IconClose, IconMinus, IconPlus, IconTrash } from "./Icons";
import SmartImage from "./SmartImage";

export default function MiniBagDrawer() {
  const {
    items,
    count,
    subtotal,
    miniBagOpen,
    setMiniBagOpen,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!miniBagOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMiniBagOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [miniBagOpen, setMiniBagOpen]);

  if (!miniBagOpen) return null;

  const freeShippingMet = subtotal >= FREE_SHIPPING_THRESHOLD_PKR;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_PKR - subtotal);
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD_PKR) * 100)
  );

  return (
    <div
      className="drawer-overlay open"
      onClick={() => setMiniBagOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
    >
      <div
        className="drawer drawer-right"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Shopping Bag</h2>
            <span className="drawer-subtitle">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setMiniBagOpen(false)}
            aria-label="Close bag"
          >
            <IconClose />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="free-shipping-bar">
          <div className="free-shipping-text">
            {freeShippingMet ? (
              <span className="free-shipping-success">
                ✓ You have qualified for <strong>Free Nationwide Delivery</strong>!
              </span>
            ) : (
              <span>
                Add <strong>{money(amountToFreeShipping)}</strong> more for{" "}
                <strong>Free Delivery</strong>
              </span>
            )}
          </div>
          <div className="free-shipping-track">
            <div
              className="free-shipping-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <p className="drawer-empty-title">Your bag is empty</p>
              <p className="drawer-empty-desc">
                Discover our new luxury lawn, unstitched edits, and ready-to-wear collections.
              </p>
              <Link
                href="/women"
                className="btn"
                onClick={() => setMiniBagOpen(false)}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="drawer-items">
              {items.map((item) => (
                <div
                  key={`${item.productId}__${item.size}`}
                  className="drawer-item"
                >
                  <Link
                    href={`/product/${item.productId}`}
                    className="drawer-item-image"
                    onClick={() => setMiniBagOpen(false)}
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
                    <div className="drawer-item-head">
                      <Link
                        href={`/product/${item.productId}`}
                        className="drawer-item-name"
                        onClick={() => setMiniBagOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        className="icon-btn-sm"
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <IconTrash />
                      </button>
                    </div>

                    <p className="drawer-item-size">Size: {item.size}</p>
                    <p className="drawer-item-price">{money(item.price)}</p>

                    <div className="qty-stepper qty-stepper-sm">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.productId, item.size)}
                        aria-label="Decrease quantity"
                      >
                        <IconMinus />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.productId, item.size)}
                        aria-label="Increase quantity"
                      >
                        <IconPlus />
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
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span className="drawer-subtotal-val">{money(subtotal)}</span>
            </div>
            <p className="drawer-tax-note">
              Delivery calculated at checkout. Cash on Delivery available.
            </p>

            <Link
              href="/checkout"
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: 8 }}
              onClick={() => setMiniBagOpen(false)}
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/cart"
              className="btn btn-outline"
              style={{ width: "100%" }}
              onClick={() => setMiniBagOpen(false)}
            >
              View Full Bag
            </Link>

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Link
                href="/track"
                style={{ fontSize: "0.78rem", color: "var(--muted)", textDecoration: "underline" }}
                onClick={() => setMiniBagOpen(false)}
              >
                Track an Existing Shipment →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
