"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Image,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Coupons", href: "/admin/coupons", icon: Percent },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-chocolate-950 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-chocolate-800">
        <p className="font-playfair text-2xl font-bold text-champagne-100 tracking-widest">ORBY</p>
        <p className="text-[9px] tracking-[0.4em] text-gold-400 uppercase">ADMIN PANEL</p>
        <p className="text-[8px] tracking-[0.2em] text-chocolate-400 mt-0.5">UNDER NERA GROUPS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gold-gradient text-chocolate-950"
                  : "text-champagne-300 hover:bg-chocolate-800 hover:text-champagne-100"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-chocolate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm text-champagne-400 hover:text-champagne-100 transition-colors"
        >
          <Package size={17} />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 w-full text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
