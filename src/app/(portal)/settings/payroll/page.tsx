"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DateField, parsePortalDate } from "@/components/portal/date-field";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { usePortal } from "@/components/portal/store";
import { DayExceptionDialog, WeekExceptionDialog, resolveDay, resolveWeek, weekPeriods, workDates } from "@/components/portal/week-exception";
import type { MonthException } from "@/lib/types";

const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function withYear(value: string, year: number) {
  return /\d{4}/.test(value) ? value : `${value} ${year}`;
}

function daysBetween(later: Date, earlier: Date) {
  return Math.round((later.getTime() - earlier.getTime()) / 86400000);
}

export default function PayrollSettingsPage() {
  const portal = usePortal();
  const payroll = portal.payroll;
  const [monthOpen, setMonthOpen] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("add") === "1") setMonthOpen(true);
  }, []);
  const [editing, setEditing] = useState<MonthException | null>(null);
  const [weekOpen, setWeekOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const end = parsePortalDate(payroll.end);
  const start = parsePortalDate(payroll.start);
  const paydayDate = parsePortalDate(payroll.payday);
  const cutoffDate = parsePortalDate(payroll.cutoff);
  const year = end?.getFullYear() ?? 2026;
  const title = end ? `${longMonths[end.getMonth()]} ${end.getFullYear()}` : payroll.end;
  const range = start && end ? `${start.getDate()}–${end.getDate()} ${longMonths[end.getMonth()]}` : `${payroll.start} – ${payroll.end}`;
  const lastDay = end ? new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate() : 0;
  const paydayIsLast = Boolean(paydayDate && end && paydayDate.getDate() === lastDay && paydayDate.getMonth() === end.getMonth());
  const gap = paydayDate && cutoffDate ? daysBetween(paydayDate, cutoffDate) : null;
  const cycleNote = payroll.frequency === "Weekly"
    ? `Week starts ${payroll.weekStart || "Monday"}. Withdrawals close ${payroll.cutoff.includes("WAT") ? payroll.cutoff : `${payroll.cutoff} at 23:59 WAT`}.`
    : payroll.frequency === "Daily"
      ? "Each workday follows this payout time. All times use Africa/Lagos (WAT)."
      : paydayIsLast && gap === 2
        ? "Payday is the last day of the month. Withdrawals close 2 days earlier."
        : `Payday is ${withYear(payroll.payday, year)}. Withdrawals close on ${payroll.cutoff}.`;

  return (
    <SettingsFrame description="Manage the regular payroll schedule and adjust individual paydays." aside={<TimingAside />}>
      <section className="rounded-2xl border border-[#e6ebe4] bg-[#f7f8f4] p-4">
        <h2 className="font-semibold text-[#162e25]">Current payroll cycle</h2>
        <div className="mt-3 rounded-xl bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-[#162e25]">{title}</p>
              <p className="text-sm text-[#4e6358]">{payroll.frequency} · {range} · Africa/Lagos</p>
            </div>
            <Link href="/settings/payroll/edit" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce4de] bg-white px-3 text-sm text-[#17803d]">
              <img src="/icons/dash/calendar.svg" alt="" className="size-4" />
              Edit schedule
            </Link>
          </div>
          <dl className="mt-4 space-y-3 border-t border-[#eef1ec] pt-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#4e6358]">Withdrawal cut-off</dt>
              <dd className="font-medium text-[#162e25]">{payroll.cutoff}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#4e6358]">Payday</dt>
              <dd className="font-medium text-[#162e25]">{withYear(payroll.payday, year)}</dd>
            </div>
          </dl>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-[#f4f6f3] px-3 py-2 text-sm text-[#4e6358]">
            <img src="/icons/setup/sync.svg" alt="" className="mt-0.5 size-4 shrink-0" />
            {cycleNote}
          </p>
        </div>
      </section>

      {payroll.frequency === "Weekly" ? (
        <WeeklyCard onChange={() => setWeekOpen(true)} />
      ) : payroll.frequency === "Daily" ? (
        <DailyCard onChange={() => setDayOpen(true)} />
      ) : (
        <MonthlyCard
          onAdd={() => { setEditing(null); setMonthOpen(true); }}
          onEdit={(item) => { setEditing(item); setMonthOpen(true); }}
        />
      )}

      <WeekExceptionDialog open={weekOpen} onClose={() => setWeekOpen(false)} />
      <DayExceptionDialog open={dayOpen} onClose={() => setDayOpen(false)} />
      {monthOpen ? <MonthExceptionDialog key={editing?.month ?? "new"} initial={editing} onClose={() => setMonthOpen(false)} /> : null}
    </SettingsFrame>
  );
}

function TimingAside() {
  return (
    <aside className="rounded-2xl border border-[#e6ebe4] bg-[#f7f8f4] p-4 text-sm text-[#4e6358]">
      <span className="flex size-9 items-center justify-center rounded-full bg-[#e7f3ee]">
        <img src="/icons/dash/calendar.svg" alt="" className="size-4" />
      </span>
      <h2 className="mt-3 font-semibold text-[#162e25]">Payroll timing</h2>
      <p className="mt-1">Cut-offs and paydays use the organisation’s time zone.</p>
      <h2 className="mt-4 border-t border-[#e4eae3] pt-4 font-semibold text-[#162e25]">Changing one payday</h2>
      <p className="mt-1">An exception changes payment timing for the selected earning period. The regular schedule continues afterwards.</p>
    </aside>
  );
}

function MonthlyCard({ onAdd, onEdit }: { onAdd: () => void; onEdit: (item: MonthException) => void }) {
  const portal = usePortal();
  return (
    <section className="mt-4 rounded-2xl border border-[#e6ebe4] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[#162e25]">Monthly exceptions</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Choose a different payday or withdrawal cut-off for a month.</p>
        </div>
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-3 text-sm font-medium text-white" onClick={onAdd}>
          <img src="/icons/dash/calendar.svg" alt="" className="size-4 brightness-0 invert" />
          Add exception
        </button>
      </div>
      {portal.monthExceptions.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#f4f6f3] px-3 py-3 text-sm text-[#4e6358]">
          <img src="/icons/dash/calendar.svg" alt="" className="size-4" />
          All months follow your regular schedule.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {portal.monthExceptions.map((item) => (
            <li key={item.month}>
              <button type="button" className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#f4f6f3] px-3 py-3 text-left text-sm" onClick={() => onEdit(item)}>
                <span>
                  <span className="block font-semibold text-[#162e25]">{item.month}</span>
                  <span className="text-[#4e6358]">Payday {item.payday} · Cut-off {item.cutoff}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-[#17803d]">{item.scope === "year" ? `Every ${item.month.split(" ")[0]}` : "This month only"} <span aria-hidden="true">›</span></span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {portal.payrollNotice ? <p className="mt-3 flex items-center gap-2 text-sm text-[#17803d]"><span aria-hidden="true">✓</span> {portal.payrollNotice}</p> : null}
    </section>
  );
}

function WeeklyCard({ onChange }: { onChange: () => void }) {
  const portal = usePortal();
  const weekStart = portal.payroll.weekStart || "Monday";
  const rows = weekPeriods.map((period) => {
    const saved = portal.weekExceptions.find((item) => item.period === period);
    const resolved = resolveWeek(period, saved?.payday ?? portal.payroll.payday, saved?.cutoff ?? portal.payroll.cutoff);
    return { period, resolved, exception: Boolean(saved) };
  });
  const featured = rows[0];
  return (
    <section className="mt-4 rounded-2xl border border-[#e6ebe4] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-[#162e25]">Weekly schedule</h2>
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-3 text-sm font-medium text-white" onClick={onChange}>
          <img src="/icons/dash/calendar.svg" alt="" className="size-4 brightness-0 invert" />
          Change one week
        </button>
      </div>
      <p className="mt-2 text-sm text-[#4e6358]">Takes effect from the next payroll cycle.</p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3"><dt className="text-[#4e6358]">Weekly rule</dt><dd className="font-medium text-[#162e25]">Week starts {weekStart} · {portal.payroll.payday}</dd></div>
        <div className="flex items-center justify-between gap-3"><dt className="text-[#4e6358]">Withdrawal cut-off</dt><dd className="font-medium text-[#162e25]">{portal.payroll.cutoff.includes("WAT") ? portal.payroll.cutoff : `${portal.payroll.cutoff} at 23:59 WAT`}</dd></div>
      </dl>
      <ul className="mt-3 space-y-2">
        {[featured, ...rows.slice(1).filter((row) => row.exception)].map((row) => (
          <li key={row.period} className="rounded-xl bg-[#f4f6f3] px-3 py-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-[#162e25]">{row.period}</p>
              <p className="text-[#17803d]">{row.exception ? "Exception" : "Regular dates"}</p>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[#4e6358]"><span>Payday</span><span className="text-[#162e25]">{row.resolved.payday}</span></div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[#4e6358]"><span>Withdrawals close</span><span className="text-[#162e25]">{row.resolved.cutoff}</span></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DailyCard({ onChange }: { onChange: () => void }) {
  const portal = usePortal();
  const payout = portal.payroll.payoutTime || "18:00 WAT";
  const rows = workDates.map((period) => {
    const saved = portal.dayExceptions.find((item) => item.period === period);
    const resolved = resolveDay(period, saved?.payday ?? "Following calendar day", saved?.cutoff ?? "23:59 WAT", saved?.payout ?? payout);
    return { period, resolved, exception: Boolean(saved) };
  });
  const featured = rows[0];
  return (
    <section className="mt-4 rounded-2xl border border-[#e6ebe4] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-[#162e25]">Daily schedule</h2>
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-3 text-sm font-medium text-white" onClick={onChange}>
          <img src="/icons/dash/calendar.svg" alt="" className="size-4 brightness-0 invert" />
          Change one workday
        </button>
      </div>
      <p className="mt-2 text-sm text-[#4e6358]">Takes effect from the next payroll cycle.</p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3"><dt className="text-[#4e6358]">Regular payday</dt><dd className="font-medium text-[#162e25]">{portal.payroll.payday.includes("WAT") ? portal.payroll.payday : `${portal.payroll.payday} at ${payout}`}</dd></div>
        <div className="flex items-center justify-between gap-3"><dt className="text-[#4e6358]">Withdrawal cut-off</dt><dd className="font-medium text-[#162e25]">{portal.payroll.cutoff.includes("workday") ? portal.payroll.cutoff : `On the workday at ${portal.payroll.cutoff}`}</dd></div>
      </dl>
      <ul className="mt-3 space-y-2">
        {[featured, ...rows.slice(1).filter((row) => row.exception)].map((row) => (
          <li key={row.period} className="rounded-xl bg-[#f4f6f3] px-3 py-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-[#162e25]">{row.period}</p>
              <p className="text-[#17803d]">{row.exception ? "Exception" : "Regular dates"}</p>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[#4e6358]"><span>Payday</span><span className="text-[#162e25]">{row.resolved.payday}</span></div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[#4e6358]"><span>Withdrawals close</span><span className="text-[#162e25]">{row.resolved.cutoff}</span></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MonthExceptionDialog({ initial, onClose }: { initial: MonthException | null; onClose: () => void }) {
  const portal = usePortal();
  const draft = useMemo(() => initial ?? defaultMonth(), [initial]);
  const [month, setMonth] = useState(draft.month);
  const [payday, setPayday] = useState(draft.payday);
  const [cutoff, setCutoff] = useState(draft.cutoff);
  const [scope, setScope] = useState<MonthException["scope"]>(draft.scope);
  const [pendingMonth, setPendingMonth] = useState<string | null>(null);
  const [error, setError] = useState("");
  const dirty = month !== draft.month || payday !== draft.payday || cutoff !== draft.cutoff || scope !== draft.scope;
  const monthName = month.split(" ")[0] || "December";
  const monthDate = parsePortalDate(month);
  const paydayDate = parsePortalDate(payday);
  const paydayOutside = Boolean(monthDate && paydayDate && (paydayDate.getFullYear() !== monthDate.getFullYear() || paydayDate.getMonth() !== monthDate.getMonth()));
  const cutoffDate = parsePortalDate(cutoff);
  const cutoffAfterPayday = Boolean(paydayDate && cutoffDate && new Date(cutoffDate.getFullYear(), cutoffDate.getMonth(), cutoffDate.getDate()).getTime() > new Date(paydayDate.getFullYear(), paydayDate.getMonth(), paydayDate.getDate()).getTime());

  function applyMonth(next: string, keepDates = false) {
    const existing = portal.monthExceptions.find((item) => item.month === next);
    const fresh = defaultMonth(next);
    setMonth(next);
    setPayday(keepDates ? payday : existing?.payday ?? fresh.payday);
    setCutoff(keepDates ? cutoff : existing?.cutoff ?? fresh.cutoff);
    setScope(existing?.scope ?? "month");
  }

  function changePayday(next: string) {
    const coming = parsePortalDate(next);
    const currentMonth = parsePortalDate(month);
    if (!coming || !currentMonth || coming.getFullYear() !== currentMonth.getFullYear() || coming.getMonth() !== currentMonth.getMonth()) return;
    const previous = parsePortalDate(payday);
    const currentCutoff = parsePortalDate(cutoff);
    setPayday(next);
    setError("");
    if (previous && coming && currentCutoff) {
      const gap = daysBetween(previous, currentCutoff);
      const shifted = new Date(coming);
      shifted.setDate(shifted.getDate() - gap);
      if (shifted.getTime() > coming.getTime()) shifted.setTime(coming.getTime());
      setCutoff(`${shifted.getDate()} ${shortMonths[shifted.getMonth()]} ${shifted.getFullYear()}`);
    }
  }

  function changeCutoff(next: string) {
    const coming = parsePortalDate(next);
    const pay = parsePortalDate(payday);
    if (!coming || !pay || coming.getTime() > pay.getTime()) return;
    setCutoff(next);
    setError("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#1c2420]/55" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="month-exception-title" className="relative z-10 max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 id="month-exception-title" className="text-xl font-semibold text-[#0f2a1f]">Monthly payday exception</h2>
          <button type="button" className="flex size-8 items-center justify-center rounded-full bg-[#f4f6f3] text-[#526459]" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <p className="mt-1 text-sm text-[#526459]">Change the payment date for a month. Its earning period stays the same.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="text-sm">
            <span className="font-medium text-[#162e25]">Payroll month</span>
            <DateField className="mt-1.5" format="month" value={month} onChange={(next) => { if (dirty) setPendingMonth(next); else applyMonth(next); }} />
          </div>
          <div className="text-sm">
            <span className="font-medium text-[#162e25]">Earning period</span>
            <p className="mt-3 text-[#162e25]">{earningPeriod(month)}</p>
          </div>
          <div className="text-sm">
            <span className="font-medium text-[#162e25]">Payday</span>
            <DateField className="mt-1.5" format="medium" value={payday} limitTo={month} onChange={changePayday} />
            {paydayOutside || error ? <p className="mt-1 text-xs text-[#b42318]">{error || "Choose a payday in the selected payroll month."}</p> : null}
          </div>
          <div className="text-sm">
            <span className="font-medium text-[#162e25]">Withdrawal cut-off</span>
            <DateField className="mt-1.5" format="medium" value={cutoff} max={payday} onChange={changeCutoff} />
            {cutoffAfterPayday ? <p className="mt-1 text-xs text-[#b42318]">Withdrawal cut-off cannot be after payday.</p> : null}
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#f4f6f3] px-3 py-3 text-sm text-[#4e6358]">
          <img src="/icons/dash/calendar.svg" alt="" className="mt-0.5 size-4 shrink-0" />
          Withdrawals close at 23:59 WAT. Moving payday shifts the cut-off by the same number of days. You can also choose a different cut-off.
        </p>
        <p className="mt-4 text-sm font-medium text-[#162e25]">Apply this change</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <label className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${scope === "month" ? "border-[#0f2a1f]" : "border-[#dce4de]"}`}>
            <input type="radio" name="exception-scope" checked={scope === "month"} onChange={() => setScope("month")} />
            This month only
          </label>
          <label className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${scope === "year" ? "border-[#0f2a1f]" : "border-[#dce4de]"}`}>
            <input type="radio" name="exception-scope" checked={scope === "year"} onChange={() => setScope("year")} />
            Every {monthName}
          </label>
        </div>
        <p className="mt-2 text-xs text-[#526459]">Yearly changes start with the selected month.</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          {initial ? (
            <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-[#17803d]" onClick={() => { portal.removeMonthException(month); onClose(); }}>
              <img src="/icons/setup/sync.svg" alt="" className="size-4" />
              Restore regular dates
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm" onClick={onClose}>Cancel</button>
            <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => { if (paydayOutside) { setError("Choose a payday in the selected payroll month."); return; } if (cutoffAfterPayday) return; portal.saveMonthException({ month, payday, cutoff, scope }); onClose(); }}>Save change</button>
          </div>
        </div>
        {pendingMonth ? (
          <div className="mt-4 rounded-xl border border-[#e6ebe4] p-3">
            <p className="font-medium text-[#162e25]">Switch earning period?</p>
            <p className="mt-1 text-sm text-[#526459]">Changes to these dates haven’t been saved.</p>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" className="h-9 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setPendingMonth(null)}>Keep editing</button>
              <button type="button" className="h-9 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { applyMonth(pendingMonth); setPendingMonth(null); }}>Discard and switch</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function defaultMonth(month = "December 2026"): MonthException {
  const date = parsePortalDate(month) ?? new Date(2026, 11, 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const cutoff = new Date(last);
  cutoff.setDate(cutoff.getDate() - 2);
  return {
    month: `${longMonths[date.getMonth()]} ${date.getFullYear()}`,
    payday: `${last.getDate()} ${shortMonths[last.getMonth()]} ${last.getFullYear()}`,
    cutoff: `${cutoff.getDate()} ${shortMonths[cutoff.getMonth()]} ${cutoff.getFullYear()}`,
    scope: "month",
  };
}

function earningPeriod(month: string) {
  const date = parsePortalDate(month);
  if (!date) return month;
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return `1–${last} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
}
