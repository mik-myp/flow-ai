"use client";

import Link from "next/link";
import { Waypoints } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import menus from "../_lib/menus";
import SiteAvatar from "./SiteAvatar";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <Link href="/workflows" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Waypoints size={18} />
          </span>
          <span className="text-sm font-semibold text-slate-900">Flow AI</span>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-2">
          {menus.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(`${item.url}/`);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={clsx(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <span>{item.icon && <item.icon size={16} />}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <SiteAvatar />
      </div>
    </header>
  );
}
