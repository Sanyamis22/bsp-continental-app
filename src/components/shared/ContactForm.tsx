"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/types/api";
import { useContactSubmit } from "@/hooks/queries";

const EMPTY = {
  fullName: "",
  mobileNumber: "",
  serviceRequired: "",
  cityDistrict: "",
  preferredContact: "",
  message: "",
};

/** Public "request a consultation" form. Posts to /api/contact; used on the home page and the contact page. */
export default function ContactForm() {
  const contactSubmit = useContactSubmit();
  const [values, setValues] = useState(EMPTY);
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const loading = contactSubmit.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await contactSubmit.mutateAsync(values);
      setSubmitted(true);
      setValues(EMPTY);
      setAgree(false);
    } catch (err) {
      setError(errorMessage(err, "Network error. Please try again."));
    }
  };

  if (submitted) {
    return (
      <div role="status" className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#052516] text-xl text-[#f3c251]">
          <FiCheckCircle />
        </div>
        <h4 className="text-base font-black tracking-tight uppercase">Consultation request received</h4>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thank you for contacting BSP Continental. Our advisory team will review your requirement and reach out via your preferred channel.
        </p>
        <Button type="button" variant="link" onClick={() => setSubmitted(false)}>
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Full name *">
          <Input type="text" name="fullName" required placeholder="Enter your name" value={values.fullName} onChange={handleChange} />
        </FormField>
        <FormField label="Mobile number *">
          <Input type="tel" name="mobileNumber" required placeholder="Enter 10-digit number" value={values.mobileNumber} onChange={handleChange} />
        </FormField>
      </div>

      <FormField label="Service required *">
        <NativeSelect name="serviceRequired" required value={values.serviceRequired} onChange={handleChange}>
          <option value="" disabled>Select a service</option>
          <option value="Financial Consulting">Financial Consulting</option>
          <option value="CIBIL Score Management">CIBIL Score Management</option>
          <option value="Property Compliance">Property Compliance &amp; Title Search</option>
        </NativeSelect>
      </FormField>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="City / district *">
          <Input type="text" name="cityDistrict" required placeholder="Your location" value={values.cityDistrict} onChange={handleChange} />
        </FormField>
        <FormField label="Preferred contact">
          <NativeSelect name="preferredContact" value={values.preferredContact} onChange={handleChange}>
            <option value="">Call or WhatsApp</option>
            <option value="call">Phone Call</option>
            <option value="whatsapp">WhatsApp</option>
          </NativeSelect>
        </FormField>
      </div>

      <FormField label="Message">
        <Textarea name="message" rows={2} placeholder="Briefly describe your requirement" value={values.message} onChange={handleChange} className="min-h-16 resize-none" />
      </FormField>

      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
        <input type="checkbox" required checked={agree} onChange={(e) => setAgree(e.target.checked)} className="size-3.5 cursor-pointer accent-primary" />
        I agree to be contacted regarding this inquiry.
      </label>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" disabled={loading} className="uppercase tracking-wider">
        {loading ? "Submitting..." : "Submit requirement"}
      </Button>

      <p className="text-[11px] text-muted-foreground">
        Do not submit sensitive identification numbers, banking credentials, or proprietary credit reports through this public form.
      </p>
    </form>
  );
}
