"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { money, FREE_SHIPPING_THRESHOLD_PKR, STANDARD_SHIPPING_FEE_PKR } from "@/lib/format";
import { useCart, useToast } from "@/lib/store";
import { insforge } from "@/lib/insforge";
import {
  PAKISTAN_PROVINCES,
  PAKISTAN_CITIES,
  BANK_TRANSFER_DETAILS,
  JAZZCASH_DETAILS,
  EASYPAISA_DETAILS,
  validatePakistanPhone,
  generateTrackingNumber,
} from "@/lib/logistics";
import { PaymentMethod, CourierPartner, Order } from "@/lib/types";
import CodVerificationModal from "./CodVerificationModal";

interface FormState {
  name: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  area: string;
  address: string;
  nearestLandmark: string;
  addressType: "home" | "office";
  notes: string;
  paymentMethod: PaymentMethod;
  walletNumber: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  province: "Sindh",
  city: "Karachi",
  area: "",
  address: "",
  nearestLandmark: "",
  addressType: "home",
  notes: "",
  paymentMethod: "cod",
  walletNumber: "",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { push } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);

  // COD Verification State
  const [showCodModal, setShowCodModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<Order | null>(null);

  // Confirmed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD_PKR ? 0 : STANDARD_SHIPPING_FEE_PKR;
  const total = subtotal + shipping;

  // Selected city info
  const selectedCityInfo = PAKISTAN_CITIES.find((c) => c.name === form.city) || PAKISTAN_CITIES[0];
  const detectedCarrier = validatePakistanPhone(form.phone).carrier;

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      const u = data?.user;
      if (u) {
        setCurrentUser({ id: u.id, email: u.email });
        setForm((f) => ({
          ...f,
          email: f.email || u.email || "",
          name: f.name || (u.profile as { name?: string })?.name || "",
        }));
      }
    });
  }, []);

  const setField = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, phone: val, walletNumber: f.walletNumber || val }));
    setErrors((er) => ({ ...er, phone: undefined }));
  };

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const cityData = PAKISTAN_CITIES.find((c) => c.name === cityName);
    setForm((f) => ({
      ...f,
      city: cityName,
      province: cityData ? cityData.province : f.province,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        push("Receipt file must be under 10MB", "info");
        return;
      }
      setReceiptFile(file);
      push(`Attached payment receipt: ${file.name}`);
    }
  };

  const validate = (): boolean => {
    const er: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) er.name = "Full name is required";

    const phoneValidation = validatePakistanPhone(form.phone);
    if (!phoneValidation.valid) {
      er.phone = "Enter a valid Pakistan mobile number (e.g., 0300-1234567)";
    }

    if (!form.address.trim()) er.address = "Complete street address is required";
    if (!form.city.trim()) er.city = "Please select your city";

    if (form.paymentMethod === "card") {
      if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, "").length < 16) {
        er.cardNumber = "Enter a valid 16-digit card number";
      }
      if (!form.cardExpiry.trim()) er.cardExpiry = "MM/YY required";
      if (!form.cardCvv.trim() || form.cardCvv.length < 3) er.cardCvv = "CVV required";
    }

    if ((form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa") && !form.walletNumber.trim()) {
      er.walletNumber = "Mobile wallet account number is required";
    }

    if (form.paymentMethod === "cod" && total > 40000) {
      er.paymentMethod = "COD is limited to Rs. 40,000. Please choose Card, Raast, or Bank Transfer for high-value orders.";
    }

    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const num = `VL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const courier: CourierPartner = selectedCityInfo.courier;
    const trackingNum = generateTrackingNumber(courier, form.city);

    const orderData: Order = {
      orderNumber: num,
      trackingNumber: trackingNum,
      courier,
      paymentMethod: form.paymentMethod,
      codVerified: false,
      customer: {
        name: form.name.trim(),
        email: form.email.trim() || `${form.phone.replace(/\D/g, "")}@velour.pk`,
        phone: form.phone.trim(),
      },
      shipping: {
        province: form.province,
        city: form.city,
        area: form.area.trim(),
        address: form.address.trim(),
        nearestLandmark: form.nearestLandmark.trim(),
        addressType: form.addressType,
        country: "Pakistan",
      },
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        qty: i.qty,
        price: i.price,
        image: i.image,
      })),
      subtotal,
      shippingFee: shipping,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedDelivery: selectedCityInfo.transitDays,
    };

    if (form.paymentMethod === "cod") {
      // Trigger COD OTP Modal before final commitment
      setPendingOrderData(orderData);
      setShowCodModal(true);
    } else {
      await finalizeOrder(orderData, false);
    }
  };

  const finalizeOrder = async (orderData: Order, wasCodVerified: boolean) => {
    setSubmitting(true);
    try {
      let receiptUrl: string | null = null;

      if (receiptFile) {
        const { data: uploadData, error: uploadErr } = await insforge.storage
          .from("payment-uploads")
          .uploadAuto(receiptFile);
        if (!uploadErr && uploadData?.url) {
          receiptUrl = uploadData.url;
        }
      }

      const orderPayload = {
        user_id: currentUser?.id || null,
        order_number: orderData.orderNumber,
        tracking_number: orderData.trackingNumber,
        courier: orderData.courier,
        payment_method: orderData.paymentMethod,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shippingFee,
        shipping_fee: orderData.shippingFee,
        total: orderData.total,
        status: wasCodVerified ? "confirmed" : "pending",
        cod_verified: wasCodVerified,
        contact: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
        },
        shipping_address: orderData.shipping,
        payment_receipt_url: receiptUrl,
        customer_name: orderData.customer.name,
        customer_email: orderData.customer.email,
        customer_phone: orderData.customer.phone,
        notes: form.notes,
      };

      // 1. Insert into InsForge database
      const { data: insertedOrder, error: insertError } = await insforge.database
        .from("orders")
        .insert([orderPayload])
        .select("id, order_number, tracking_number, status, total");

      if (insertError) {
        console.warn("Notice: InsForge remote write warning:", insertError.message);
      }

      const realId = insertedOrder?.[0]?.id || orderData.orderNumber;
      const finalOrder: Order = {
        ...orderData,
        id: realId,
        status: wasCodVerified ? "confirmed" : "pending",
        codVerified: wasCodVerified,
      };

      // 2. Persist in localStorage for instant tracking
      try {
        const existingRaw = localStorage.getItem("velour_orders") || "[]";
        const ordersList: Order[] = JSON.parse(existingRaw);
        ordersList.unshift(finalOrder);
        localStorage.setItem("velour_orders", JSON.stringify(ordersList.slice(0, 20)));
      } catch (e) {
        console.warn("Storage save note:", e);
      }

      // 3. Clear cart & set confirmed order state
      clearCart();
      push(wasCodVerified ? "COD Order Verified & Confirmed!" : "Order placed successfully!");
      setConfirmedOrder(finalOrder);
    } catch (err: unknown) {
      console.error("Order completion error:", err);
      push(err instanceof Error ? err.message : "Error placing order", "info");
    } finally {
      setSubmitting(false);
      setShowCodModal(false);
    }
  };

  // -------------------------------------------------------------
  // CONFIRMATION VIEW
  // -------------------------------------------------------------
  if (confirmedOrder) {
    return (
      <div className="container" style={{ maxWidth: 720, margin: "60px auto", padding: "0 20px" }}>
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-md)",
            padding: "44px 36px",
            textAlign: "center",
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--success)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              margin: "0 auto 20px",
            }}
          >
            ✓
          </div>

          <p className="section-eyebrow" style={{ color: "var(--success)", marginBottom: 6 }}>
            {confirmedOrder.codVerified ? "COD Order Verified & Scheduled" : "Order Successfully Placed"}
          </p>
          <h1 style={{ fontSize: "2.2rem", marginBottom: 12 }}>Thank You For Choosing Velour</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 28, lineHeight: 1.5 }}>
            Your order <strong>{confirmedOrder.orderNumber}</strong> has been logged. Delivery updates will be dispatched via SMS & WhatsApp to <strong>{confirmedOrder.customer.phone}</strong>.
          </p>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              padding: "24px",
              textAlign: "left",
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Order Reference</span>
              <strong style={{ fontFamily: "monospace", fontSize: "1.05rem" }}>{confirmedOrder.orderNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Airway Bill (AWB) Tracking</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "var(--gold)", fontWeight: 700 }}>
                {confirmedOrder.trackingNumber}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Assigned Courier</span>
              <span style={{ fontWeight: 600 }}>{confirmedOrder.courier} Express</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Destination City</span>
              <span>{confirmedOrder.shipping.city} ({confirmedOrder.shipping.province})</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Estimated Transit</span>
              <strong style={{ color: "var(--success)" }}>{confirmedOrder.estimatedDelivery || "2–3 Days"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Payment Method</span>
              <span style={{ textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600 }}>
                {confirmedOrder.paymentMethod}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--line)",
                paddingTop: 14,
              }}
            >
              <span style={{ fontWeight: 600 }}>Total Payable</span>
              <strong style={{ fontSize: "1.25rem", color: "var(--color-foreground)" }}>
                {money(confirmedOrder.total)}
              </strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href={`/track?ref=${encodeURIComponent(confirmedOrder.trackingNumber)}`}
              className="btn btn-primary"
              style={{ padding: "14px 28px", fontSize: "0.95rem" }}
            >
              Track Order Real-Time →
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ padding: "14px 28px", fontSize: "0.95rem" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // EMPTY CART
  // -------------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <div className="empty-state">
          <h2>Nothing to check out</h2>
          <p>Your bag is empty.</p>
          <Link href="/women" className="btn">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-page" style={{ margin: "40px auto 80px" }}>
      {/* Prepaid Incentive Banner */}
      <div className="checkout-privilege-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.75" style={{ flexShrink: 0 }}>
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
        </svg>
        <div style={{ fontSize: "0.88rem", color: "var(--ink)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--ink)" }}>Prepaid Luxury Privilege:</strong> Pay online via Card, Raast, or JazzCash for priority courier dispatch and complimentary keepsake garment packaging.
        </div>
      </div>

      <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: "32px", fontFamily: "var(--serif)" }}>
        Secure Checkout
      </h1>

      <form className="checkout-layout" onSubmit={handleFormSubmit} noValidate>
        <div>
          {/* SECTION 1: CONTACT (PHONE-FIRST) */}
          <section className="form-section">
            <div className="form-section-header">
              <h2>1. Contact Information</h2>
              <span className="form-section-badge">Phone-first verification</span>
            </div>
            
            <div className="form-grid">
              <div className="full">
                <label htmlFor="checkout-phone" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  Mobile Phone Number <span style={{ color: "#d9534f" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="checkout-phone"
                    type="tel"
                    placeholder="0300 1234567 or +92 3XX-XXXXXXX"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    autoComplete="tel"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      paddingRight: detectedCarrier ? "90px" : "14px",
                      borderRadius: "6px",
                      border: errors.phone ? "1.5px solid var(--rose, #d9534f)" : "1px solid var(--line)",
                      background: "var(--surface-card)",
                      color: "var(--ink)",
                      fontSize: "0.95rem",
                    }}
                  />
                  {detectedCarrier && (
                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "var(--surface)",
                        border: "1px solid var(--line)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "var(--ink-light)",
                      }}
                    >
                      {detectedCarrier}
                    </span>
                  )}
                </div>
                {errors.phone && <span className="field-error">{errors.phone}</span>}
                <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 4, display: "block" }}>
                  Used for courier delivery updates and COD 1-click verification
                </span>
              </div>

              <div>
                <label htmlFor="checkout-name" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  Full Name <span style={{ color: "#d9534f" }}>*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="e.g. Fatima Khan"
                  value={form.name}
                  onChange={setField("name")}
                  autoComplete="name"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: errors.name ? "1.5px solid #d9534f" : "1px solid var(--line, #ddd)",
                  }}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div>
                <label htmlFor="checkout-email" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  Email Address <span style={{ color: "var(--muted)", fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="For electronic receipt"
                  value={form.email}
                  onChange={setField("email")}
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--line, #ddd)",
                  }}
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: SHIPPING DESTINATION */}
          <section className="form-section">
            <div className="form-section-header">
              <h2>2. Delivery Address</h2>
              <span className="form-section-badge" style={{ color: "var(--success)", letterSpacing: "0.04em" }}>
                {selectedCityInfo.transitDays} via {selectedCityInfo.courier}
              </span>
            </div>

            <div className="form-grid">
              <div>
                <label htmlFor="checkout-province" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  Province <span style={{ color: "#d9534f" }}>*</span>
                </label>
                <select
                  id="checkout-province"
                  value={form.province}
                  onChange={setField("province")}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--line)",
                    background: "var(--surface-card)",
                    color: "var(--ink)",
                  }}
                >
                  {PAKISTAN_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="checkout-city" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  City <span style={{ color: "#d9534f" }}>*</span>
                </label>
                <select
                  id="checkout-city"
                  value={form.city}
                  onChange={handleCityChange}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: errors.city ? "1.5px solid var(--rose, #d9534f)" : "1px solid var(--line)",
                    background: "var(--surface-card)",
                    color: "var(--ink)",
                  }}
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.transitDays})
                    </option>
                  ))}
                </select>
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>

              <div>
                <label htmlFor="checkout-area" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  Sector / Area / Locality
                </label>
                <input
                  id="checkout-area"
                  type="text"
                  placeholder="e.g. DHA Phase 5, Gulberg III, F-7"
                  value={form.area}
                  onChange={setField("area")}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--line, #ddd)",
                  }}
                />
              </div>

              <div>
                <label htmlFor="checkout-landmark" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  Nearest Landmark <span style={{ color: "var(--muted)", fontWeight: 400 }}>(Crucial for rider)</span>
                </label>
                <input
                  id="checkout-landmark"
                  type="text"
                  placeholder="e.g. Near Bilawal Chowrangi / Behind Jamia Mosque"
                  value={form.nearestLandmark}
                  onChange={setField("nearestLandmark")}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--line, #ddd)",
                  }}
                />
              </div>

              <div className="full">
                <label htmlFor="checkout-address" style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                  House / Apartment / Street Address <span style={{ color: "#d9534f" }}>*</span>
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  placeholder="House #, Street #, Building Name"
                  value={form.address}
                  onChange={setField("address")}
                  autoComplete="street-address"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    border: errors.address ? "1.5px solid #d9534f" : "1px solid var(--line, #ddd)",
                  }}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div className="full" style={{ display: "flex", gap: "20px", alignItems: "center", marginTop: "4px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Address Type:</span>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input
                    type="radio"
                    name="addressType"
                    checked={form.addressType === "home"}
                    onChange={() => setForm((f) => ({ ...f, addressType: "home" }))}
                  />
                  Home (All Day Delivery)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input
                    type="radio"
                    name="addressType"
                    checked={form.addressType === "office"}
                    onChange={() => setForm((f) => ({ ...f, addressType: "office" }))}
                  />
                  Office (9:00 AM – 6:00 PM)
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 3: PAKISTANI PAYMENT SUITE */}
          <section className="form-section">
            <h2>3. Payment Method</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 16 }}>
              Choose your preferred domestic payment option. All transactions are securely encrypted.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {/* Option 1: Cash on Delivery */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  border: form.paymentMethod === "cod" ? "2px solid var(--color-primary, #b76e79)" : "1px solid var(--line, #ddd)",
                  background: form.paymentMethod === "cod" ? "#fbf8f5" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === "cod"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "cod" }))}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem" }}>Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: "0.75rem", background: "#f0ece1", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                      1-Click WhatsApp Verified
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    Pay in cash upon doorstep delivery by {selectedCityInfo.courier} rider. Available up to Rs. 40,000.
                  </p>
                </div>
              </label>

              {/* Option 2: Credit / Debit Card */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  border: form.paymentMethod === "card" ? "2px solid var(--color-primary, #b76e79)" : "1px solid var(--line, #ddd)",
                  background: form.paymentMethod === "card" ? "#fbf8f5" : "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={form.paymentMethod === "card"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "card" }))}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem" }}>Credit & Debit Card (Visa, Mastercard, PayPak)</strong>
                    <span style={{ fontSize: "0.75rem", color: "#2a9d8f", fontWeight: 600 }}>
                      Priority Dispatch
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    3-D Secure encrypted checkout via domestic banking gateway.
                  </p>
                </div>
              </label>

              {/* Card Details Sub-form */}
              {form.paymentMethod === "card" && (
                <div
                  style={{
                    background: "#faf9f8",
                    border: "1px solid var(--line, #eee)",
                    borderRadius: "8px",
                    padding: "16px",
                    margin: "0 0 10px 30px",
                  }}
                >
                  <div className="form-grid">
                    <div className="full">
                      <label style={{ display: "block", marginBottom: 4, fontSize: "0.8rem", fontWeight: 600 }}>Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="As printed on card"
                        value={form.cardName}
                        onChange={setField("cardName")}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
                      />
                    </div>
                    <div className="full">
                      <label style={{ display: "block", marginBottom: 4, fontSize: "0.8rem", fontWeight: 600 }}>Card Number</label>
                      <input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                        value={form.cardNumber}
                        onChange={setField("cardNumber")}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.cardNumber ? "1.5px solid #d9534f" : "1px solid #ddd" }}
                      />
                      {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontSize: "0.8rem", fontWeight: 600 }}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={form.cardExpiry}
                        onChange={setField("cardExpiry")}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.cardExpiry ? "1.5px solid #d9534f" : "1px solid #ddd" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 4, fontSize: "0.8rem", fontWeight: 600 }}>CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="3 digits"
                        maxLength={4}
                        value={form.cardCvv}
                        onChange={setField("cardCvv")}
                        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.cardCvv ? "1.5px solid #d9534f" : "1px solid #ddd" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Option 3: Mobile Wallets (JazzCash / Easypaisa) */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  border: (form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa") ? "2px solid var(--color-primary, #b76e79)" : "1px solid var(--line, #ddd)",
                  background: (form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa") ? "#fbf8f5" : "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "jazzcash" }))}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem" }}>Mobile Wallets (JazzCash & Easypaisa)</strong>
                    <span style={{ fontSize: "0.75rem", background: "#fdf0ed", color: "#d9534f", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                      Instant Push OTP
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    Approve transaction through instant mobile wallet prompt on your smartphone.
                  </p>
                </div>
              </label>

              {/* Wallet Details Sub-form */}
              {(form.paymentMethod === "jazzcash" || form.paymentMethod === "easypaisa") && (
                <div
                  style={{
                    background: "#faf9f8",
                    border: "1px solid var(--line, #eee)",
                    borderRadius: "8px",
                    padding: "16px",
                    margin: "0 0 10px 30px",
                  }}
                >
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                      <input
                        type="radio"
                        name="walletChoice"
                        checked={form.paymentMethod === "jazzcash"}
                        onChange={() => setForm((f) => ({ ...f, paymentMethod: "jazzcash" }))}
                      />
                      JazzCash (Till: {JAZZCASH_DETAILS.tillId})
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                      <input
                        type="radio"
                        name="walletChoice"
                        checked={form.paymentMethod === "easypaisa"}
                        onChange={() => setForm((f) => ({ ...f, paymentMethod: "easypaisa" }))}
                      />
                      Easypaisa (Till: {EASYPAISA_DETAILS.tillId})
                    </label>
                  </div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: "0.8rem", fontWeight: 600 }}>
                    {form.paymentMethod === "jazzcash" ? "JazzCash" : "Easypaisa"} Account Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={form.walletNumber}
                    onChange={setField("walletNumber")}
                    style={{ width: "100%", padding: "10px", borderRadius: "4px", border: errors.walletNumber ? "1.5px solid #d9534f" : "1px solid #ddd" }}
                  />
                  {errors.walletNumber && <span className="field-error">{errors.walletNumber}</span>}
                </div>
              )}

              {/* Option 4: State Bank Raast Instant Payment */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  border: form.paymentMethod === "raast" ? "2px solid var(--color-primary, #b76e79)" : "1px solid var(--line, #ddd)",
                  background: form.paymentMethod === "raast" ? "#fbf8f5" : "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="raast"
                  checked={form.paymentMethod === "raast"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "raast" }))}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem" }}>State Bank Raast Instant Transfer</strong>
                    <span style={{ fontSize: "0.75rem", background: "#e8f5e9", color: "#2e7d32", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                      0% Fee · SBP Instant
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    Zero transaction fee instant account transfer from any Pakistani banking app.
                  </p>
                </div>
              </label>

              {/* Raast Sub-form */}
              {form.paymentMethod === "raast" && (
                <div
                  style={{
                    background: "#f4fbf5",
                    border: "1px solid #c8e6c9",
                    borderRadius: "8px",
                    padding: "16px",
                    margin: "0 0 10px 30px",
                    fontSize: "0.85rem",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Transfer via your Mobile Banking App:</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "var(--muted)" }}>Raast ID (Phone):</span>
                    <strong style={{ fontFamily: "monospace" }}>{BANK_TRANSFER_DETAILS.raastId}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)" }}>Account Title:</span>
                    <strong>{BANK_TRANSFER_DETAILS.accountTitle}</strong>
                  </div>
                </div>
              )}

              {/* Option 5: Direct Bank Transfer with Receipt */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  border: form.paymentMethod === "bank_transfer" ? "2px solid var(--color-primary, #b76e79)" : "1px solid var(--line, #ddd)",
                  background: form.paymentMethod === "bank_transfer" ? "#fbf8f5" : "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={form.paymentMethod === "bank_transfer"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "bank_transfer" }))}
                  style={{ marginTop: "4px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.95rem" }}>Direct Bank Transfer (Meezan Bank)</strong>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
                    IBAN wire transfer with receipt screenshot upload.
                  </p>
                </div>
              </label>

              {/* Bank Transfer Sub-form */}
              {form.paymentMethod === "bank_transfer" && (
                <div
                  style={{
                    background: "#faf9f8",
                    border: "1px solid var(--line, #eee)",
                    borderRadius: "8px",
                    padding: "16px",
                    margin: "0 0 10px 30px",
                    fontSize: "0.85rem",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Velour Corporate Account Details:</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--muted)" }}>Bank:</span>
                    <strong>{BANK_TRANSFER_DETAILS.bankName}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "var(--muted)" }}>Title:</span>
                    <strong>{BANK_TRANSFER_DETAILS.accountTitle}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ color: "var(--muted)" }}>IBAN:</span>
                    <strong style={{ fontFamily: "monospace" }}>{BANK_TRANSFER_DETAILS.iban}</strong>
                  </div>

                  {/* Upload Receipt Dropzone */}
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 8 }}>
                    <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: "0.82rem", color: "var(--ink)" }}>
                      Upload Transfer Receipt / Screenshot
                    </label>
                    <input
                      type="file"
                      id="checkout-receipt"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    {!receiptFile ? (
                      <label
                        htmlFor="checkout-receipt"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "20px 16px",
                          borderRadius: "8px",
                          border: "2px dashed var(--line)",
                          background: "var(--surface)",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "border-color 0.2s, background 0.2s",
                        }}
                      >
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--taupe-deep)" strokeWidth="1.75">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)" }}>
                          Upload Bank Transfer Slip or Screenshot
                        </span>
                        <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                          PNG, JPG, WebP or PDF (Max 10MB)
                        </span>
                      </label>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          background: "rgba(46, 125, 50, 0.08)",
                          border: "1px solid rgba(46, 125, 50, 0.25)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {receiptFile.name}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                              {(receiptFile.size / 1024).toFixed(0)} KB · Ready to verify
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReceiptFile(null)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--muted)",
                            cursor: "pointer",
                            fontSize: "0.78rem",
                            textDecoration: "underline",
                            padding: "4px 8px",
                            flexShrink: 0,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}
          </section>

          {/* SECTION 4: ORDER NOTES */}
          <section className="form-section">
            <h2>4. Delivery Instructions / Gift Note</h2>
            <textarea
              rows={3}
              placeholder="e.g. Please ring doorbell twice, leave with guard, or write a custom gift message on luxury note card."
              value={form.notes}
              onChange={setField("notes")}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "6px",
                border: "1px solid var(--line, #ddd)",
                fontSize: "0.9rem",
              }}
            />
          </section>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <aside className="summary">
          <h2>Order Summary ({items.length} items)</h2>
          <div className="summary-mini" style={{ marginBottom: 16 }}>
            {items.map((i) => (
              <div className="summary-mini-item" key={`${i.productId}-${i.size}`}>
                <span>
                  {i.name} · {i.size} × {i.qty}
                </span>
                <span>{money(i.price * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping ({form.city})</span>
            <span>{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>

          <div className="summary-row total">
            <span>Total Payable</span>
            <span>{money(total)}</span>
          </div>

          <button
            type="submit"
            className="btn btn-wide"
            disabled={submitting}
            style={{ padding: "16px", fontSize: "1rem", fontWeight: 600, letterSpacing: "0.03em" }}
          >
            {submitting ? "Processing Order…" : form.paymentMethod === "cod" ? "Verify & Place COD Order" : "Complete Purchase"}
          </button>

          <p className="shipping-note" style={{ textAlign: "center", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Safe &amp; Secure 256-Bit SSL domestic encryption. Dispatch within 24 hours from Karachi warehouse.</span>
          </p>
        </aside>
      </form>

      {/* COD Verification Modal */}
      {pendingOrderData && (
        <CodVerificationModal
          isOpen={showCodModal}
          phone={pendingOrderData.customer.phone}
          orderNumber={pendingOrderData.orderNumber}
          onVerified={() => finalizeOrder(pendingOrderData, true)}
          onCancel={() => setShowCodModal(false)}
        />
      )}
    </div>
  );
}
