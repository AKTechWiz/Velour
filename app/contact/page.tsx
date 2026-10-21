"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/lib/store";
import { validatePakistanPhone } from "@/lib/logistics";

export default function ContactPage() {
  const { push } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    store: "Karachi (DHA Phase 6)",
    purpose: "Bridal Consultation",
    date: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      push("Please enter your name", "info");
      return;
    }
    const phoneCheck = validatePakistanPhone(form.phone);
    if (!phoneCheck.valid) {
      setPhoneError("Please enter a valid Pakistan phone number (03XX-XXXXXXX)");
      return;
    }
    setPhoneError(null);
    setSubmitted(true);
    push("Appointment booked! Our concierge will WhatsApp you shortly.");
  };

  return (
    <div className="container" style={{ maxWidth: 960, margin: "60px auto 100px", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p className="section-eyebrow" style={{ color: "var(--taupe-deep)", marginBottom: "6px" }}>
          Client Concierge
        </p>
        <h1 style={{ fontSize: "2.8rem", fontFamily: "var(--font-serif, serif)", marginBottom: "12px" }}>
          Contact & Salon Appointments
        </h1>
        <p style={{ color: "var(--muted)", maxWidth: 540, margin: "0 auto", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Reach our dedicated client advisory team for sizing advice, custom bridal appointments, order status, or international dispatch inquiries.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "48px",
          alignItems: "flex-start",
        }}
        className="contact-layout"
      >
        {/* Flagships & Channels */}
        <div>
          <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif, serif)", marginBottom: "20px" }}>
            Our Flagship Salons
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "36px" }}>
            <div style={{ background: "var(--surface-card)", border: "1px solid var(--line)", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <strong style={{ fontSize: "1rem" }}>Karachi Flagship Salon</strong>
                <span style={{ fontSize: "0.75rem", background: "var(--surface)", color: "var(--taupe-deep)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                  Bridal Lounge
                </span>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "var(--muted)" }}>
                Plot 14-C, Main Khayaban-e-Shahbaz, Phase 6, DHA, Karachi
              </p>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
                Hours: Mon – Sat: 11:00 AM – 9:00 PM PKT
              </p>
            </div>

            <div style={{ background: "var(--surface-card)", border: "1px solid var(--line)", borderRadius: "8px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <strong style={{ fontSize: "1rem" }}>Lahore Couture Atelier</strong>
                <span style={{ fontSize: "0.75rem", background: "var(--surface)", color: "var(--taupe-deep)", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                  Trousseau Suite
                </span>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: "0.85rem", color: "var(--muted)" }}>
                12-M, M.M. Alam Road, Gulberg III, Lahore
              </p>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
                Hours: Mon – Sun: 11:30 AM – 10:00 PM PKT
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--font-serif, serif)", marginBottom: "16px" }}>
            Direct Concierge Channels
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.3rem" }}>💬</span>
              <div>
                <strong>WhatsApp Concierge:</strong>{" "}
                <a
                  href="https://wa.me/923008259142"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--taupe-deep)", textDecoration: "underline" }}
                >
                  +92 300 8259142
                </a>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)" }}>Average reply: under 10 minutes</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.3rem" }}>📞</span>
              <div>
                <strong>Client Support Line:</strong>{" "}
                <span style={{ color: "var(--ink)" }}>+92 (21) 3584-9142</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "1.3rem" }}>✉️</span>
              <div>
                <strong>Email:</strong>{" "}
                <a href="mailto:concierge@velour.pk" style={{ color: "var(--taupe-deep)", textDecoration: "underline" }}>
                  concierge@velour.pk
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Appointment Booking Form */}
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--line)",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
          }}
        >
          <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif, serif)", marginBottom: "8px" }}>
            Book a Private Appointment
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "24px" }}>
            Reserve dedicated time with a senior stylist for bridal, bespoke stitching, or trousseau curation.
          </p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--success)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  margin: "0 auto 16px",
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>Appointment Reserved</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.5 }}>
                Thank you, <strong>{form.name}</strong>. Our bridal salon manager will send a confirmation and directions to <strong>{form.phone}</strong> on WhatsApp.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-ghost"
                style={{ marginTop: "16px", fontSize: "0.85rem" }}
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                  Full Name <span style={{ color: "var(--rose)" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zainab Tariq"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                  Pakistan Mobile Phone <span style={{ color: "var(--rose)" }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    setPhoneError(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: phoneError ? "1.5px solid var(--rose)" : "1px solid var(--line)",
                    background: "var(--surface)",
                    color: "var(--ink)",
                  }}
                />
                {phoneError && <span style={{ color: "var(--rose)", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{phoneError}</span>}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                  Preferred Salon Location
                </label>
                <select
                  value={form.store}
                  onChange={(e) => setForm({ ...form, store: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                >
                  <option value="Karachi (DHA Phase 6)">Karachi (DHA Phase 6)</option>
                  <option value="Lahore (M.M. Alam Road)">Lahore (M.M. Alam Road)</option>
                  <option value="Virtual Video Consultation">Virtual Video Consultation</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                  Consultation Purpose
                </label>
                <select
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                >
                  <option value="Bridal Consultation">Bridal & Trousseau Consultation</option>
                  <option value="Custom Tailoring & Sizing">Custom Tailoring & Measurements</option>
                  <option value="Festive Pret Styling">Festive Pret Styling</option>
                  <option value="Men's Bespoke Sherwani & Kurta">Men&apos;s Bespoke Sherwani & Kurta</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.82rem", fontWeight: 600 }}>
                  Additional Notes / Occasion Date
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wedding date in December, looking for gold zardozi on deep emerald."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--line)", fontSize: "0.85rem", background: "var(--surface)", color: "var(--ink)" }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: "12px", marginTop: "4px" }}>
                Confirm Salon Reservation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
