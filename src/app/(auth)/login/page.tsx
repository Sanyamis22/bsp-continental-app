"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FiPhone, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell, AuthSpinner } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: phone.trim(),
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    if (!agreeTerms) {
      setError("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    try {
      await signIn("google", { callbackUrl: callbackUrl });
    } catch (err) {
      setError("Google Authentication failed!");
    }
  };

  if (status === "loading") return <AuthSpinner />;

  return (
    <AuthShell
      badge="Secure Access Portal"
      title={<>BSP <span className="text-primary">Continental</span></>}
      subtitle="Sign In with Mobile Number"
      error={error}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-extrabold tracking-wider text-primary uppercase hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <AuthField
          type="text"
          required
          aria-label="Mobile number"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile Number (e.g. 919752...)"
          icon={FiPhone}
        />

        <div className="space-y-2">
          <AuthField
            type="password"
            required
            aria-label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            icon={FiLock}
          />
          <div className="text-right">
            <Link href="/forget-password" className="text-xs font-semibold text-muted-foreground transition hover:text-primary">
              Forgot Password?
            </Link>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-snug font-medium text-muted-foreground">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-bold text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-bold text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-widest">
          {loading ? "Authenticating..." : "Sign In"}
          {!loading && <FiArrowRight />}
        </Button>
      </form>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-widest text-muted-foreground uppercase">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button type="button" variant="outline" size="lg" onClick={handleGoogleLogin} className="w-full uppercase tracking-wider">
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
