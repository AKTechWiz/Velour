"use client";

import { useEffect, useState } from "react";
import { IconClose, IconWhatsApp } from "./Icons";

const WHATSAPP_NUMBER = "923001234567"; // Brand WhatsApp concierge number

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const prefilledMessage = encodeURIComponent(
    `Hello VELOUR! I am interested in your luxury pieces: ${currentUrl}`
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${prefilledMessage}`;

  return (
    <div className="floating-wa-container" aria-label="WhatsApp Stylist Consultation">
      {isOpen && (
        <div className="floating-wa-card" role="dialog" aria-modal="true">
          <div className="floating-wa-header">
            <div>
              <p className="floating-wa-title">VELOUR Concierge</p>
              <p className="floating-wa-status" style={{ fontSize: "11px", color: "var(--muted)" }}>
                Client Advisory &amp; Bespoke Inquiries
              </p>
            </div>
            <button
              type="button"
              className="floating-wa-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close consultation card"
            >
              <IconClose />
            </button>
          </div>

          <div className="floating-wa-body">
            <p>
              Need assistance with custom sizing, unstitched fabric lengths, or bridal orders?
              Our private client stylists are here to assist.
            </p>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            onClick={() => setIsOpen(false)}
          >
            <IconWhatsApp />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      <button
        type="button"
        className="floating-wa-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Contact stylist on WhatsApp"
      >
        <IconWhatsApp />
      </button>
    </div>
  );
}
