"use client";

import React, { useState, useEffect } from "react";
import { IconClose } from "./Icons";
import type { ModelInfo } from "@/lib/types";

interface SizeGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  modelInfo?: ModelInfo;
}

type Unit = "cm" | "in";

interface SizeRow {
  size: string;
  bust: { in: string; cm: string };
  waist: { in: string; cm: string };
  hip: { in: string; cm: string };
  length: { in: string; cm: string };
  shoulder: { in: string; cm: string };
}

const WOMENS_CHART: SizeRow[] = [
  { size: "XS", bust: { in: "34", cm: "86" }, waist: { in: "28", cm: "71" }, hip: { in: "38", cm: "96" }, length: { in: "40", cm: "102" }, shoulder: { in: "14", cm: "35.5" } },
  { size: "S",  bust: { in: "36", cm: "91" }, waist: { in: "30", cm: "76" }, hip: { in: "40", cm: "102" }, length: { in: "41", cm: "104" }, shoulder: { in: "14.5", cm: "37" } },
  { size: "M",  bust: { in: "39", cm: "99" }, waist: { in: "33", cm: "84" }, hip: { in: "43", cm: "109" }, length: { in: "42", cm: "107" }, shoulder: { in: "15", cm: "38" } },
  { size: "L",  bust: { in: "42", cm: "107" }, waist: { in: "36", cm: "91" }, hip: { in: "46", cm: "117" }, length: { in: "43", cm: "109" }, shoulder: { in: "15.5", cm: "39.5" } },
  { size: "XL", bust: { in: "45", cm: "114" }, waist: { in: "39", cm: "99" }, hip: { in: "49", cm: "124" }, length: { in: "44", cm: "112" }, shoulder: { in: "16", cm: "41" } },
];

const MENS_CHART = [
  { size: "S",  chest: { in: "38", cm: "96" }, collar: { in: "15", cm: "38" }, length: { in: "40", cm: "102" }, sleeve: { in: "24.5", cm: "62" } },
  { size: "M",  chest: { in: "41", cm: "104" }, collar: { in: "15.5", cm: "39.5" }, length: { in: "42", cm: "107" }, sleeve: { in: "25", cm: "63.5" } },
  { size: "L",  chest: { in: "44", cm: "112" }, collar: { in: "16", cm: "40.5" }, length: { in: "44", cm: "112" }, sleeve: { in: "25.5", cm: "65" } },
  { size: "XL", chest: { in: "47", cm: "119" }, collar: { in: "16.5", cm: "42" }, length: { in: "45", cm: "114" }, sleeve: { in: "26", cm: "66" } },
];

export default function SizeGuideDrawer({
  isOpen,
  onClose,
  category = "women",
  modelInfo,
}: SizeGuideDrawerProps) {
  const [unit, setUnit] = useState<Unit>("in");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMen = category === "men";

  return (
    <>
      <div
        className="size-guide-backdrop open"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="size-guide-drawer open"
        role="dialog"
        aria-modal="true"
        aria-label="Garment Size Guide"
      >
        <div className="size-guide-header">
          <div>
            <h2 className="size-guide-title">Garment Size Guide</h2>
            <p className="size-guide-subtitle">
              {isMen ? "Men's Luxury Kurtas & Waistcoats" : "Women's Pret & Ready to Wear"}
            </p>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label="Close size guide"
          >
            <IconClose />
          </button>
        </div>

        <div className="size-guide-body">
          {/* Unit Toggle & Model Info */}
          <div className="size-guide-top-bar">
            {modelInfo ? (
              <div className="model-stats-chip">
                <span>Model: {modelInfo.height}</span>
                <span className="dot">•</span>
                <span>Wearing {modelInfo.sizeWorn}</span>
              </div>
            ) : (
              <div className="model-stats-chip">
                <span>Standard Pakistani Tailoring Sizing</span>
              </div>
            )}

            <div className="unit-toggle" role="radiogroup" aria-label="Measurement units">
              <button
                type="button"
                className={`unit-btn ${unit === "in" ? "active" : ""}`}
                onClick={() => setUnit("in")}
              >
                Inches (in)
              </button>
              <button
                type="button"
                className={`unit-btn ${unit === "cm" ? "active" : ""}`}
                onClick={() => setUnit("cm")}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="size-table-container">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  {isMen ? (
                    <>
                      <th>Chest ({unit})</th>
                      <th>Collar ({unit})</th>
                      <th>Length ({unit})</th>
                      <th>Sleeve ({unit})</th>
                    </>
                  ) : (
                    <>
                      <th>Bust / Chest ({unit})</th>
                      <th>Waist ({unit})</th>
                      <th>Hip ({unit})</th>
                      <th>Length ({unit})</th>
                      <th>Shoulder ({unit})</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {isMen
                  ? MENS_CHART.map((r) => (
                      <tr key={r.size}>
                        <td className="size-label">{r.size}</td>
                        <td>{r.chest[unit]}</td>
                        <td>{r.collar[unit]}</td>
                        <td>{r.length[unit]}</td>
                        <td>{r.sleeve[unit]}</td>
                      </tr>
                    ))
                  : WOMENS_CHART.map((r) => (
                      <tr key={r.size}>
                        <td className="size-label">{r.size}</td>
                        <td>{r.bust[unit]}</td>
                        <td>{r.waist[unit]}</td>
                        <td>{r.hip[unit]}</td>
                        <td>{r.length[unit]}</td>
                        <td>{r.shoulder[unit]}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Instructions */}
          <div className="how-to-measure-section">
            <h3 className="measure-heading">How to Measure</h3>
            <div className="measure-grid">
              <div className="measure-item">
                <strong>1. Chest / Bust</strong>
                <p>Measure across the fullest part of the chest, keeping the tape horizontal under the arms.</p>
              </div>
              <div className="measure-item">
                <strong>2. Waist</strong>
                <p>Measure around your natural waistline, loosely where your trousers or shalwar rests.</p>
              </div>
              <div className="measure-item">
                <strong>3. Kurta Length</strong>
                <p>Measure straight down from the high point of the shoulder to the desired hemline.</p>
              </div>
              <div className="measure-item">
                <strong>4. Shoulders</strong>
                <p>Measure across the back from the tip of one shoulder bone to the other.</p>
              </div>
            </div>
          </div>

          <div className="size-guide-note">
            <p>
              <strong>Tailoring Note:</strong> All VELOUR garments are crafted with a generous 1.5-inch inner margin to allow custom adjustments by your personal master tailor if desired.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
