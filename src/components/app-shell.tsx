"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { PortalNav } from "@/components/portal-nav";
import { cn } from "cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-full bg-canvas">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col bg-forest px-4 py-5 text-white lg:flex">
        <Link href="/" className="mb-8 inline-flex px-2">
          <Logo tone="white" className="h-8 w-auto" priority />
        </Link>
        <PortalNav />
        <p className="mt-auto px-3 pt-6 text-xs leading-relaxed text-white/60">
          Withdrawals stay off until the workplace setup is complete.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-canvas/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-forest hover:bg-mint lg:hidden"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <MenuIcon className="size-4" />
            </button>
            <div>
              <p className="text-sm font-semibold text-forest">Employer portal</p>
              <p className="text-xs text-muted-foreground lg:hidden">Wageet</p>
            </div>
          </div>
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-white")}
          >
            Sign in
          </Link>
        </header>
        <main id="main" key={pathname} className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-forest/40"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-72 flex-col bg-forest p-4 text-white">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Logo tone="white" className="h-7 w-auto" />
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <PortalNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
