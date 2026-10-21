"use client";

import { useState } from "react";
import Link from "next/link";
import { money, FREE_SHIPPING_THRESHOLD_PKR, STANDARD_SHIPPING_FEE_PKR } from "@/lib/format";
import { useCart, useToast } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import { PAKISTAN_CITIES } from "@/lib/logistics";
import SmartImage from "./SmartImage";
import { IconMinus, IconPlus, IconTrash, IconHeart } from "./Icons";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { push } = useToast();

  const [selectedCity, setSelectedCity] = useState("Karachi");
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  const GIFT_WRAP_FEE_PKR = 450;

  const cityInfo = PAKISTAN_CITIES.find((c) => c.name === selectedCity) || PAKISTAN_CITIES[0];
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD_PKR ? 0 : STANDARD_SHIPPING_FEE_PKR;
  const giftFee = giftWrap ? GIFT_WRAP_FEE_PKR : 0;
  const total = Math.max(0, subtotal - discountAmount) + shipping + giftFee;

  // Free shipping progress calculations
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_PKR) * 100));
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD_PKR - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    setPromoError(null);

    if (!code) return;

    if (code === "VELOUR10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setAppliedPromo("VELOUR10 (10% Privilege Discount)");
      push(`Applied 10% discount: -${money(disc)}`);
    } else if (code === "EID2026") {
      const disc = 1500;
      setDiscountAmount(disc);
      setAppliedPromo("EID2026 (Rs. 1,500 Festive Voucher)");
      push("Applied Rs. 1,500 festive discount!");
    } else if (code === "FIRST1000") {
      const disc = 1000;
      setDiscountAmount(disc);
      setAppliedPromo("FIRST1000 (Rs. 1,000 Welcome Voucher)");
      push("Applied Rs. 1,000 welcome voucher!");
    } else {
      setPromoError("Invalid promo code. Try VELOUR10 or EID2026.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoCode("");
    push("Promo code removed", "info");
  };

  const handleMoveToWishlist = (item: (typeof items)[0]) => {
    toggleWishlist({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      category: "women",
    });
    removeItem(item.productId, item.size);
    push(`Moved ${item.name} to wishlist`);
  };

  if (items.length === 0) {
    return (
      <div className="container cart-page" style={{ maxWidth: 640, margin: "60px auto 100px", textAlign: "center" }}>
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            padding: "clamp(32px, 6vw, 48px) clamp(16px, 4vw, 24px)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "var(--taupe-deep)",
            }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 style={{ fontSize: "clamp(1.35rem, 5vw, 1.8rem)", fontFamily: "var(--serif)", marginBottom: "12px", color: "var(--ink)", wordBreak: "break-word" }}>
            Your Shopping Bag is Empty
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 420, margin: "0 auto 28px", fontSize: "0.95rem" }}>
            Explore our latest festive arrivals, unstitched lawn edits, and ready-to-wear luxury ensembles.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/women" className="btn btn-primary" style={{ padding: "12px 24px" }}>
              Explore Women&apos;s Pret
            </Link>
            <Link href="/women?sub=unstitched" className="btn btn-ghost" style={{ padding: "12px 24px" }}>
              Shop Unstitched Lawn
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page" style={{ maxWidth: 1140, margin: "40px auto 100px" }}>
      <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.4rem)", fontFamily: "var(--serif)", marginBottom: "28px", color: "var(--ink)", wordBreak: "break-word" }}>
        Your Shopping Bag ({items.length} {items.length === 1 ? "piece" : "pieces"})
      </h1>

      {/* Free Shipping Progress Meter */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          padding: "20px 24px",
          marginBottom: "36px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
          <strong style={{ fontSize: "0.95rem", color: progressPercent >= 100 ? "var(--success)" : "var(--ink)" }}>
            {progressPercent >= 100
              ? "Complimentary Nationwide Delivery Unlocked"
              : `Add ${money(remainingForFree)} more for Free Nationwide Delivery`}
          </strong>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600 }}>
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "var(--line)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: progressPercent >= 100 ? "var(--success)" : "var(--gold)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div className="cart-layout">
        {/* Item List Column */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="cart-item-card"
              >
                {/* Product Media & Details */}
                <div className="cart-item-main">
                  <Link
                    href={`/product/${item.productId}`}
                    className="cart-item-thumb"
                  >
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      style={{ objectFit: "cover" }}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link
                      href={`/product/${item.productId}`}
                      className="cart-item-title"
                    >
                      {item.name}
                    </Link>

                    <div className="cart-item-meta">
                      <span className="cart-item-size-badge">Size: <strong>{item.size}</strong></span>
                      <span className="cart-item-unit-price">Unit: {money(item.price)}</span>
                    </div>

                    <div className="cart-item-desktop-wishlist">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item)}
                        className="cart-item-action-link"
                      >
                        <IconHeart width={13} height={13} /> <span>Move to Wishlist</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions & Price Bar */}
                <div className="cart-item-actions-col">
                  {/* Stepper */}
                  <div className="qty-stepper" style={{ marginBottom: 0 }}>
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                    >
                      <IconMinus width={12} height={12} />
                    </button>
                    <span style={{ minWidth: "24px", textAlign: "center", fontSize: "0.88rem", fontWeight: 600 }}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                    >
                      <IconPlus width={12} height={12} />
                    </button>
                  </div>

                  {/* Price & Remove */}
                  <div className="cart-item-price-block">
                    <strong className="cart-item-total-price">
                      {money(item.price * item.qty)}
                    </strong>
                    <div className="cart-item-actions-group">
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(item)}
                        className="cart-item-mobile-wishlist cart-item-action-link"
                      >
                        <IconHeart width={13} height={13} /> <span>Save</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.size)}
                        className="cart-item-remove-link"
                      >
                        <IconTrash width={13} height={13} /> <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Keepsake Luxury Gift Wrap Option */}
          <div
            style={{
              marginTop: "24px",
              background: "var(--surface-card)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "20px 24px",
            }}
          >
            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
                style={{ width: "18px", height: "18px", marginTop: "3px", accentColor: "var(--ink)" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "0.95rem", color: "var(--ink)" }}>Add Keepsake Luxury Gift Packaging (+Rs. 450)</strong>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--gold)" }}>
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                  </svg>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  Rigid magnetic presentation box, hand-tied satin ribbon, aromatic cedar sachet, and a customized calligraphy gift card.
                </p>
              </div>
            </label>

            {giftWrap && (
              <div style={{ marginTop: "14px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px", color: "var(--ink)" }}>
                  Handwritten Gift Card Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter message for recipient (e.g. Wishing you joy and elegance on your special day. With love, Amna)."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            padding: "28px 24px",
            position: "sticky",
            top: "90px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-serif, serif)", marginBottom: "18px", paddingBottom: "12px", borderBottom: "1px solid var(--line)", color: "var(--ink)" }}>
            Order Summary
          </h2>

          {/* Destination City Transit Selector */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px", color: "var(--ink)" }}>
              Delivery Destination
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid var(--line)",
                background: "var(--surface)",
                color: "var(--ink)",
                fontSize: "0.88rem",
              }}
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.transitDays})
                </option>
              ))}
            </select>
            <span style={{ fontSize: "0.78rem", color: "var(--success)", display: "block", marginTop: "4px" }}>
              Estimated transit: <strong>{cityInfo.transitDays}</strong> via {cityInfo.courier}
            </span>
          </div>

          {/* Promo Code Input */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "6px", color: "var(--ink)" }}>
              Promo Code / Gift Voucher
            </label>
            {appliedPromo ? (
              <div
                style={{
                  background: "rgba(46, 125, 50, 0.08)",
                  border: "1px solid rgba(46, 125, 50, 0.28)",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.82rem",
                }}
              >
                <span style={{ color: "var(--success)", fontWeight: 600 }}>{appliedPromo}</span>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="e.g. VELOUR10 or EID2026"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: promoError ? "1.5px solid var(--danger)" : "1px solid var(--line)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-ghost"
                  style={{ padding: "10px 14px", fontSize: "0.82rem", whiteSpace: "nowrap" }}
                >
                  Apply
                </button>
              </form>
            )}
            {promoError && (
              <span style={{ color: "var(--danger)", fontSize: "0.78rem", display: "block", marginTop: "4px" }}>
                {promoError}
              </span>
            )}
          </div>

          {/* Calculation Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--muted)" }}>
              <span>Bag Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--success)" }}>
                <span>Voucher Discount</span>
                <span>-{money(discountAmount)}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--muted)" }}>
              <span>Courier Delivery ({selectedCity})</span>
              <span>{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>

            {giftWrap && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--muted)" }}>
                <span>Luxury Keepsake Box</span>
                <span>{money(GIFT_WRAP_FEE_PKR)}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--line)",
                paddingTop: "14px",
                marginTop: "6px",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--ink)" }}>Estimated Total</span>
              <strong style={{ fontSize: "1.3rem", color: "var(--ink)" }}>
                {money(total)}
              </strong>
            </div>
          </div>

          <Link
            href="/checkout"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "20px", padding: "16px", textAlign: "center", display: "block", fontSize: "0.95rem" }}
          >
            Proceed to Secure Checkout →
          </Link>

          {/* Trust Highlights */}
          <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "var(--muted)" }}>
              <span>✓</span> 100% Pure Natural Textiles Guaranteed
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "var(--muted)" }}>
              <span>✓</span> Cash on Delivery (COD) Available Nationwide
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "var(--muted)" }}>
              <span>✓</span> 14-Day Hassle-Free Domestic Exchange
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
