"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "cn";

const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export type DateFormat = "dmy" | "long" | "medium" | "dayMon" | "month" | "cutoff";

function monthIndex(name: string) {
  return shortMonths.findIndex((item) => item.toLowerCase() === name.slice(0, 3).toLowerCase());
}

export function parsePortalDate(value: string): Date | null {
  const text = value.trim();
  if (!text) return null;
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) {
    const date = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const long = text.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (long) {
    const month = monthIndex(long[1]);
    if (month >= 0) return new Date(Number(long[3]), month, Number(long[2]));
  }
  const medium = text.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?/);
  if (medium) {
    const month = monthIndex(medium[2]);
    if (month >= 0) return new Date(medium[3] ? Number(medium[3]) : 2026, month, Number(medium[1]));
  }
  const monthYear = text.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = monthIndex(monthYear[1]);
    if (month >= 0) return new Date(Number(monthYear[2]), month, 1);
  }
  return null;
}

function formatPortalDate(date: Date, format: DateFormat) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  if (format === "dmy") return `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
  if (format === "long") return `${shortMonths[month]} ${day}, ${year}`;
  if (format === "dayMon") return `${day} ${shortMonths[month]}`;
  if (format === "month") return `${longMonths[month]} ${year}`;
  if (format === "cutoff") return `${day} ${shortMonths[month]} · 23:59 WAT`;
  return `${day} ${shortMonths[month]} ${year}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function DateField({
  value,
  onChange,
  format = "medium",
  placeholder = "DD/MM/YYYY",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  format?: DateFormat;
  placeholder?: string;
  className?: string;
}) {
  const labelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const parsed = parsePortalDate(value);
  const selected = format === "month" ? null : parsed;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState(() => parsed ?? new Date(2026, 10, 1));
  const [place, setPlace] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  function placePopover() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 310;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const below = rect.bottom + 6;
    const top = below + 292 > window.innerHeight ? Math.max(8, rect.top - 298) : below;
    setPlace({ top, left });
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onScroll() {
      placePopover();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  function toggle() {
    const next = parsePortalDate(value);
    setCursor(next ?? new Date(2026, 10, 1));
    placePopover();
    setOpen((current) => !current);
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const mondayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [
    ...Array.from({ length: mondayIndex }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? labelId : undefined}
        onClick={toggle}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-[#dce4de] bg-white px-3 text-left text-sm outline-none focus:border-[#0f2a1f]",
          className,
        )}
      >
        <span className={value ? "text-[#0f2a1f]" : "text-[#666e6d]"}>{value || placeholder}</span>
        <img src="/icons/setup/date.svg" alt="" className="size-[15px] shrink-0" />
      </button>
      {open && mounted
        ? createPortal(
        <div
          ref={popoverRef}
          id={labelId}
          role="dialog"
          aria-label={`${longMonths[month]} ${year} calendar`}
          style={{ top: place.top, left: place.left }}
          className="fixed z-[80] w-[310px] rounded-xl border border-[#e7e9e9] bg-white p-3 shadow-[0_8px_24px_rgba(15,42,31,0.12)]"
        >
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Previous month" className="flex size-7 items-center justify-center rounded-md text-[#162e25] hover:bg-[#f4f5ef]" onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</button>
              <p className="text-sm font-semibold text-[#162e25]">{longMonths[month]} {year}</p>
              <button type="button" aria-label="Next month" className="flex size-7 items-center justify-center rounded-md text-[#162e25] hover:bg-[#f4f5ef]" onClick={() => setCursor(new Date(year, month + 1, 1))}>›</button>
            </div>
            <span className="text-xs text-[#526459]">Day of month</span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#526459]">
            {weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((date, index) => (
              date ? (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(formatPortalDate(date, format));
                    setOpen(false);
                  }}
                  className={cn(
                    "h-8 rounded-md text-sm font-medium",
                    selected && sameDay(selected, date) ? "bg-[#0f2a1f] text-[#fffff4]" : "bg-[#f8f9f6] text-[#162e25] hover:bg-[#eaf0ec]",
                  )}
                >
                  {date.getDate()}
                </button>
              ) : <span key={`empty-${index}`} />
            ))}
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
