"use client";

import { useState, useEffect } from "react";

interface CodVerificationModalProps {
  isOpen: boolean;
  phone: string;
  orderNumber: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function CodVerificationModal({
  isOpen,
  phone,
  orderNumber,
  onVerified,
  onCancel,
}: CodVerificationModalProps) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCode(["", "", "", ""]);
      setTimer(45);
      setError(null);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val.slice(-1);
    setCode(newCode);
    setError(null);

    // Auto-advance focus to next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (enteredCode?: string) => {
    const finalCode = enteredCode || code.join("");
    if (finalCode.length < 4) {
      setError("Please enter the complete 4-digit confirmation code.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 600);
  };

  const handleSimulateWhatsApp = () => {
    // Fill in simulated code
    setCode(["8", "4", "9", "2"]);
    handleVerify("8492");
  };

  return (
    <div
      className="cod-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 10, 10, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cod-modal-title"
    >
      <div
        className="cod-modal-box"
        style={{
          background: "#fff",
          maxWidth: "460px",
          width: "100%",
          borderRadius: "8px",
          padding: "36px 28px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative",
          animation: "modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "var(--muted)",
          }}
          aria-label="Close verification modal"
        >
          ×
        </button>

        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#faf4ea",
            color: "var(--color-primary, #b76e79)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "24px",
          }}
        >
          📱
        </div>

        <p className="section-eyebrow" style={{ color: "var(--color-primary)", marginBottom: "4px" }}>
          COD Order Verification
        </p>
        <h2 id="cod-modal-title" style={{ fontSize: "1.45rem", marginBottom: "8px" }}>
          Confirm Phone Number
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "20px" }}>
          To confirm dispatch of order <strong>{orderNumber}</strong> and prevent courier return, we sent a 4-digit code to:
          <br />
          <strong style={{ color: "var(--color-foreground)", fontSize: "0.95rem" }}>{phone}</strong>
        </p>

        {/* 4-Digit OTP Inputs */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: "48px",
                height: "56px",
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                border: error ? "1.5px solid #d9534f" : "1.5px solid var(--line, #ddd)",
                borderRadius: "6px",
                background: "#faf9f8",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-primary)")}
              onBlur={(e) => (e.target.style.borderColor = error ? "#d9534f" : "var(--line, #ddd)")}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: "#d9534f", fontSize: "0.82rem", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <button
          onClick={() => handleVerify()}
          disabled={isVerifying}
          className="btn btn-wide"
          style={{
            marginBottom: "12px",
            padding: "14px",
            fontSize: "0.95rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {isVerifying ? "Verifying Phone…" : "Confirm COD Order"}
        </button>

        {/* 1-Click WhatsApp Simulation */}
        <button
          type="button"
          onClick={handleSimulateWhatsApp}
          style={{
            width: "100%",
            padding: "10px 14px",
            background: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span>💬</span> Verify via 1-Click WhatsApp (Fastest)
        </button>

        <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
          {timer > 0 ? (
            <span>Resend code in <strong>{timer}s</strong></span>
          ) : (
            <button
              onClick={() => {
                setTimer(45);
                setError(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-primary)",
                textDecoration: "underline",
                cursor: "pointer",
                padding: 0,
                fontSize: "0.82rem",
              }}
            >
              Resend SMS Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
