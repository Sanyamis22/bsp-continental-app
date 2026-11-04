"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiArrowRight, FiPhone, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { errorMessage } from "@/types/api";
import { IconInput as AuthField } from "@/components/ui/icon-input";
import { AuthShell, AuthSpinner } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { useForgetFinal, useForgetInit } from "@/hooks/queries";

function ForgetPasswordForm() {
  const router = useRouter();
  const forgetInit = useForgetInit();
  const forgetFinal = useForgetFinal();
  const [step, setStep] = useState("phone"); // 'phone' -> 'otp' -> 'password'

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const canResend = resendTimer <= 0;
  const loading = forgetInit.isPending || forgetFinal.isPending;

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
    await forgetInit.mutateAsync(phone);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await sendResetOtp();
      setResendTimer(30);
      setStep("otp");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtp("");
    try {
      await sendResetOtp();
      setResendTimer(30);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep("password");
  };

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await forgetFinal.mutateAsync({ phone, otp, password });
      router.push("/login");
    } catch (err) {
      setError(errorMessage(err));
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
