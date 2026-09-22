"use client";

import { useState, useEffect, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/lib/store";
import { insforge } from "@/lib/insforge";

type Mode = "signin" | "signup";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") || "/profile";
  const verifiedFromUrl = searchParams.get("verified") === "true";
  const { push } = useToast();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email verification flow states
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifiedBanner, setVerifiedBanner] = useState(verifiedFromUrl);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        router.replace(returnTo);
      }
    });
  }, [router, returnTo]);

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setErrorMessage("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    setVerifying(true);
    setErrorMessage(null);

    try {
      // 1. Try verifyEmail with otp
      let verifiedUser: any = null;
      try {
        const { data, error } = await insforge.auth.verifyEmail({
          email: email.trim(),
          otp: verificationCode.trim(),
        });
        if (error) throw error;
        verifiedUser = data?.user;
      } catch {
        // Fallback to verifyOtp
        const { data, error } = await insforge.auth.verifyOtp({
          email: email.trim(),
          otp: verificationCode.trim(),
        });
        if (error) throw error;
        verifiedUser = data?.user;
      }

      push("Email verified successfully! Welcome to VELOUR.", "success");
      window.dispatchEvent(new Event("insforge-auth-change"));
      setVerificationPending(false);
      router.push(returnTo);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid or expired verification code";
      setErrorMessage(msg);
      push(msg, "error");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address to resend verification.");
      return;
    }
    setResending(true);
    setErrorMessage(null);

    try {
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/login?verified=true`
        : undefined;

      const { error } = await insforge.auth.resendVerificationEmail({
        email: email.trim(),
        redirectTo,
      });

      if (error) throw error;

      push(`Verification email resent to ${email.trim()}! Please check your inbox and spam folder.`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend verification email";
      setErrorMessage(msg);
      push(msg, "error");
    } finally {
      setResending(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const { data, error } = await insforge.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          const isUnverified =
            error.statusCode === 403 ||
            error.message?.toLowerCase().includes("verif") ||
            error.message?.toLowerCase().includes("confirm");

          if (isUnverified) {
            setVerificationPending(true);
            setErrorMessage("Your email has not been verified yet. Please enter the 6-digit code or click Resend below.");
          } else {
            setErrorMessage(error.message || "Invalid email or password");
            push(error.message || "Failed to sign in", "error");
          }
        } else if (data?.user) {
          push(`Welcome back, ${data.user.profile?.name || data.user.email}!`, "success");
          window.dispatchEvent(new Event("insforge-auth-change"));
          router.push(returnTo);
        }
      } else {
        if (!name.trim()) {
          setLoading(false);
          setErrorMessage("Please enter your full name.");
          return;
        }

        const redirectTo = typeof window !== "undefined"
          ? `${window.location.origin}/login?verified=true`
          : undefined;

        const { data, error } = await insforge.auth.signUp({
          email: email.trim(),
          password,
          name: name.trim(),
          redirectTo,
        });

        if (error) {
          setErrorMessage(error.message || "Account creation failed");
          push(error.message || "Could not create account", "error");
        } else if (data?.requireEmailVerification) {
          // Verification required! Switch to verification code entry
          setVerificationPending(true);
          push(`Verification code sent to ${email.trim()}. Please verify your email.`, "info");
        } else if (data?.user) {
          push("Account created successfully! Welcome to VELOUR.", "success");
          window.dispatchEvent(new Event("insforge-auth-change"));
          router.push(returnTo);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      setErrorMessage(msg);
      push(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        {verifiedBanner && (
          <div
            style={{
              background: "rgba(39, 174, 96, 0.1)",
              border: "1px solid rgba(39, 174, 96, 0.35)",
              color: "#27ae60",
              padding: "12px 16px",
              borderRadius: "6px",
              fontSize: "0.88rem",
              marginBottom: "20px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>✓</span>
            <span>Your email is verified! You may now sign in to your VELOUR account.</span>
          </div>
        )}

        {/* If email verification is pending */}
        {verificationPending ? (
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>✉️</span>
              <h1 style={{ fontSize: "24px" }}>Verify Your Email</h1>
              <p style={{ color: "var(--color-muted, #777)", fontSize: "0.9rem", marginTop: 8 }}>
                We sent a verification link &amp; code to:
              </p>
              <p style={{ fontWeight: 600, color: "var(--ink, #12100e)", marginTop: 4, letterSpacing: "0.02em" }}>
                {email}
              </p>
            </div>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(220, 53, 69, 0.08)",
                  border: "1px solid rgba(220, 53, 69, 0.3)",
                  color: "#c92a2a",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  marginBottom: "16px",
                  textAlign: "left",
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleVerifyCode}>
              <div className="field">
                <label htmlFor="verif-code">Enter 6-Digit Code</label>
                <input
                  id="verif-code"
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 123456"
                  style={{
                    letterSpacing: "0.3em",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-wide"
                style={{ marginTop: 12 }}
                disabled={verifying}
              >
                {verifying ? "Verifying Code…" : "Confirm & Sign In"}
              </button>
            </form>

            <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid var(--line, #eee)", paddingTop: "18px" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--color-muted, #777)", marginBottom: "10px" }}>
                Didn&apos;t receive an email or code?
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: "transparent", border: "1px solid var(--line)", color: "var(--ink)" }}
                  onClick={handleResendEmail}
                  disabled={resending}
                >
                  {resending ? "Resending…" : "Resend Email"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: "transparent", border: "none", color: "var(--muted)", textDecoration: "underline" }}
                  onClick={() => {
                    setVerificationPending(false);
                    setErrorMessage(null);
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signin"}
                className={`auth-tab ${mode === "signin" ? "active" : ""}`}
                onClick={() => {
                  setMode("signin");
                  setErrorMessage(null);
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
              >
                Create Account
              </button>
            </div>

            <h1>{mode === "signin" ? "Welcome back" : "Join VELOUR"}</h1>
            <p style={{ color: "var(--color-muted, #777)", fontSize: "0.9rem", marginBottom: 20 }}>
              {mode === "signin"
                ? "Sign in to access your orders and synced bag."
                : "Create an account for expedited checkout and order tracking."}
            </p>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(220, 53, 69, 0.08)",
                  border: "1px solid rgba(220, 53, 69, 0.3)",
                  color: "#c92a2a",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  marginBottom: "16px",
                  textAlign: "left",
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={submit}>
              {mode === "signup" && (
                <div className="field">
                  <label htmlFor="su-name">Full name</label>
                  <input
                    id="su-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                    placeholder="e.g. Jane Doe"
                  />
                </div>
              )}
              <div className="field">
                <label htmlFor="su-email">Email</label>
                <input
                  id="su-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="field">
                <label htmlFor="su-password">Password</label>
                <input
                  id="su-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <button
                type="submit"
                className="btn btn-wide"
                style={{ marginTop: 12 }}
                disabled={loading}
              >
                {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="auth-switch">
              {mode === "signin" ? "New to VELOUR?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setErrorMessage(null);
                }}
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container auth-page"><div className="auth-card"><h1>Loading…</h1></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
