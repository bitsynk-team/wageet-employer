"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { usePortal } from "@/components/portal/store";

const links = [
  { href: "/settings", label: "Profile & security", icon: "/icons/employees.svg" },
  { href: "/settings/organisation", label: "Organisation", icon: "/icons/briefcase.svg" },
  { href: "/settings/payroll", label: "Payroll schedule", icon: "/icons/dash/date.svg" },
  { href: "/settings/notifications", label: "Notifications", icon: "/icons/bell.svg" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account settings" className="flex gap-2 overflow-x-auto lg:flex-col">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} className={cn("inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap", active ? "bg-[#e7f3ee] font-medium text-[#153a2b]" : "text-[#526459] hover:bg-[#f8f8f8]")}>
            <img src={link.icon} alt="" className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SettingsFrame({
  description,
  children,
  aside,
}: {
  description: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const portal = usePortal();
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Account settings</h1>
          <p className="mt-1 text-sm text-[#4e6358]">{description}</p>
        </div>
        <span className="inline-flex h-8 items-center gap-2 rounded-full bg-[#f4f5ef] px-3 text-sm text-[#162e25]">
          <img src="/icons/briefcase.svg" alt="" className="size-3.5" />
          {portal.workspaceName}
        </span>
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        <SettingsNav />
        <div className={aside ? "grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_240px]" : ""}>
          <div className="min-w-0">{children}</div>
          {aside}
        </div>
      </div>
    </div>
  );
}
