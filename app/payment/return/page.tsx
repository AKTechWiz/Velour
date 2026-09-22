import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentReturnPage from "@/components/PaymentReturnPage";

export const metadata: Metadata = { title: "Payment Confirmed — VELOUR" };

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ textAlign: "center", padding: "120px 20px" }}>
          <p style={{ color: "var(--color-muted, #888)" }}>Confirming your payment…</p>
        </div>
      }
    >
      <PaymentReturnPage />
    </Suspense>
  );
}
