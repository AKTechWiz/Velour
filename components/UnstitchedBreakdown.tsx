"use client";

import React from "react";
import type { UnstitchedDetails } from "@/lib/types";

interface UnstitchedBreakdownProps {
  details: UnstitchedDetails;
  fabricName?: string;
}

export default function UnstitchedBreakdown({ details, fabricName }: UnstitchedBreakdownProps) {
  return (
    <div className="unstitched-breakdown-card">
      <div className="unstitched-card-head">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <div>
          <h3 className="unstitched-title">What&apos;s in the Box</h3>
          <p className="unstitched-sub">
            {fabricName ? `${fabricName} — Complete Garment Specification` : "Complete Garment Specification"}
          </p>
        </div>
      </div>

      {/* Fabric Meterage Meters Grid */}
      <div className="meterage-grid">
        {details.shirtMeters > 0 && (
          <div className="meterage-cell">
            <span className="meterage-val">{details.shirtMeters}m</span>
            <span className="meterage-name">Shirt Fabric</span>
          </div>
        )}
        {details.dupattaMeters > 0 && (
          <div className="meterage-cell">
            <span className="meterage-val">{details.dupattaMeters}m</span>
            <span className="meterage-name">Dupatta</span>
          </div>
        )}
        {details.trouserMeters > 0 && (
          <div className="meterage-cell">
            <span className="meterage-val">{details.trouserMeters}m</span>
            <span className="meterage-name">Trouser</span>
          </div>
        )}
        {details.extraBorderMeters && details.extraBorderMeters > 0 ? (
          <div className="meterage-cell">
            <span className="meterage-val">{details.extraBorderMeters}m</span>
            <span className="meterage-name">Embroidered Border</span>
          </div>
        ) : null}
      </div>

      {/* Itemized Inclusions */}
      {details.boxIncludes && details.boxIncludes.length > 0 && (
        <ul className="box-inclusions-list">
          {details.boxIncludes.map((item, index) => (
            <li key={index} className="box-inclusion-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
