import { Bell, CheckCircle2, IndianRupee, Inbox, LayoutDashboard, UserCog, Users, XCircle, type LucideIcon } from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

/** Single list used by the desktop sidebar and the mobile menu. */
export const ADMIN_NAV: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Requests", href: "/admin/dashboard/requests", icon: Inbox },
  { title: "Leads", href: "/admin/dashboard/leads", icon: Users },
  { title: "Approved", href: "/admin/dashboard/requests?status=Approved", icon: CheckCircle2 },
  { title: "Rejected", href: "/admin/dashboard/requests?status=Rejected", icon: XCircle },
  { title: "Users", href: "/admin/dashboard/users", icon: UserCog },
  { title: "Notifications", href: "/admin/dashboard/notifications", icon: Bell },
  { title: "Pricing", href: "/admin/dashboard/pricing", icon: IndianRupee },
];
