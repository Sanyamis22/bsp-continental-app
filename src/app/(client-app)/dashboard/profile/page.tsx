"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiPhone, FiCreditCard, FiShield, FiCheckCircle } from "react-icons/fi";
import { errorMessage } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconInput } from "@/components/ui/icon-input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    phone: "",
    panCard: "",
    identificationNo: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (active && res.ok && data.user) {
          setFormData({
            phone: data.user.phone || "",
            panCard: data.user.panCard || "",
            identificationNo: data.user.identificationNo || "",
          });
        }
      } catch {
        if (active) setError("Could not load your profile. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [status]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update operation failed.");
      
      setMessage("Parameters synchronized inside database storage ledger!");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4 px-4 py-10">
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md gap-0 py-8 shadow-lg">
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border bg-muted">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" referrerPolicy="no-referrer" className="size-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-primary uppercase">{session?.user?.name?.charAt(0) || "U"}</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">{session?.user?.name || "Client Access"}</h1>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground lowercase">{session?.user?.email}</p>
            </div>
          </div>

          {message && (
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700">
              {message}
            </div>
          )}
          {error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">Registered Phone</Label>
              <IconInput
                id="profile-phone"
                type="tel"
                placeholder="Enter Mobile Contact"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={FiPhone}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-pan">PAN Verification Identity</Label>
              <IconInput
                id="profile-pan"
                type="text"
                maxLength={10}
                placeholder="ABCDE1234F"
                value={formData.panCard}
                onChange={(e) => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
                className="uppercase"
                icon={FiCreditCard}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-aadhaar">Aadhaar Card Reference</Label>
              <IconInput
                id="profile-aadhaar"
                type="text"
                maxLength={12}
                placeholder="12-Digit Identification Number"
                value={formData.identificationNo}
                onChange={(e) => setFormData({ ...formData, identificationNo: e.target.value.replace(/\s/g, "") })}
                icon={FiShield}
              />
            </div>

            <Button type="submit" size="lg" disabled={updating} className="mt-2 w-full uppercase tracking-widest">
              <FiCheckCircle />
              {updating ? "Saving..." : "Save Profile Data"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
