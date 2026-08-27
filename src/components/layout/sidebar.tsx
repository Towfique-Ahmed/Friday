"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/board", label: "Board", icon: "☰" },
  { href: "/calendar", label: "Calendar", icon: "▤" },
  { href: "/campaigns", label: "Campaigns", icon: "◎" },
  { href: "/team", label: "Team", icon: "◈" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 flex-none flex-col border-r border-ink-200 bg-white px-3 py-5 sm:flex">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          F
        </span>
        <span className="text-base font-semibold text-ink-900">Friday</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-ink-100 hover:text-ink-800",
              )}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
