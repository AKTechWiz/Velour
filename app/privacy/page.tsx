import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Data Protection Policy — VELOUR Pakistan",
  description: "Learn how VELOUR handles domestic customer data, phone-first verification, courier transmission, and payment encryption in compliance with Pakistani regulations.",
};

export default function PrivacyPage() {
  return (
    <div className="container static-page" style={{ maxWidth: 840, margin: "60px auto 100px", padding: "0 20px" }}>
      <p className="section-eyebrow" style={{ color: "var(--taupe-deep)", marginBottom: "6px" }}>
        Customer Trust & Governance
      </p>
      <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--serif)", marginBottom: "20px" }}>
        Privacy & Domestic Data Protection Policy
      </h1>

      <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--ink-soft)", marginBottom: "28px" }}>
        At <strong>VELOUR</strong>, safeguarding our clients&apos; personal information is integral to our luxury service ethos. This policy explains our handling of customer records, mobile contact information, and delivery data across Pakistan.
      </p>

      <h2>1. Phone-First Contact & Verification</h2>
      <p>
        We capture mobile phone numbers (`+92 3XX-XXXXXXX`) for order confirmation, delivery rider routing, and optional 1-click WhatsApp dispatch alerts. To curb invalid or fraudulent orders, Cash on Delivery (COD) dispatches undergo mobile code or WhatsApp verification before warehouse release.
      </p>

      <h2>2. Courier & Logistics Data Transmission</h2>
      <p>
        To fulfill your deliveries within 1–4 business days, essential contact and address details (recipient name, telephone, delivery address, and nearest landmark) are transmitted through secure API integrations to our accredited domestic courier partners: <strong>TCS Express</strong>, <strong>Leopards Courier</strong>, <strong>PostEx</strong>, and <strong>Trax Logistics</strong>.
      </p>

      <h2>3. Payment Security & Zero Card Storage</h2>
      <p>
        VELOUR maintains a strict zero-card-retention architecture. Electronic card transactions (Visa, Mastercard, PayPak) are processed via State Bank-compliant 3-D Secure gateways. We never store credit or debit card numbers, CVVs, or bank PINs on our servers.
      </p>

      <h2>4. Client Rights & Contact</h2>
      <p>
        You may request access to, correction of, or deletion of your client profile at any time by contacting our client advisory team at <a href="mailto:privacy@velour.pk" style={{ color: "var(--ink)", textDecoration: "underline" }}>privacy@velour.pk</a> or via WhatsApp concierge at <a href="https://wa.me/923008259142" style={{ color: "var(--ink)", textDecoration: "underline" }}>+92 300 8259142</a>.
      </p>
    </div>
  );
}
