"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { FiLayers, FiLock, FiMail, FiPhone, FiSend, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface InquiryValues {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  nameLabel?: string;
  serviceName?: string;
  messageLabel: string;
  messagePlaceholder: string;
  values: InquiryValues;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  statusMessage: string;
  submitLabel: ReactNode;
  loadingLabel: string;
}

const MAX_MESSAGE = 100;

/** Inquiry + pay form shared by every public service page (the price shown comes from the server). */
export default function InquiryDialog({
  open, onOpenChange, title, nameLabel = "Full Name", serviceName, messageLabel, messagePlaceholder,
  values, onChange, onSubmit, loading, statusMessage, submitLabel, loadingLabel,
}: InquiryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <p className="text-xs font-bold tracking-wider text-primary uppercase">Consultation inquiry</p>
          <DialogTitle className="uppercase">{title}</DialogTitle>
          <DialogDescription>We save your details first, then open the secure payment window.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label={<span className="flex items-center gap-1.5"><FiUser className="text-primary" /> {nameLabel} *</span>}>
            <Input type="text" name="name" required placeholder="e.g. Ramesh Chandra" value={values.name} onChange={onChange} />
          </FormField>

          <FormField label={<span className="flex items-center gap-1.5"><FiPhone className="text-primary" /> Contact Phone *</span>}>
            <Input type="tel" name="phone" required placeholder="+91 95750 00000" value={values.phone} onChange={onChange} className="font-mono" />
          </FormField>

          <FormField label={<span className="flex items-center gap-1.5"><FiMail className="text-primary" /> Gmail Address *</span>}>
            <Input type="email" name="email" required placeholder="client@gmail.com" value={values.email} onChange={onChange} />
          </FormField>

          {serviceName && (
            <FormField label={<span className="flex items-center gap-1.5"><FiLayers className="text-primary" /> Selected Service</span>}>
              <Input type="text" disabled value={serviceName} readOnly />
            </FormField>
          )}

          <FormField
            label={
              <span className="flex items-center justify-between gap-2">
                <span>{messageLabel} (max {MAX_MESSAGE} characters) *</span>
                <span className={`font-mono text-[11px] ${values.message.length === MAX_MESSAGE ? "text-rose-600" : "text-muted-foreground"}`}>
                  {values.message.length}/{MAX_MESSAGE}
                </span>
              </span>
            }
          >
            <Textarea name="message" required rows={2} maxLength={MAX_MESSAGE} placeholder={messagePlaceholder} value={values.message} onChange={onChange} className="min-h-16 resize-none" />
          </FormField>

          {statusMessage && (
            <p role="status" className="rounded-lg bg-amber-50 p-2 text-center font-mono text-xs text-amber-800">
              {statusMessage}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="w-full uppercase tracking-wider">
            <FiSend />
            {loading ? loadingLabel : submitLabel}
          </Button>

          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <FiLock /> Secure 256-bit encrypted Razorpay Checkout
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
