"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ANNOUNCEMENTS = [
  {
    text: "Complimentary Nationwide Delivery on Orders Over Rs. 5,000",
    linkText: "Shop New In",
    href: "/women",
  },
  {
    text: "Cash on Delivery (COD) & Real-Time Tracking via TCS & Leopards",
    linkText: "Track Order",
    href: "/track",
  },
  {
    text: "Express 24–48 Hour Dispatch for Ready-to-Wear Collections",
    linkText: "Explore Collection",
    href: "/women",
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = ANNOUNCEMENTS[index];

  return (
    <aside
      className="announcement-bar"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Store Announcements"
    >
      <div className="container announcement-bar-inner">
        <div
          className="announcement-content"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="announcement-text">{current.text}</span>
          {current.linkText && (
            <Link href={current.href} className="announcement-link">
              {current.linkText} →
            </Link>
          )}
        </div>

        <div className="announcement-dots" aria-hidden="true">
          {ANNOUNCEMENTS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`announcement-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Show announcement ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
