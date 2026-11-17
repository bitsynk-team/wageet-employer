"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "cn";

export function PageIntro({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-[#0f2a1f] sm:text-[26px]">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#526459]">{description}</p>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function PrimaryButton({
  children,
  type = "button",
  onClick,
  className,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-[#0f2a1f] px-4 text-xs font-bold text-[#fffff4] hover:bg-[#163528]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  href,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const classes = cn(
    "inline-flex h-10 items-center justify-center rounded-md border border-[#e4e4e7] bg-white px-3 text-xs font-medium text-[#14201f] hover:bg-[#f8f8f8]",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

const tones: Record<string, string> = {
  Successful: "bg-[#e7f6ee] text-[#17803d]",
  Active: "bg-[#e7f6ee] text-[#17803d]",
  Verified: "bg-[#e7f6ee] text-[#17803d]",
  Connected: "bg-[#e7f6ee] text-[#17803d]",
  Completed: "bg-[#e7f6ee] text-[#17803d]",
  Confirmed: "bg-[#e7f6ee] text-[#17803d]",
  Corrected: "bg-[#e7f6ee] text-[#17803d]",
  Open: "bg-[#fbf1e0] text-[#b54708]",
  Failed: "bg-[#fdecec] text-[#d92d20]",
  Missing: "text-[#b58105]",
  "Needs review": "bg-[#fbf1e0] text-[#b54708]",
  Held: "bg-[#fbf1e0] text-[#b54708]",
  Pending: "bg-[#fbf1e0] text-[#b54708]",
  Invited: "bg-[#fbf1e0] text-[#b54708]",
  "Delivery failed": "bg-[#fff4e8] text-[#c2410c]",
  Inactive: "bg-[#f4f4f5] text-[#71717a]",
  Reversed: "bg-[#f3eefe] text-[#7a5af8]",
  "Not connected": "bg-[#f4f4f5] text-[#71717a]",
  Adjusted: "bg-[#eef2f6] text-[#475467]",
  "On demand": "bg-[#eef4ff] text-[#2e5aac]",
  Reopened: "bg-[#fff4e8] text-[#9a3412]",
  Resolved: "bg-[#eaf0ec] text-[#0f2a1f]",
};

export function StatusPill({ value }: { value: string }) {
  const bare = value === "Missing" || value === "Verified";
  return (
    <span className={cn("inline-flex h-[22px] items-center gap-1.5 text-[11px] font-medium", bare ? "px-0" : "rounded-full px-2", tones[value] ?? "bg-[#f4f4f5] text-[#666e6d]")}>
      {bare ? null : <span className="size-1.5 rounded-full bg-current" />}
      {value}
    </span>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-[#0f2a1f]">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-[#b42318]">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm text-[#0f2a1f] outline-none placeholder:text-[#666e6d] focus:border-[#0f2a1f]";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <h2 id="dialog-title" className="text-lg font-semibold text-[#0f2a1f]">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-[#526459]">{description}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function Menu({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-medium text-[#14201f]"
      >
        <span className="text-[#666e6d]">{label}</span>
        {value}
      </button>
      {open ? (
        <ul id={listId} role="listbox" className="absolute right-0 z-20 mt-1 min-w-44 rounded-lg border border-[#e4e4e7] bg-white p-1 shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                className={cn("w-full rounded-md px-2.5 py-2 text-left text-sm hover:bg-[#eaf0ec]", option === value && "bg-[#eaf0ec]")}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-4 py-12 text-center">
      <p className="font-medium text-[#0f2a1f]">{title}</p>
      <p className="mt-1 text-sm text-[#526459]">{body}</p>
    </div>
  );
}
