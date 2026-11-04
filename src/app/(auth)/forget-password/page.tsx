"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiLock, FiArrowRight, FiPhone, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { apiError, errorMessage } from "@/types/api";
import { IconInput as AuthField } from "@/components/ui/icon-input";
import { AuthShell, AuthSpinner } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

function ForgetPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState("phone"); // 'phone' -> 'otp' -> 'password'
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const canResend = resendTimer <= 0;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  const sendResetOtp = async () => {
    const res = await fetch("/api/auth/forget-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(apiError(data, "Reset processing issue!"));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendResetOtp();
      setResendTimer(30);
      setStep("otp");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    setOtp("");
    try {
      await sendResetOtp();
      setResendTimer(30);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Proceed to password reset step once OTP format is entered
      setStep("password");
    } catch (err) {
      setError("Invalid Code.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forget-final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(apiError(data, "Update database crash!"));
      
      router.push("/login");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const stepBadge =
    step === "phone" ? "Step 1: Account Recovery" : step === "otp" ? "Step 2: WhatsApp Verification" : "Step 3: New Password Setup";

  return (
    <AuthShell
      badge={stepBadge}
      title={<>Reset <span className="text-primary">Password</span></>}
      subtitle="BSP Continental Security Portal"
      error={error}
      closeHref="/login"
    >
      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <AuthField type="text" required aria-label="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile Number (e.g. 919752...)" icon={FiPhone} />
          <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-widest">
            {loading ? "Sending OTP..." : "Send WhatsApp OTP"}
            {!loading && <FiArrowRight />}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <p className="text-center text-xs font-semibold text-muted-foreground">
            Enter validation code sent to <span className="font-black text-primary">{phone}</span>
          </p>
          <AuthField
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            aria-label="6-digit code"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-Digit Code"
            className="pr-3 text-center text-base font-black tracking-widest"
          />
          <Button type="submit" size="lg" className="w-full uppercase tracking-widest">
            Confirm Token
          </Button>
          <div className="text-center">
            {canResend ? (
              <Button type="button" variant="link" size="sm" onClick={handleResendOtp} disabled={loading} className="uppercase tracking-wider">
                <FiRefreshCw /> Resend WhatsApp OTP
              </Button>
            ) : (
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Available in: <span className="font-black text-foreground">{resendTimer}s</span>
              </p>
            )}
          </div>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleFinalReset} className="space-y-4">
          <AuthField type="password" required aria-label="New password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create New Password" icon={FiLock} />
          <AuthField type="password" required aria-label="Confirm new password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" icon={FiLock} />
          <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-widest">
            <FiCheckCircle />
            {loading ? "Updating Password..." : "Reset Password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

export default function ForgetPasswordPage() {
  return (
    <Suspense fallback={<AuthSpinner />}>
      <ForgetPasswordForm />
    </Suspense>
  );
}
