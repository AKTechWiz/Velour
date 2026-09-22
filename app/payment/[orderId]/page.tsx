import type { Metadata } from "next";
import PaymentPage from "@/components/PaymentPage";

export const metadata: Metadata = { title: "Complete Payment — VELOUR" };

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <PaymentPage orderId={orderId} />;
}
