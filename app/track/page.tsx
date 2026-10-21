import type { Metadata } from "next";
import { Suspense } from "react";
import OrderTrackingView from "@/components/OrderTrackingView";

export const metadata: Metadata = {
  title: "Track Your Order — VELOUR Domestic Courier Dispatch",
  description: "Live order and shipment tracking for VELOUR luxury apparel across Pakistan via TCS, Leopards, and PostEx Express.",
};

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <p style={{ color: "var(--muted)" }}>Loading order tracking...</p>
        </div>
      }
    >
      <OrderTrackingView />
    </Suspense>
  );
}
