"use client";

import React, { useState } from "react";
import { money } from "@/lib/format";

export type StitchingMode = "unstitched" | "standard" | "custom";

export interface CustomMeasurements {
  shirtLength: string;
  bust: string;
  waist: string;
  hip: string;
  trouserLength: string;
}

interface StitchingConfiguratorProps {
  baseStitchingFee?: number;
  selectedMode: StitchingMode;
  onModeChange: (mode: StitchingMode, fee: number, customDetails?: string) => void;
}

export default function StitchingConfigurator({
  baseStitchingFee = 2800,
  selectedMode,
  onModeChange,
}: StitchingConfiguratorProps) {
  const customFee = baseStitchingFee + 1000; // e.g. Rs. 3,800 for bespoke

  const [measurements, setMeasurements] = useState<CustomMeasurements>({
    shirtLength: "",
    bust: "",
    waist: "",
    hip: "",
    trouserLength: "",
  });

  const handleModeSelect = (mode: StitchingMode) => {
    let fee = 0;
    if (mode === "standard") fee = baseStitchingFee;
    if (mode === "custom") fee = customFee;

    const customString =
      mode === "custom"
        ? `L: ${measurements.shirtLength}", B: ${measurements.bust}", W: ${measurements.waist}", H: ${measurements.hip}", T: ${measurements.trouserLength}"`
        : undefined;

    onModeChange(mode, fee, customString);
  };

  const handleMeasurementChange = (field: keyof CustomMeasurements, val: string) => {
    const updated = { ...measurements, [field]: val };
    setMeasurements(updated);
    const customString = `L: ${updated.shirtLength}", B: ${updated.bust}", W: ${updated.waist}", H: ${updated.hip}", T: ${updated.trouserLength}"`;
    onModeChange("custom", customFee, customString);
  };

  return (
    <div className="stitching-configurator">
      <div className="stitching-head">
        <h3 className="stitching-title">Atelier Tailoring & Stitching Service</h3>
        <span className="stitching-badge">Hand-Finished</span>
      </div>

      <div className="stitching-options-list">
        {/* Option 1: Unstitched */}
        <label className={`stitching-option-card ${selectedMode === "unstitched" ? "selected" : ""}`}>
          <input
            type="radio"
            name="stitching_mode"
            value="unstitched"
            checked={selectedMode === "unstitched"}
            onChange={() => handleModeSelect("unstitched")}
            className="stitching-radio"
          />
          <div className="stitching-option-info">
            <span className="stitching-name">Unstitched / Fabric Only</span>
            <span className="stitching-desc">Ships in 24–48 hours in luxury box packaging</span>
          </div>
          <span className="stitching-price-tag">Included</span>
        </label>

        {/* Option 2: Standard Stitched */}
        <label className={`stitching-option-card ${selectedMode === "standard" ? "selected" : ""}`}>
          <input
            type="radio"
            name="stitching_mode"
            value="standard"
            checked={selectedMode === "standard"}
            onChange={() => handleModeSelect("standard")}
            className="stitching-radio"
          />
          <div className="stitching-option-info">
            <span className="stitching-name">Standard Stitched Pret</span>
            <span className="stitching-desc">Tailored to your selected size with tonal piping and lining (+4 days)</span>
          </div>
          <span className="stitching-price-tag">+{money(baseStitchingFee)}</span>
        </label>

        {/* Option 3: Custom Sized */}
        <label className={`stitching-option-card ${selectedMode === "custom" ? "selected" : ""}`}>
          <input
            type="radio"
            name="stitching_mode"
            value="custom"
            checked={selectedMode === "custom"}
            onChange={() => handleModeSelect("custom")}
            className="stitching-radio"
          />
          <div className="stitching-option-info">
            <span className="stitching-name">Custom Tailored to Measurements</span>
            <span className="stitching-desc">Master tailor bespoke sizing cut to your exact body silhouette (+6 days)</span>
          </div>
          <span className="stitching-price-tag">+{money(customFee)}</span>
        </label>
      </div>

      {/* Custom measurements inputs when custom is selected */}
      {selectedMode === "custom" && (
        <div className="custom-measurements-panel">
          <p className="custom-panel-instruction">
            Please enter your body or existing shirt measurements in <strong>inches</strong>:
          </p>
          <div className="measurements-inputs-grid">
            <div className="custom-input-box">
              <label>Shirt Length (in)</label>
              <input
                type="number"
                placeholder="e.g. 40"
                value={measurements.shirtLength}
                onChange={(e) => handleMeasurementChange("shirtLength", e.target.value)}
              />
            </div>
            <div className="custom-input-box">
              <label>Chest / Bust (in)</label>
              <input
                type="number"
                placeholder="e.g. 38"
                value={measurements.bust}
                onChange={(e) => handleMeasurementChange("bust", e.target.value)}
              />
            </div>
            <div className="custom-input-box">
              <label>Waist (in)</label>
              <input
                type="number"
                placeholder="e.g. 32"
                value={measurements.waist}
                onChange={(e) => handleMeasurementChange("waist", e.target.value)}
              />
            </div>
            <div className="custom-input-box">
              <label>Hip (in)</label>
              <input
                type="number"
                placeholder="e.g. 42"
                value={measurements.hip}
                onChange={(e) => handleMeasurementChange("hip", e.target.value)}
              />
            </div>
            <div className="custom-input-box">
              <label>Trouser Length (in)</label>
              <input
                type="number"
                placeholder="e.g. 38"
                value={measurements.trouserLength}
                onChange={(e) => handleMeasurementChange("trouserLength", e.target.value)}
              />
            </div>
          </div>
          <span className="custom-help-note">
            Our atelier will also contact you on WhatsApp to reconfirm your measurements before cutting.
          </span>
        </div>
      )}
    </div>
  );
}
