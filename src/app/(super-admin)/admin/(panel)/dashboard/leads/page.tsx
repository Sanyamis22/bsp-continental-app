"use client";

import React, { useState } from "react";
import { 
  FiRefreshCw, 
  FiPhone, 
  FiMapPin, 
  FiCalendar,
  FiFileText,
  FiInbox,
  FiUsers,
  FiDollarSign,
  FiSearch,
  FiMessageSquare
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLeads } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import type { InquiryDTO, ContactDTO } from "@/types/lead";

type Lead = Partial<InquiryDTO> &
  Partial<ContactDTO> & {
    _id: string;
    createdAt: string;
    sourceType: string;
    city?: string;
    preferredContact?: string;
  };

export default function AdminDashboardLeads() {
  const { data, isLoading: loading, isFetching, refetch } = useAdminLeads();
  const inquiries = data?.inquiries ?? [];
  const contacts = data?.contacts ?? [];
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeads = () => refetch();

  // Combined and sorted by latest
  const combinedLeads: Lead[] = [
    ...inquiries.map((item) => ({ ...item, sourceType: "Inquiry" })),
    ...contacts.map((item) => ({ ...item, sourceType: "Contact Desk" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter based on active tab
  const tabFiltered: Lead[] = 
    activeTab === "inquiries" 
      ? inquiries.map((i) => ({ ...i, sourceType: "Inquiry" }))
      : activeTab === "contacts" 
      ? contacts.map((c) => ({ ...c, sourceType: "Contact Desk" }))
      : combinedLeads;

  // Filter based on search query
  const displayedLeads = tabFiltered.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q))
    );
  });

  // Analytics Calculation
  const totalRevenue = inquiries
    .filter((i) => i.paymentStatus === "Completed")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const tabs = [
    { id: "all", label: "All Records", count: combinedLeads.length },
    { id: "inquiries", label: "Inquiries", count: inquiries.length },
    { id: "contacts", label: "Contact Desk", count: contacts.length },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-wider text-primary uppercase">Super admin panel</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Leads Desk</h1>
        </div>
        <Button type="button" onClick={fetchLeads} disabled={loading || isFetching} className="self-start sm:self-auto">
          <FiRefreshCw className={loading || isFetching ? "animate-spin" : ""} />
          {loading || isFetching ? "Syncing..." : "Sync Database"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Submissions" value={combinedLeads.length} icon={<FiUsers />} />
        <StatCard label="Service Inquiries" value={inquiries.length} icon={<FiFileText />} tone="amber" />
        <StatCard label="Contact Messages" value={contacts.length} icon={<FiMessageSquare />} />
        <StatCard label="Verified Inflows" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={<FiDollarSign />} />
      </div>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <FiSearch aria-hidden className="pointer-events-none absolute top-3 left-3 text-sm text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search leads"
            placeholder="Search name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <Card className="gap-3 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ) : displayedLeads.length === 0 ? (
        <Card className="items-center gap-2 p-16 text-center">
          <FiInbox className="text-5xl text-muted-foreground/50" />
          <p className="text-sm font-bold">No submissions found</p>
          <p className="text-xs text-muted-foreground">No records match this view.</p>
        </Card>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Channel</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Amount / Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="pr-6">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLeads.map((item) => {
                const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, "") : "";
                const whatsappNumber = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                const isInquiry = item.sourceType === "Inquiry";

                return (
                  <TableRow key={item._id}>
                    <TableCell className="pl-6 align-top">
                      <Badge variant={isInquiry ? "warning" : "success"}>{item.sourceType}</Badge>
                    </TableCell>

                    <TableCell className="space-y-1 align-top">
                      <p className="text-sm leading-snug font-bold">{item.name}</p>
                      <div className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
                        <p className="font-bold text-foreground">{item.phone}</p>
                        {item.email && <p className="max-w-45 truncate">{item.email}</p>}
                        {item.city && (
                          <p className="flex items-center gap-1 text-primary">
                            <FiMapPin size={12} />
                            {item.city}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="align-top">
                      <Badge variant="secondary">{item.service}</Badge>
                    </TableCell>

                    <TableCell className="max-w-xs align-top">
                      <p className="line-clamp-3 text-muted-foreground">{item.message || "—"}</p>
                    </TableCell>

                    <TableCell className="align-top">
                      {isInquiry ? (
                        <div className="space-y-1">
                          <p className="font-mono text-xs font-black">₹{(item.amount || 0).toLocaleString("en-IN")}</p>
                          <Badge variant={item.paymentStatus === "Completed" ? "success" : "warning"}>
                            {item.paymentStatus || "Pending"}
                          </Badge>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-muted-foreground uppercase">
                          Pref: {item.preferredContact || "Call"}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="align-top">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${item.phone}`}
                          aria-label={`Call ${item.name}`}
                          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-9 text-primary")}
                        >
                          <FiPhone size={15} />
                        </a>
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(item.name || "Client")},%20we%20received%20your%20request%20at%20BSP%20Continental.`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`WhatsApp ${item.name}`}
                          className={cn(buttonVariants({ variant: "outline", size: "icon" }), "size-9 text-[#25D366]")}
                        >
                          <FaWhatsapp size={15} />
                        </a>
                      </div>
                    </TableCell>

                    <TableCell className="pr-6 align-top font-mono text-[11px] whitespace-nowrap text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
