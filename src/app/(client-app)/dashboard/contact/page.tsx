"use client";

import ContactForm from "@/components/shared/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** In-app contact desk — shared form, client-app chrome only (no landing navbar spacing). */
export default function DashboardContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-6 md:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight uppercase">Contact desk</h1>
        <p className="text-sm text-muted-foreground">
          Reach the Bilaspur advisory team for loan readiness, CIBIL, or property compliance.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Send a requirement</CardTitle>
          <CardDescription>We reply on your preferred channel. Do not paste OTPs, PAN, or full Aadhaar here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
