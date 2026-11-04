"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiBell, FiLogOut, FiMenu, FiSearch, FiShield } from "react-icons/fi";
import { ADMIN_NAV } from "@/components/super-admin/nav";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { SERVICE_TYPES } from "@/types/request";
import { cn } from "@/lib/utils";
import { useAdminLogout } from "@/hooks/queries";

/** Fixed header of the super admin panel: logo, request search, alerts, logout. Login page has none of this. */
export default function SuperAdminTopBar() {
  const router = useRouter();
  const adminLogout = useAdminLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [service, setService] = useState("ALL");

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (service !== "ALL") params.set("service", service);
    setMenuOpen(false);
    router.push(`/admin/dashboard/requests${params.size ? `?${params}` : ""}`);
  };

  const logout = async () => {
    try {
      await adminLogout.mutateAsync();
    } finally {
      // Full navigation so every cached admin view is dropped with the cookie.
      window.location.replace("/admin/login");
    }
  };

  const searchForm = (
    <form onSubmit={search} className="flex w-full items-center gap-2">
      <NativeSelect aria-label="Service" value={service} onChange={(e) => setService(e.target.value)} className="w-40 shrink-0">
        <option value="ALL">All services</option>
        {SERVICE_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </NativeSelect>
      <div className="relative min-w-0 flex-1">
        <FiSearch aria-hidden className="pointer-events-none absolute top-3 left-3 text-sm text-muted-foreground" />
        <Input type="search" aria-label="Search requests" placeholder="Search applicant, phone, email or ID..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>
      <Button type="submit" size="icon" aria-label="Search" className="shrink-0">
        <FiSearch />
      </Button>
    </form>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-24 items-center justify-between gap-4 border-b bg-white/95 px-4 backdrop-blur-md sm:h-32 sm:px-6 lg:px-10">
        <Link href="/admin/dashboard" className="flex shrink-0 items-center transition-transform active:scale-95">
          <div className="relative h-20 w-64 sm:h-28 sm:w-104">
            <Image
              src="/images/Bsp Ccontinental financial logo PNG (1).png"
              alt="BSP Continental"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="origin-left scale-110 object-contain object-left sm:scale-150"
            />
          </div>
        </Link>

        <div className="mx-4 hidden max-w-xl flex-1 md:flex">{searchForm}</div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/admin/dashboard/notifications" aria-label="Admin notifications" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-11")}>
            <FiBell size={18} />
          </Link>
          <Badge variant="success" className="hidden h-11 gap-2 px-4 uppercase sm:inline-flex">
            <FiShield size={14} /> Admin
          </Badge>
          <Button type="button" variant="outline" onClick={logout} className="hidden h-11 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 md:inline-flex">
            <FiLogOut /> Logout
          </Button>
          <Button type="button" variant="outline" size="icon" aria-label="Open menu" onClick={() => setMenuOpen(true)} className="size-11 md:hidden">
            <FiMenu size={20} />
          </Button>
        </div>
      </header>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="top-0 right-0 left-auto h-full max-h-none w-[88%] max-w-xs translate-x-0 translate-y-0 content-start overflow-y-auto rounded-none rounded-l-2xl data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full data-[ending-style]:scale-100 data-[starting-style]:scale-100 md:hidden">
          <DialogTitle>Admin menu</DialogTitle>
          <DialogDescription className="sr-only">Navigate the super admin panel</DialogDescription>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
              <FiShield size={16} />
            </div>
            <div>
              <p className="text-xs font-black uppercase">Super admin</p>
              <p className="font-mono text-[11px] text-emerald-400">Connected</p>
            </div>
          </div>

          {searchForm}

          <nav aria-label="Admin" className="grid gap-1.5">
            {ADMIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn(buttonVariants({ variant: "ghost" }), "justify-start gap-3")}>
                <item.icon className="size-4 text-primary" /> {item.title}
              </Link>
            ))}
          </nav>

          <Button type="button" variant="outline" onClick={logout} className="w-full border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700">
            <FiLogOut /> Logout admin
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
