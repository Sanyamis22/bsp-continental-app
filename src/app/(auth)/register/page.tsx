"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCheckCircle, FiRefreshCw, FiShield, FiUser, FiPhone, FiLock } from "react-icons/fi";
import { errorMessage } from "@/types/api";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell, AuthSpinner } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState("details"); 
  
  const [name, setName] = useState("");
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

  const executeAuthAction = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "A network error occurred. Please try again.");
    return data;
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await executeAuthAction({ action: "INIT", name, phone });
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
      await executeAuthAction({ action: "INIT", name, phone });
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
      await executeAuthAction({ action: "VERIFY", phone, otp });
      setStep("password");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-verify.");
      return;
    }

    setLoading(true);
    try {
      await executeAuthAction({ action: "FINAL", name, phone, otp, password });
      router.push("/login"); 
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const stepBadge =
    step === "details" ? "Step 1: Account Details" : step === "otp" ? "Step 2: WhatsApp Verification" : "Step 3: Setup Password";

  return (
    <AuthShell
      badge={stepBadge}
      title={<>Sign <span className="text-primary">Up</span></>}
      subtitle="BSP Continental WhatsApp Auth"
      error={error}
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-extrabold tracking-wider text-primary uppercase hover:underline">
            Sign In Here
          </Link>
        </>
      }
    >
      {step === "details" && (
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <AuthField type="text" required aria-label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" icon={FiUser} />
          <AuthField type="text" required aria-label="WhatsApp number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number (e.g. 919752...)" icon={FiPhone} />
          <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-widest">
            {loading ? "Sending WhatsApp OTP..." : "Send WhatsApp OTP"}
            {!loading && <FiArrowRight />}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <p className="text-center text-xs font-semibold text-muted-foreground">
            WhatsApp OTP sent to <span className="font-black text-primary">{phone}</span>
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
          <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-widest">
            {loading ? "Verifying Code..." : "Confirm Code"}
            {!loading && <FiCheckCircle />}
          </Button>

          <div className="text-center">
            {canResend ? (
              <Button type="button" variant="link" size="sm" onClick={handleResendOtp} disabled={loading} className="uppercase tracking-wider">
                <FiRefreshCw className={loading ? "animate-spin" : ""} /> Resend WhatsApp OTP
              </Button>
            ) : (
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Resend available in: <span className="font-black text-foreground">{resendTimer}s</span>
              </p>
            )}
          </div>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleFinalRegister} className="space-y-4">
          <AuthField type="password" required aria-label="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" icon={FiLock} />
          <AuthField type="password" required aria-label="Confirm password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" icon={FiShield} />
          <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-widest">
            <FiCheckCircle />
            {loading ? "Creating Account..." : "Finalize Registration"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
