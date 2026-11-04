"use client";

import { useState } from "react";
import { FiAlertCircle, FiArrowRight, FiCheckCircle, FiLock, FiMail } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("Access granted. Opening the console...");
        // Full navigation so the freshly set cookie is sent with the next request.
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 400);
      } else {
        setErrorMsg(data.message || "Invalid Email or Master Password!");
      }
    } catch {
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
      <Card className="w-full max-w-md gap-0 py-8 shadow-lg">
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <Badge variant="secondary" className="uppercase tracking-widest">
              <FiLock size={12} /> Restricted
            </Badge>
            <h1 className="text-2xl font-black tracking-tight">
              BSP <span className="font-light text-muted-foreground">Admin Console</span>
            </h1>
            <p className="text-xs text-muted-foreground">Secure admin clearance required.</p>
          </div>

          {errorMsg && (
            <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              <FiAlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              <FiCheckCircle size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin Email</Label>
              <div className="relative">
                <Input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@bspcontinental.com"
                  className="pl-10"
                />
                <FiMail aria-hidden className="pointer-events-none absolute top-3.5 left-3.5 text-muted-foreground" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Master Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-10"
                />
                <FiLock aria-hidden className="pointer-events-none absolute top-3.5 left-3.5 text-muted-foreground" size={16} />
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-wider">
              {loading ? "Verifying..." : "Authorize & Login"}
              {!loading && <FiArrowRight />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
