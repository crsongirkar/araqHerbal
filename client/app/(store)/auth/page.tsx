"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus the first OTP field when step changes to 'otp'
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      return setError("Please enter a valid email address.");
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep("otp");
        setMessage("Verification code sent to your email.");
        setTimer(30); // 30 seconds cooldown
      } else {
        setError(data.error || "Failed to send code. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      return setError("Please enter all 6 digits of the verification code.");
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otpCode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Logged in successfully! Redirecting...");
        // Reload page or redirect to shop/home
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || "Invalid or expired code. Please try again.");
      }
    } catch {
      setError("Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take the last digit if user types multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Trigger auto-submit when full
    if (newOtp.join("").length === 6) {
      // Small timeout to allow input state to register
      setTimeout(() => {
        handleAutoSubmit(newOtp.join(""));
      }, 100);
    }
  };

  const handleAutoSubmit = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1200);
      } else {
        setError(data.error || "Invalid or expired code. Please try again.");
      }
    } catch {
      setError("Verification failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous field and delete content
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    // Focus last input field
    otpInputsRef.current[5]?.focus();
    
    // Auto submit
    handleAutoSubmit(pasteData);
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setTimer(30);
        setMessage("A new 6-digit code has been sent.");
      } else {
        setError("Failed to resend code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-[#fbfbfa] via-[#e8f5e9]/10 to-[#fbfbfa] flex items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-md bg-white border border-[#e0e7e2] rounded-[32px] p-8 shadow-sm transition-all duration-300">
        
        {/* Step 1: Email Input */}
        {step === "email" && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-[#e8f5e9] text-[#2a7a4b] items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#1e2521]">Welcome to ARAQ</h1>
              <p className="mt-2 text-xs text-[#5c6b62]">
                Enter your email address to register or sign in. We will send you a 6-digit verification code.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9cad9e]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full rounded-2xl border border-[#e0e7e2] pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#2a7a4b] focus:ring-4 focus:ring-[#2a7a4b]/5 transition-all text-[#1e2521]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#2a7a4b] text-white py-3.5 font-bold tracking-wider uppercase text-xs hover:bg-[#1f5e39] active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all shadow-sm shadow-[#2a7a4b]/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Sending Code…
                  </>
                ) : (
                  "Continue with Email"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === "otp" && (
          <div>
            <button
              onClick={() => {
                setStep("email");
                setError("");
                setMessage("");
                setOtp(Array(6).fill(""));
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c6b62] hover:text-[#2a7a4b] mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-[#e8f5e9] text-[#2a7a4b] items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#1e2521]">Enter Code</h1>
              <p className="mt-2 text-xs text-[#5c6b62]">
                We sent a 6-digit code to <strong className="text-[#1e2521] font-semibold">{email}</strong>.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-5 p-4 rounded-2xl bg-[#e8f5e9] border border-[#e0e7e2] text-[#2a7a4b] text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2a7a4b] shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-[#1e2521] tracking-widest uppercase block text-center mb-4">
                  Verification Passcode
                </label>
                <div className="flex justify-between gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputsRef.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-12 h-14 rounded-2xl border border-[#e0e7e2] text-center text-xl font-bold font-mono focus:outline-none focus:border-[#2a7a4b] focus:ring-4 focus:ring-[#2a7a4b]/5 transition-all text-[#1e2521] bg-stone-50/50"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#2a7a4b] text-white py-3.5 font-bold tracking-wider uppercase text-xs hover:bg-[#1f5e39] active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all shadow-sm shadow-[#2a7a4b]/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify & Log In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs">
              <span className="text-[#5c6b62]">Didn&apos;t receive the code? </span>
              {timer > 0 ? (
                <span className="text-[#2a7a4b] font-bold">Resend in {timer}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[#2a7a4b] font-bold hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
