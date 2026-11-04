"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePrices, useUpdatePrice } from "@/hooks/queries";
import { errorMessage } from "@/types/api";
import type { ServicePriceDTO } from "@/types/pricing";

type RowState = { value: string; saving: boolean; message?: { ok: boolean; text: string } };

export default function PricingManager() {
  const { data, isLoading, error: loadQueryError, refetch, isFetching } = usePrices();
  const updatePrice = useUpdatePrice();
  const [prices, setPrices] = useState<ServicePriceDTO[] | null>(null);
  const [rows, setRows] = useState<Record<string, RowState>>({});

  useEffect(() => {
    if (!data) return;
    setPrices(data);
    setRows((prev) => {
      const next: Record<string, RowState> = {};
      for (const p of data) {
        next[p.slug] = prev[p.slug]?.message
          ? { ...prev[p.slug], value: prev[p.slug].value === String(p.amountInr) ? String(p.amountInr) : prev[p.slug].value }
          : { value: String(p.amountInr), saving: false };
      }
      return next;
    });
  }, [data]);

  const loadError = loadQueryError instanceof Error ? loadQueryError.message : "";

  const patchRow = (slug: string, patch: Partial<RowState>) =>
    setRows((prev) => ({ ...prev, [slug]: { ...prev[slug], ...patch } }));

  const save = async (slug: string) => {
    const amountInr = Number(rows[slug].value);
    patchRow(slug, { saving: true, message: undefined });
    try {
      const json = await updatePrice.mutateAsync({ slug, amountInr });
      const saved = json.data;
      setPrices((prev) => prev?.map((p) => (p.slug === slug ? saved : p)) ?? prev);
      patchRow(slug, { saving: false, value: String(saved.amountInr), message: { ok: true, text: "Saved. Live now." } });
    } catch (err) {
      patchRow(slug, { saving: false, message: { ok: false, text: errorMessage(err) } });
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">Service Pricing</h1>
        <p className="text-sm text-muted-foreground">
          These prices are shown on the landing page and service pages, and are the exact amount charged in Razorpay.
          Changes apply to the next payment.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1.5">
            <CardTitle>Prices (INR)</CardTitle>
            <CardDescription>Whole rupees only. Razorpay is charged this amount.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <FiRefreshCw /> Reload
          </Button>
        </CardHeader>
        <CardContent>
          {loadError && (
            <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
              <FiAlertCircle /> {loadError}
            </div>
          )}

          {isLoading && !prices ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            prices && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="w-44">Price (₹)</TableHead>
                    <TableHead>Last changed</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prices.map((p) => {
                    const row = rows[p.slug];
                    const unchanged = row?.value === String(p.amountInr);
                    return (
                      <TableRow key={p.slug}>
                        <TableCell className="font-semibold">{p.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            aria-label={`${p.name} price in rupees`}
                            value={row?.value ?? ""}
                            onChange={(e) => patchRow(p.slug, { value: e.target.value, message: undefined })}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {p.updatedAt ? `${new Date(p.updatedAt).toLocaleString("en-IN")} by ${p.updatedBy ?? "admin"}` : "Default price"}
                          {row?.message && (
                            <span className={`mt-1 flex items-center gap-1 font-semibold ${row.message.ok ? "text-emerald-700" : "text-rose-700"}`}>
                              {row.message.ok ? <FiCheckCircle /> : <FiAlertCircle />} {row.message.text}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" disabled={unchanged || row?.saving} onClick={() => save(p.slug)}>
                            {row?.saving ? "Saving..." : "Save"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
