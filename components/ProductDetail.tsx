"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart, useToast } from "@/lib/store";
import { useWishlist } from "@/lib/wishlist";
import SmartImage from "./SmartImage";
import { IconMinus, IconPlus, IconHeart, IconHeartFilled, IconCheck } from "./Icons";
import SizeGuideDrawer from "./SizeGuideDrawer";
import CityDeliveryEstimator from "./CityDeliveryEstimator";
import UnstitchedBreakdown from "./UnstitchedBreakdown";
import StitchingConfigurator, { type StitchingMode } from "./StitchingConfigurator";
import StickyMobileBuyBar from "./StickyMobileBuyBar";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, setMiniBagOpen } = useCart();
  const { push } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    // If it's pure unstitched with only 1 option, auto-select
    if (product.sizes.length === 1) return product.sizes[0];
    return null;
  });
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  // Stitching state
  const [stitchingMode, setStitchingMode] = useState<StitchingMode>("unstitched");
  const [stitchingFee, setStitchingFee] = useState(0);
  const [customTailoringNotes, setCustomTailoringNotes] = useState<string | undefined>();

  // Modals & drawers
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Active accordion tabs
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  const inWishlist = isInWishlist(product.id);
  const unitPrice = product.price + stitchingFee;
  const totalPrice = unitPrice * quantity;

  const handleStitchingChange = (mode: StitchingMode, fee: number, notes?: string) => {
    setStitchingMode(mode);
    setStitchingFee(fee);
    setCustomTailoringNotes(notes);
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      setSizeError(true);
      push("Please select a size to proceed", "info");
      return;
    }

    setSizeError(false);

    let displaySize = selectedSize || product.sizes[0];
    if (stitchingMode === "standard") {
      displaySize = `${displaySize} (Standard Stitched)`;
    } else if (stitchingMode === "custom") {
      displaySize = `Custom Tailored (${customTailoringNotes || "Bespoke"})`;
    }

    addItem(
      {
        productId: product.id,
        name: product.name,
        price: unitPrice,
        image: product.images[0],
        size: displaySize,
      },
      quantity
    );

    push(`Added ${product.name} to your shopping bag`);
    setMiniBagOpen(true);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <div className="pdp-layout-grid">
        {/* ========================================================
            LEFT COLUMN (60%): VERTICAL EDITORIAL GALLERY
            ======================================================== */}
        <div className="pdp-gallery-column">
          {/* Main Hero Shot with click-to-zoom */}
          <div
            className="pdp-gallery-hero"
            onClick={() => setZoomImage(product.images[activeImageIndex])}
            title="Click to view full screen zoom"
          >
            <SmartImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 60vw"
              className="pdp-hero-img"
            />
            <div className="pdp-zoom-badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span>Click to Zoom</span>
            </div>
          </div>

          {/* Vertical multi-shot gallery stream */}
          <div className="pdp-multi-angles-row">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                className={`pdp-angle-thumb ${i === activeImageIndex ? "active" : ""}`}
                onClick={() => setActiveImageIndex(i)}
                aria-label={`View angle photo ${i + 1}`}
              >
                <SmartImage
                  src={img}
                  alt={`${product.name} angle ${i + 1}`}
                  fill
                  sizes="120px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          {/* Full vertical scroll gallery on desktop (showing alternate angles) */}
          {product.images.length > 1 && (
            <div className="pdp-editorial-stream">
              {product.images.slice(1).map((img, idx) => (
                <div
                  key={img}
                  className="pdp-stream-frame"
                  onClick={() => setZoomImage(img)}
                >
                  <SmartImage
                    src={img}
                    alt={`${product.name} close-up view ${idx + 2}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="stream-caption">Detail Angle 0{idx + 2}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN (40%): STICKY LUXURY BUY BOX
            ======================================================== */}
        <div className="pdp-buybox-column">
          <div className="pdp-sticky-buybox">
            {/* Hierarchy Tags & Subtitle */}
            <div className="pdp-tags-row">
              {product.pieceCount && <span className="pdp-meta-pill">{product.pieceCount}</span>}
              {product.fabric && <span className="pdp-meta-pill">{product.fabric}</span>}
              {product.workType && <span className="pdp-meta-pill">{product.workType}</span>}
              {product.occasion && <span className="pdp-meta-pill">{product.occasion}</span>}
            </div>

            {/* Product Title */}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Price Block with Compare At Strikethrough in PKR */}
            <div className="pdp-price-wrap">
              <span className="pdp-current-price">{money(unitPrice)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <s className="pdp-compare-price">{money(product.compareAtPrice)}</s>
                  <span className="pdp-discount-badge">
                    Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock / Atelier status */}
            <div className="pdp-stock-status">
              <span className="stock-dot live" />
              <span>
                {product.stock && product.stock <= 5
                  ? `Limited Edition — Only ${product.stock} pieces remaining in Atelier`
                  : "Handcrafted in Limited Atelier Batches • Ready for Dispatch"}
              </span>
            </div>

            {/* Short editorial description */}
            <p className="pdp-lead-desc">{product.description}</p>

            {/* SIZE SELECTOR WITH SIZE GUIDE TRIGGER */}
            <div className="pdp-size-selection-area">
              <div className="size-header-row">
                <span className="size-header-label">
                  Select Size
                  {selectedSize && <span className="size-selected-name">: {selectedSize}</span>}
                </span>
                <button
                  type="button"
                  className="size-guide-trigger-btn"
                  onClick={() => setSizeGuideOpen(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z" />
                    <path d="m14.5 5.5 2 2" /><path d="m11.5 8.5 2 2" /><path d="m8.5 11.5 2 2" /><path d="m5.5 14.5 2 2" />
                  </svg>
                  <span>Garment Measurements (cm / in)</span>
                </button>
              </div>

              {sizeError && !selectedSize && (
                <p className="size-error-msg">Please choose an available size</p>
              )}

              <div className="pdp-sizes-grid" role="radiogroup" aria-label="Garment sizes">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`pdp-size-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSize(s);
                        setSizeError(false);
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OPTIONAL STITCHING SERVICE CONFIGURATOR */}
            {product.stitchingAvailable && (
              <StitchingConfigurator
                baseStitchingFee={product.stitchingFee || 2800}
                selectedMode={stitchingMode}
                onModeChange={handleStitchingChange}
              />
            )}

            {/* QUANTITY & ACTIONS */}
            <div className="pdp-actions-row">
              <div className="pdp-qty-stepper" aria-label="Quantity selector">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <IconMinus width={14} height={14} />
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                >
                  <IconPlus width={14} height={14} />
                </button>
              </div>

              <button
                id="pdp-main-add-btn"
                type="button"
                className="pdp-primary-add-btn"
                onClick={handleAddToCart}
              >
                <span>Add to Bag — {money(totalPrice)}</span>
              </button>

              <button
                type="button"
                className={`pdp-wishlist-toggle ${inWishlist ? "active" : ""}`}
                onClick={() => toggleWishlist(product)}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                title={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
              >
                {inWishlist ? <IconHeartFilled /> : <IconHeart />}
              </button>
            </div>

            {/* CITY DELIVERY ESTIMATOR */}
            <CityDeliveryEstimator productPrice={unitPrice} />

            {/* UNSTITCHED GARMENT BREAKDOWN (WHAT'S IN THE BOX) */}
            {product.unstitchedDetails && (
              <UnstitchedBreakdown
                details={product.unstitchedDetails}
                fabricName={product.fabric || product.material}
              />
            )}

            {/* EDITORIAL ACCORDIONS */}
            <div className="pdp-accordions-group">
              {/* Accordion 1: Fabric & Craftsmanship */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleAccordion("fabric")}
                  aria-expanded={openAccordion === "fabric"}
                >
                  <span>Artisanal Fabric & Craft Details</span>
                  <span className="accordion-icon">{openAccordion === "fabric" ? "−" : "+"}</span>
                </button>
                {openAccordion === "fabric" && (
                  <div className="accordion-content">
                    <p>
                      <strong>Material:</strong> {product.material || "100% Pure Natural Fiber"}
                    </p>
                    <p>
                      <strong>Embroidery & Work:</strong> {product.workType || "Hand-finished threadwork"}
                    </p>
                    <p>
                      <strong>Color Palette:</strong> {product.color || "Bespoke Tonal Dye"}
                    </p>
                    <p style={{ marginTop: 8 }}>
                      Crafted using traditional handloom and embroidery techniques native to Pakistan. Subtle variations in dye and stitch are celebrated hallmarks of genuine handcraft.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Care Instructions */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleAccordion("care")}
                  aria-expanded={openAccordion === "care"}
                >
                  <span>Wash & Care Guide</span>
                  <span className="accordion-icon">{openAccordion === "care" ? "−" : "+"}</span>
                </button>
                {openAccordion === "care" && (
                  <div className="accordion-content">
                    <ul className="care-bullet-list">
                      <li>Dry clean recommended for silk, organza, and velvet ensembles.</li>
                      <li>For unstitched lawn, gentle cold hand wash separately before stitching.</li>
                      <li>Do not tumble dry; dry flat in shade to preserve color brilliance.</li>
                      <li>Iron at moderate temperature inside-out over embroidery work.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Returns */}
              <div className="pdp-accordion-item">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleAccordion("shipping")}
                  aria-expanded={openAccordion === "shipping"}
                >
                  <span>Complimentary Shipping & Returns</span>
                  <span className="accordion-icon">{openAccordion === "shipping" ? "−" : "+"}</span>
                </button>
                {openAccordion === "shipping" && (
                  <div className="accordion-content">
                    <p>
                      <strong>Nationwide Pakistan Delivery:</strong> Complimentary express delivery on all orders over Rs. 5,000. Standard courier dispatch via TCS, Leopards, or Trax.
                    </p>
                    <p style={{ marginTop: 6 }}>
                      <strong>14-Day Exchange Policy:</strong> Unused, unwashed garments with original tags intact may be exchanged within 14 days of delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY MOBILE BUY BAR (Scroll-triggered) */}
      <StickyMobileBuyBar
        product={product}
        selectedSize={selectedSize}
        totalPrice={totalPrice}
        onAdd={handleAddToCart}
        targetRefId="pdp-main-add-btn"
      />

      {/* SIZE GUIDE DRAWER */}
      <SizeGuideDrawer
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
        modelInfo={product.modelInfo}
      />

      {/* FULLSCREEN IMAGE ZOOM LIGHTBOX */}
      {zoomImage && (
        <div
          className="pdp-zoom-lightbox"
          onClick={() => setZoomImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution image zoom"
        >
          <button
            type="button"
            className="zoom-close-btn"
            onClick={() => setZoomImage(null)}
            aria-label="Close zoom"
          >
            ✕
          </button>
          <div className="zoom-img-container" onClick={(e) => e.stopPropagation()}>
            <SmartImage
              src={zoomImage}
              alt={product.name}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
