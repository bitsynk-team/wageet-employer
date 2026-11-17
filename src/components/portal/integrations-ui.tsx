"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "cn";
import type { IntegrationSource } from "@/lib/types";

export function IntIcon({ name, className = "size-4 shrink-0" }: { name: string; className?: string }) {
  return <img src={`/icons/int/${name}.svg`} alt="" className={className} />;
}

const marks: Record<IntegrationSource["id"], { icon: string; bg: string }> = {
  api: { icon: "api", bg: "bg-[#e7f3ee]" },
  sftp: { icon: "sftp", bg: "bg-[#eef1f4]" },
  sheet: { icon: "sheet", bg: "bg-[#f8f1e7]" },
};

export function SourceMark({ id }: { id: IntegrationSource["id"] }) {
  const mark = marks[id];
  return (
    <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-xl", mark.bg)}>
      <IntIcon name={mark.icon} className="size-[22px] shrink-0" />
    </span>
  );
}

export function DarkButton({
  children,
  onClick,
  href,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  const className = "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white hover:bg-[#112c23]";
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <button type={type} onClick={onClick} className={className}>{children}</button>;
}

export function LineButton({
  children,
  onClick,
  href,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}) {
  const className = "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-4 text-sm font-medium text-[#162e25] hover:bg-[#f8f8f8]";
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <button type={type} onClick={onClick} className={className}>{children}</button>;
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
      <IntIcon name="back" />
      {children}
    </Link>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-[#e4e4e7] bg-white p-4 sm:p-5", className)}>{children}</section>;
}

export function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl>
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-start justify-between gap-6 border-b border-[#f0f2f0] py-3 text-sm last:border-0">
          <dt className="text-[#71717a]">{label}</dt>
          <dd className="text-right font-medium text-[#162e25]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SideFacts({ icon, title, rows }: { icon: string; title: string; rows: [string, string][] }) {
  return (
    <aside className="rounded-2xl border border-[#e4e4e7] p-4">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#e7f3ee]">
        <IntIcon name={icon} className="size-[22px] shrink-0" />
      </span>
      <h2 className="mt-3 font-semibold text-[#162e25]">{title}</h2>
      <dl className="mt-3 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-[#71717a]">{label}</dt>
            <dd className="text-sm font-medium text-[#162e25]">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export const apiSchedules = [
  { label: "Daily at 08:00", value: "Daily · 08:00 WAT" },
  { label: "Every four hours", value: "Every 4 hours · WAT" },
  { label: "Weekly on Friday", value: "Friday · 16:00 WAT" },
];

export const sftpSchedules = [
  { label: "Daily at 06:00", value: "Daily · 06:00 WAT" },
  { label: "Every four hours", value: "Every 4 hours · WAT" },
  { label: "Weekly on Friday", value: "Friday · 16:00 WAT" },
];

export function ScheduleField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <span className="mb-1.5 block text-sm font-medium text-[#162e25]">{label}</span>
      <button type="button" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((current) => !current)} className="flex h-11 w-full items-center justify-between rounded-lg border border-[#dce4de] bg-white px-3 text-left text-sm text-[#162e25]">
        {value}
        <img src="/icons/caret.svg" alt="" className={cn("size-3", open && "rotate-180")} />
      </button>
      {open ? (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 w-full rounded-lg border border-[#e4e4e7] bg-white p-1 shadow-lg">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={cn("w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#eaf0ec]", option.value === value && "bg-[#eaf0ec]")}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function sourceHref(item: IntegrationSource) {
  if (item.id === "sheet") return "/work-records/upload";
  if (item.state === "Connected") return item.id === "api" ? "/integrations/api" : "/integrations/sftp";
  return item.id === "api" ? "/integrations/api/configure" : "/integrations/sftp/configure";
}

export function addHint(item: IntegrationSource) {
  if (item.id === "sheet") return "Use a CSV or Excel file for a one-off delivery.";
  if (item.state === "Connected") return "Connected · Manage source and delivery schedule";
  return item.body;
}
