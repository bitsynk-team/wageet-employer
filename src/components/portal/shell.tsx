"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "cn";
import { Icon } from "@/components/portal/icons";
import { usePortal } from "@/components/portal/store";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  {
    href: "/employees",
    label: "Employees",
    icon: "employees",
    children: [
      { href: "/employees?invite=1", label: "Add New" },
      { href: "/employees", label: "All employees" },
    ],
  },
  {
    href: "/work-records",
    label: "Work Records",
    icon: "records",
    children: [
      { href: "/work-records/all?add=1", label: "Add New" },
      { href: "/work-records/all", label: "All Work records" },
    ],
  },
  { href: "/integrations", label: "Integrations", icon: "link" },
  { href: "/transactions", label: "Transactions", icon: "invoice" },
  { href: "/access-policy", label: "Access Policy", icon: "shield" },
  { href: "/roles", label: "Roles & Permission", icon: "briefcase" },
] as const;

const accountNav = [
  { href: "/settings", label: "Account Settings", icon: "settings" },
  { href: "/help", label: "Help & Support", icon: "headset" },
];

function NavLink({
  href,
  label,
  icon,
  active,
  collapsed,
  caret,
  onNavigate,
  onToggle,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  collapsed: boolean;
  caret?: "up" | "down";
  onNavigate?: () => void;
  onToggle?: () => void;
}) {
  return (
    <div className={cn("flex", collapsed ? "justify-center" : "w-full")}>
      <div
        className={cn(
          "flex h-8 items-center rounded-lg text-xs tracking-[-0.12px]",
          collapsed ? "w-8 justify-center" : "w-full gap-2 px-3",
          active ? "bg-white font-medium text-[#236355] shadow-[0px_1px_1.5px_rgba(0,0,0,0.05)]" : "text-[#666e6d]",
        )}
      >
      <Link href={href} aria-current={active ? "page" : undefined} title={label} onClick={onNavigate} className={cn("flex items-center", collapsed ? "justify-center" : "min-w-0 flex-1 gap-2")}>
        {active && icon !== "headset" ? <ActiveIcon name={icon} /> : <Icon name={icon} className="size-4" />}
        {collapsed ? <span className="sr-only">{label}</span> : <span className="truncate">{label}</span>}
      </Link>
      {caret && !collapsed ? (
        <button type="button" className="inline-flex size-4 items-center justify-center" aria-expanded={caret === "up"} aria-label={caret === "up" ? `Collapse ${label}` : `Expand ${label}`} onClick={onToggle}>
          <Icon name="caret" className={cn("size-3", caret === "up" && "rotate-180")} />
        </button>
      ) : null}
      </div>
    </div>
  );
}

function ActiveIcon({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-4 shrink-0 bg-[#236355]"
      style={{
        WebkitMask: `url(/icons/${name}.svg) center / contain no-repeat`,
        mask: `url(/icons/${name}.svg) center / contain no-repeat`,
      }}
    />
  );
}

function childIsActive(href: string, pathname: string, search: string) {
  const url = new URL(href, "http://wageet.local");
  if (url.searchParams.get("invite") === "1") return pathname === "/employees" && search.includes("invite=1");
  if (url.pathname === "/employees") return pathname.startsWith("/employees") && !search.includes("invite=1");
  if (url.searchParams.get("add") === "1") return pathname.startsWith("/work-records/all") && search.includes("add=1");
  if (url.pathname === "/work-records/all") return pathname.startsWith("/work-records/all") && !search.includes("add=1");
  return pathname === url.pathname;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const router = useRouter();
  const portal = usePortal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(sectionFor(pathname));
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    setExpanded(sectionFor(pathname));
  }
  const [profileOpen, setProfileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const title = titleFor(pathname);
  const quietHeader = pathname === "/dashboard" || pathname.startsWith("/dashboard/notifications") || pathname.startsWith("/dashboard/payroll-close");
  const unread = portal.notices.filter((item) => !item.read).length;

  const sidebar = (
    <div className="flex h-full flex-col bg-[#f9fafa]">
      <div className={cn("flex h-14 items-center border-b border-[#e7e9e9] px-3", portal.collapsed ? "justify-center" : "justify-between")}>
        <Link href="/dashboard" className={portal.collapsed ? "sr-only" : undefined} onClick={() => setMobileOpen(false)}>
          <img src="/icons/wordmark.svg" alt="Wageet" width={75} height={24} className="h-6 w-[75px]" />
        </Link>
        <button type="button" className="hidden size-6 items-center justify-center lg:inline-flex" aria-label="Collapse sidebar" onClick={() => portal.setCollapsed(!portal.collapsed)}>
          <Icon name="sidebar" className="size-6" />
        </button>
      </div>
      <div className="border-b border-[#e7e9e9] px-3 py-4">
        <button type="button" className="flex w-full items-center gap-2 text-left" onClick={() => setWorkspaceOpen((open) => !open)} aria-expanded={workspaceOpen}>
          <img src="/icons/avatar.png" alt="" width={32} height={32} className="size-8 rounded-full" />
          {portal.collapsed ? null : (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[#0f2a1f]">{portal.workspaceName}</span>
                <span className="block text-xs text-[#526459]">Employer Dashboard</span>
              </span>
              <Icon name="chevrons" className="size-5" />
            </>
          )}
        </button>
        {workspaceOpen && !portal.collapsed ? (
          <div className="mt-2 rounded-lg border border-[#e4e4e7] bg-white p-1">
            {["Acme Foods Ltd", "Northwind Retail"].map((name) => (
              <button
                key={name}
                type="button"
                className="block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-[#eaf0ec]"
                onClick={() => {
                  portal.switchWorkspace(name);
                  setWorkspaceOpen(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 pt-3">
          <NavLink href="/get-started" label="Get Started" icon="get-started" active={pathname.startsWith("/get-started")} collapsed={portal.collapsed} onNavigate={() => setMobileOpen(false)} />
        </div>
        <p className={cn("px-5 pt-3 text-[10px] tracking-[0.4px] text-[#adb1b1] uppercase", portal.collapsed && "sr-only")}>Main menu</p>
        <nav aria-label="Main menu" className="flex flex-col gap-0.5 p-3">
          {mainNav.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <div key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={active}
                  collapsed={portal.collapsed}
                  caret={"children" in item ? (expanded === item.href ? "up" : "down") : undefined}
                  onNavigate={() => {
                    setMobileOpen(false);
                    if ("children" in item) setExpanded(item.href);
                  }}
                  onToggle={() => setExpanded((current) => (current === item.href ? null : item.href))}
                />
                {"children" in item && expanded === item.href && !portal.collapsed ? (
                  <div className="mt-0.5 mb-1 ml-[22px] flex flex-col border-l border-[#e7e9e9] py-1 pl-3">
                    {item.children.map((child) => {
                      const current = childIsActive(child.href, pathname, search);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          aria-current={current ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                          className={cn("rounded-md px-2 py-1.5 text-xs", current ? "font-medium text-[#236355]" : "text-[#666e6d] hover:text-[#0f2a1f]")}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
        <p className={cn("px-5 pt-2 text-[10px] tracking-[0.4px] text-[#adb1b1] uppercase", portal.collapsed && "sr-only")}>Account & Support</p>
        <nav aria-label="Account and support" className="flex flex-col gap-1 p-3">
          {accountNav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname.startsWith(item.href)} collapsed={portal.collapsed} onNavigate={() => setMobileOpen(false)} />
          ))}
        </nav>
      </div>
      <div className="relative p-3">
        <button type="button" className={cn("flex w-full items-center gap-2 rounded-xl bg-white text-left shadow-[0px_4px_12px_rgba(20,32,31,0.02)]", portal.collapsed ? "justify-center p-1.5" : "p-2")} onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen}>
          {portal.collapsed ? (
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#e7f3ee] text-[11px] font-medium text-[#153a2b]">{portal.profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
          ) : (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium tracking-[-0.12px] text-[#14201f]">{portal.profile.name}</span>
                <span className="block truncate text-[11px] text-[#666e6d]">{portal.profile.email}</span>
              </span>
              <Icon name="caret" className="size-3" />
            </>
          )}
        </button>
        {profileOpen ? (
          <div className="absolute right-3 bottom-16 left-3 rounded-xl border border-[#e4e4e7] bg-white p-1 shadow-lg">
            <Link href="/settings" className="block rounded-md px-2 py-2 text-sm hover:bg-[#eaf0ec]" onClick={() => { setProfileOpen(false); setMobileOpen(false); }}>
              Profile & security
            </Link>
            <button
              type="button"
              className="block w-full rounded-md px-2 py-2 text-left text-sm text-[#b42318] hover:bg-[#fdf2f0]"
              onClick={() => {
                setProfileOpen(false);
                setSignOutOpen(true);
              }}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-svh bg-[#f8f8f8]">
      <aside className={cn("sticky top-0 hidden h-svh shrink-0 border-r border-[#e7e9e9] lg:block", portal.collapsed ? "w-[72px]" : "w-60")}>{sidebar}</aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-60">{sidebar}</aside>
        </div>
      ) : null}
      <div className="min-w-0 flex-1 p-3">
        <div className="flex min-h-[calc(100svh-24px)] flex-col overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-[0px_1.5px_2px_-1px_rgba(3,7,18,0.05)]">
          <header className="flex h-16 items-center justify-between border-b border-[#ececed] px-4">
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex size-8 items-center justify-center rounded-lg lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
                <Icon name="sidebar" className="size-5" />
              </button>
              <p className="text-base font-medium tracking-[-0.4px] text-[#09090b]">{title}</p>
            </div>
            <div className="flex items-center gap-2">
              {quietHeader ? null : <button
                type="button"
                className="relative inline-flex size-8 items-center justify-center rounded-full border border-[#e4e4e7] bg-white"
                aria-label="Notifications"
                onClick={() => {
                  setNoticesOpen((open) => !open);
                  portal.markNoticesRead();
                }}
              >
                <Icon name="bell" className="size-4" />
                {unread > 0 ? <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#fa4d01]" /> : null}
              </button>}
              {quietHeader ? null : <div className="relative">
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#65a30d] bg-white px-3 text-xs font-medium text-[#09090b]" aria-expanded={generateOpen} onClick={() => setGenerateOpen((open) => !open)}>
                  <Icon name="sparkle" className="size-3.5" />
                  Generate
                </button>
                {generateOpen ? (
                  <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-[#e4e4e7] bg-white p-1 shadow-lg">
                    {["Export CSV", "Export Excel"].map((label) => (
                      <button
                        key={label}
                        type="button"
                        className="block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-[#eaf0ec]"
                        onClick={() => {
                          portal.notify(`${label} is ready to download.`);
                          setGenerateOpen(false);
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>}
            </div>
          </header>
          {noticesOpen ? (
            <div className="border-b border-[#ececed] bg-[#f8f8f8] px-4 py-3">
              <p className="text-xs font-medium tracking-[0.12em] text-[#666e6d] uppercase">Notification centre</p>
              <ul className="mt-2 space-y-2">
                {portal.notices.map((notice) => (
                  <li key={notice.id} className="rounded-lg bg-white px-3 py-2">
                    <p className="text-sm font-medium text-[#0f2a1f]">{notice.title}</p>
                    <p className="text-xs text-[#526459]">{notice.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div id="main" className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
      {portal.toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#0f2a1f] px-4 py-2 text-sm text-white">
          {portal.toast.message}
          <button type="button" className="text-xs underline" onClick={portal.dismissToast}>
            Dismiss
          </button>
        </div>
      ) : null}
      {signOutOpen ? <SignOutDialog onClose={() => setSignOutOpen(false)} onConfirm={() => { portal.signOut(); router.push("/sign-in"); }} /> : null}
    </div>
  );
}

function SignOutDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="sign-out-title" className="relative z-10 w-full max-w-[466px] rounded-2xl bg-white p-6 shadow-xl">
        <img src="/icons/logout-badge.svg" alt="" className="size-9" />
        <h2 id="sign-out-title" className="mt-3 text-2xl font-semibold tracking-[-0.3px] text-[#142e24]">Sign out of Wageet?</h2>
        <p className="mt-2 text-sm leading-snug text-[#52655b]">This ends your administrator session on this device. You can sign in again with your work account.</p>
        <div className="mt-4 border-t border-[#dfe5dd] pt-4">
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#dfe5dd] bg-white px-3 text-sm font-medium text-[#142e24]" onClick={onClose}>Stay signed in</button>
            <button type="button" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#a44035] px-3 text-sm font-medium text-white" onClick={onConfirm}>
              <img src="/icons/logout.svg" alt="" className="size-[15px]" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function sectionFor(pathname: string) {
  if (pathname.startsWith("/employees")) return "/employees";
  if (pathname.startsWith("/work-records")) return "/work-records";
  return null;
}

function titleFor(pathname: string) {
  if (pathname.startsWith("/dashboard/notifications")) return "Notifications";
  if (pathname.startsWith("/dashboard/add-funds")) return "Earnings & funding";
  if (pathname.startsWith("/dashboard/payroll-close")) return "Payroll close";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/get-started")) return "Get Started";
  if (pathname.startsWith("/employees/")) return "Employees / Employee details";
  if (pathname.startsWith("/employees")) return "Employees";
  if (pathname.startsWith("/work-records")) return "Work records";
  if (pathname.startsWith("/integrations")) return "Integrations";
  if (pathname.startsWith("/transactions")) return "Transactions";
  if (pathname.startsWith("/access-policy")) return "Access policy";
  if (pathname.startsWith("/roles")) return "Roles & permissions";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/help")) return "Help & support";
  return "Dashboard";
}
