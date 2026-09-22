"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { insforge } from "@/lib/insforge";
import { money } from "@/lib/format";
import { useToast } from "@/lib/store";

interface OrderItemSnapshot {
  productId: string;
  name: string;
  size: string;
  qty: number;
  price: number;
  image?: string;
}

interface OrderRecord {
  id: string;
  order_number?: string;
  created_at: string;
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  items?: OrderItemSnapshot[];
  payment_receipt_url?: string | null;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

interface UserProfile {
  id: string;
  email?: string;
  profile?: {
    name?: string;
  };
}

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function getStepIndex(status: string): number {
  const s = (status || "pending").toLowerCase();
  if (s === "delivered") return 3;
  if (s === "shipped") return 2;
  if (s === "paid" || s === "confirmed") return 1;
  return 0; // pending
}

export default function ProfilePage() {
  const router = useRouter();
  const { push } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const { data: authData, error: authError } = await insforge.auth.getCurrentUser();

        if (authError || !authData?.user) {
          router.replace("/login?from=/profile");
          return;
        }

        if (!mounted) return;
        setUser(authData.user);

        // Fetch user orders from InsForge database
        const { data: orderRows, error: orderError } = await insforge.database
          .from("orders")
          .select("*")
          .eq("user_id", authData.user.id)
          .order("created_at", { ascending: false });

        if (!orderError && orderRows) {
          setOrders(orderRows);
        } else if (authData.user.email) {
          // Fallback query by email if placed as guest with same email
          const { data: emailOrders } = await insforge.database
            .from("orders")
            .select("*")
            .eq("customer_email", authData.user.email)
            .order("created_at", { ascending: false });
          if (emailOrders) setOrders(emailOrders);
        }
      } catch (err) {
        console.warn("Profile load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await insforge.auth.signOut();
      window.dispatchEvent(new Event("insforge-auth-change"));
      push("Signed out successfully", "info");
      router.push("/login");
    } catch {
      push("Error signing out", "info");
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 840, margin: "80px auto", textAlign: "center" }}>
        <p style={{ color: "var(--muted)" }}>Loading your profile & order history…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container" style={{ maxWidth: 860, margin: "40px auto 80px", padding: "0 20px" }}>
      {/* Profile Header */}
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--line)",
          borderRadius: "8px",
          padding: "32px",
          marginBottom: "36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "var(--shadow)",
        }}
      >
        <div>
          <p className="section-eyebrow" style={{ marginBottom: 4 }}>
            Customer Profile
          </p>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>
            {user.profile?.name || "Valued Member"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Signed in as <strong>{user.email}</strong>
          </p>
        </div>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ padding: "10px 20px", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Signing Out…" : "Sign Out"}
        </button>
      </div>

      {/* Orders Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
          <h2 style={{ fontSize: "1.5rem" }}>Order History</h2>
          <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              background: "var(--white)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--muted)", marginBottom: 16 }}>
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/women" className="btn btn-primary">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {orders.map((o) => {
              const currentStepIdx = getStepIndex(o.status);
              const displayDate = o.created_at
                ? new Date(o.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={o.id}
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    padding: "28px 24px",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  {/* Order header row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 20,
                      borderBottom: "1px solid var(--line, #eee)",
                      paddingBottom: 16,
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "1.1rem" }}>
                        {o.order_number || o.id.slice(0, 16)}
                      </strong>
                      <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: 4 }}>
                        Placed on {displayDate} · ID: <span style={{ fontFamily: "monospace" }}>{o.id}</span>
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: "1.2rem", display: "block" }}>
                        {money(Number(o.total))}
                      </strong>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 4,
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background:
                            o.status.toLowerCase() === "delivered"
                              ? "#2a9d8f"
                              : o.status.toLowerCase() === "shipped"
                              ? "#264653"
                              : o.status.toLowerCase() === "paid"
                              ? "#457b9d"
                              : "#e76f51",
                          color: "#fff",
                        }}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Status Tracker: pending -> paid -> shipped -> delivered */}
                  <div style={{ margin: "24px 0 28px" }}>
                    <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 14 }}>
                      Live Fulfillment Tracker
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "relative",
                      }}
                    >
                      {/* Connecting Background Line */}
                      <div
                        style={{
                          position: "absolute",
                          left: "5%",
                          right: "5%",
                          top: "14px",
                          height: "3px",
                          background: "var(--line)",
                          zIndex: 0,
                        }}
                      />
                      {/* Connecting Active Line */}
                      <div
                        style={{
                          position: "absolute",
                          left: "5%",
                          width: `${(currentStepIdx / (STEPS.length - 1)) * 90}%`,
                          top: "14px",
                          height: "3px",
                          background: "#2a9d8f",
                          zIndex: 0,
                          transition: "width 0.4s ease",
                        }}
                      />

                      {STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step.key}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              position: "relative",
                              zIndex: 1,
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: isDone ? "#2a9d8f" : "var(--line)",
                                color: isDone ? "#fff" : "var(--muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 700,
                                border: isCurrent ? "3px solid #b7e4c7" : "none",
                                boxShadow: isCurrent ? "0 0 0 2px #2a9d8f" : "none",
                              }}
                            >
                              {idx < currentStepIdx ? "✓" : idx + 1}
                            </div>
                            <span
                              style={{
                                marginTop: 8,
                                fontSize: "12px",
                                fontWeight: isCurrent ? 700 : 500,
                                color: isDone ? "var(--ink)" : "var(--muted)",
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items snapshot */}
                  {Array.isArray(o.items) && o.items.length > 0 && (
                    <div
                      style={{
                        borderTop: "1px solid var(--line)",
                        paddingTop: 16,
                        marginTop: 16,
                      }}
                    >
                      <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>
                        Items Snapshot
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {o.items.map((item, i) => (
                          <div
                            key={`${item.productId || i}-${item.size}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "0.9rem",
                            }}
                          >
                            <span>
                              <strong>{item.name}</strong> · Size {item.size} × {item.qty}
                            </span>
                            <span>{money(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Receipt Link if uploaded */}
                  {o.payment_receipt_url && (
                    <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--line, #eee)", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--muted)" }}>Payment Receipt: </span>
                      <a
                        href={o.payment_receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2a9d8f", textDecoration: "underline", fontWeight: 600 }}
                      >
                        View Uploaded Receipt ↗
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
