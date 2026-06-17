"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV = [
  { href: "/", label: "Home", icon: "◎" },
  { href: "/feed", label: "Signal Feed", icon: "📡" },
  { href: "/canvas", label: "Canvas", icon: "⬡" },
  { href: "/reports", label: "Reports", icon: "▤" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 h-full bg-white border-r border-gray-100 flex flex-col sticky top-0">
      <div className="px-5 py-6 border-b border-gray-100">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Trend</div>
        <div className="text-xl font-bold text-gray-900 tracking-tight">Radar</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 leading-relaxed">
          Signal intelligence for brand consulting
        </div>
      </div>
    </aside>
  );
}
