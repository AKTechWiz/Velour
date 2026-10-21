"use client";

import React, { useState, useMemo } from "react";
import { money, FREE_SHIPPING_THRESHOLD_PKR } from "@/lib/format";

interface CityDeliveryEstimatorProps {
  productPrice: number;
}

interface CityOption {
  name: string;
  minDays: number;
  maxDays: number;
}

const PAKISTANI_CITIES: CityOption[] = [
  { name: "Karachi", minDays: 1, maxDays: 2 },
  { name: "Lahore", minDays: 2, maxDays: 3 },
  { name: "Islamabad / Rawalpindi", minDays: 2, maxDays: 3 },
  { name: "Faisalabad", minDays: 2, maxDays: 4 },
  { name: "Multan", minDays: 2, maxDays: 4 },
  { name: "Peshawar", minDays: 3, maxDays: 4 },
  { name: "Sialkot", minDays: 2, maxDays: 4 },
  { name: "Gujranwala", minDays: 2, maxDays: 4 },
  { name: "Hyderabad", minDays: 2, maxDays: 3 },
  { name: "Quetta", minDays: 3, maxDays: 5 },
  { name: "Rest of Pakistan (Nationwide)", minDays: 3, maxDays: 5 },
];

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    // Skip Sunday (0)
    if (result.getDay() !== 0) {
      added++;
    }
  }
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-PK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function CityDeliveryEstimator({ productPrice }: CityDeliveryEstimatorProps) {
  const [selectedCity, setSelectedCity] = useState("Karachi");

  const cityInfo = useMemo(() => {
    return PAKISTANI_CITIES.find((c) => c.name === selectedCity) || PAKISTANI_CITIES[0];
  }, [selectedCity]);

  const deliveryRange = useMemo(() => {
    const today = new Date();
    const startDate = addBusinessDays(today, cityInfo.minDays);
    const endDate = addBusinessDays(today, cityInfo.maxDays);
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  }, [cityInfo]);

  const qualifiesFreeShipping = productPrice >= FREE_SHIPPING_THRESHOLD_PKR;

  return (
    <div className="city-delivery-card">
      <div className="delivery-card-header">
        <div className="delivery-icon-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div>
          <span className="delivery-card-title">Delivery to Your City</span>
          <p className="delivery-card-subtitle">Dispatched via TCS / Leopards Express</p>
        </div>
      </div>

      <div className="delivery-city-select-row">
        <label htmlFor="pdp-city-selector" className="sr-only">
          Select Delivery City
        </label>
        <select
          id="pdp-city-selector"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="city-select-dropdown"
        >
          {PAKISTANI_CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.minDays}–{c.maxDays} Days)
            </option>
          ))}
        </select>
      </div>

      <div className="delivery-estimates-box">
        <div className="estimate-row">
          <span className="estimate-label">Estimated Arrival:</span>
          <span className="estimate-value">{deliveryRange}</span>
        </div>
        <div className="estimate-row">
          <span className="estimate-label">Shipping Cost:</span>
          <span className="estimate-value">
            {qualifiesFreeShipping ? (
              <span className="free-shipping-tag">FREE Nationwide</span>
            ) : (
              `Rs. 250 (Free over ${money(FREE_SHIPPING_THRESHOLD_PKR)})`
            )}
          </span>
        </div>
      </div>

      <div className="delivery-perks-row">
        <div className="delivery-perk">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22863a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Cash on Delivery Available</span>
        </div>
        <div className="delivery-perk">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22863a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Direct Dispatch from Karachi Atelier</span>
        </div>
      </div>
    </div>
  );
}
