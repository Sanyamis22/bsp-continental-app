"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { FiBell, FiLogOut } from "react-icons/fi";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClientTopBar() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const name = session?.user?.name || "User";
  const image = session?.user?.image || "";

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center overflow-visible active:scale-95 transition-transform">
          <Image
            src="/images/Bsp Ccontinental financial logo PNG (1).png"
            alt="BSP Continental"
            width={750}
            height={220}
            priority
            className="h-14 w-auto object-contain origin-left scale-125"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full bg-muted text-muted-foreground")}
          >
            <FiBell size={20} />
          </Link>

          <Link
            href="/dashboard/profile"
            aria-label="Profile"
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200/70 bg-slate-50"
          >
            {image ? (
              <Image src={image} alt={name} width={44} height={44} referrerPolicy="no-referrer" className="h-full w-full object-cover" unoptimized />
            ) : (
              <span className="text-base font-black uppercase text-[#217044]">{name.trim().charAt(0)}</span>
            )}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              queryClient.clear();
              void signOut({ callbackUrl: "/login" });
            }}
            aria-label="Log out"
            className="rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
          >
            <FiLogOut size={17} />
          </Button>
        </div>
      </div>
    </header>
  );
}
