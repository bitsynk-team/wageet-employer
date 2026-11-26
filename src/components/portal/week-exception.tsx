"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const weekPeriods = ["1–6 Dec 2026", "7–13 Dec 2026", "14–20 Dec 2026", "21–27 Dec 2026"];
export const weekPaydays = [
  "3 days before week end",
  "2 days before week end",
  "1 day before week end",
  "On the week’s last day",
  "Day after the week ends",
  "2 days after the week ends",
  "3 days after the week ends",
];
export const weekCutoffs = ["1 day before payday", "2 days before payday", "3 days before payday"];
export const workDates = ["1 Dec 2026", "2 Dec 2026", "3 Dec 2026", "4 Dec 2026"];
export const dayPaydays = ["Same workday", "Following calendar day"];
export const dayTimes = ["12:00 WAT", "14:00 WAT", "16:00 WAT", "18:00 WAT", "20:00 WAT", "23:59 WAT"];

const regularWeek = { payday: "Day after the week ends", cutoff: "2 days before payday" };
const regularDay = { payday: "Following calendar day", cutoff: "23:59 WAT", payout: "18:00 WAT" };

const weekEnds: Record<string, Date> = {
  "1–6 Dec 2026": new Date(2026, 11, 6),
  "7–13 Dec 2026": new Date(2026, 11, 13),
  "14–20 Dec 2026": new Date(2026, 11, 20),
  "21–27 Dec 2026": new Date(2026, 11, 27),
};

const paydayShift: Record<string, number> = {
  "3 days before week end": -3,
  "2 days before week end": -2,
  "1 day before week end": -1,
  "On the week’s last day": 0,
  "Day after the week ends": 1,
  "2 days after the week ends": 2,
  "3 days after the week ends": 3,
};

const cutoffShift: Record<string, number> = {
  "1 day before payday": -1,
  "2 days before payday": -2,
  "3 days before payday": -3,
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function label(date: Date) {
  return `${date.getDate()} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
}

export function resolveWeek(period: string, payday: string, cutoff: string) {
  const end = weekEnds[period] ?? new Date(2026, 11, 6);
  const paydayDate = addDays(end, paydayShift[payday] ?? 1);
  const cutoffDate = addDays(paydayDate, cutoffShift[cutoff] ?? -2);
  return { payday: label(paydayDate), cutoff: `${label(cutoffDate)} · 23:59 WAT` };
}

export function resolveDay(period: string, payday: string, cutoff: string, payout: string) {
  const match = period.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  const month = match ? shortMonths.findIndex((item) => item === match[2]) : 11;
  const start = match ? new Date(Number(match[3]), month, Number(match[1])) : new Date(2026, 11, 1);
  const paydayDate = payday === "Same workday" ? start : addDays(start, 1);
  return {
    payday: `${label(paydayDate)} · ${payout}`,
    cutoff: `${label(start)} · ${cutoff}`,
  };
}

export function WeekExceptionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const portal = usePortal();
  const [period, setPeriod] = useState(weekPeriods[0]);
  const [payday, setPayday] = useState(regularWeek.payday);
  const [cutoff, setCutoff] = useState(regularWeek.cutoff);
  const [pendingPeriod, setPendingPeriod] = useState<string | null>(null);
  const dirty = payday !== regularWeek.payday || cutoff !== regularWeek.cutoff;
  const preview = resolveWeek(period, payday, cutoff);

  useEffect(() => {
    if (!open) return;
    const saved = portal.weekExceptions.find((item) => item.period === weekPeriods[0]);
    setPeriod(saved?.period ?? weekPeriods[0]);
    setPayday(saved?.payday ?? regularWeek.payday);
    setCutoff(saved?.cutoff ?? regularWeek.cutoff);
    // Load the saved week only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function applyPeriod(next: string) {
    const saved = portal.weekExceptions.find((item) => item.period === next);
    setPeriod(next);
    setPayday(saved?.payday ?? regularWeek.payday);
    setCutoff(saved?.cutoff ?? regularWeek.cutoff);
  }

  function choosePeriod(next: string) {
    if (next === period) return;
    if (dirty) setPendingPeriod(next);
    else applyPeriod(next);
  }

  function useRegular() {
    setPayday(regularWeek.payday);
    setCutoff(regularWeek.cutoff);
    portal.removeWeekException(period);
  }

  return (
    <>
      <ScheduleDialog open={open} title="Change one week" closeLabel onClose={onClose}>
        <p className="mt-1 text-sm text-[#526459]">Choose the earning period, then adjust when employees can withdraw and when they get paid.</p>
        <div className="mt-4 space-y-3">
          <Menu label="Earning week" value={period} options={weekPeriods} onChange={choosePeriod} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Menu label="Payday" value={payday} options={weekPaydays} onChange={setPayday} />
            <Menu label="Withdrawal cut-off" value={cutoff} options={weekCutoffs} onChange={setCutoff} />
          </div>
          <Preview payday={preview.payday} cutoff={preview.cutoff} />
          <p className="text-sm text-[#526459]">Only this week changes. The earning period and regular schedule stay the same.</p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-[#17803d]" onClick={useRegular}>
              <img src="/icons/setup/sync.svg" alt="" className="size-4" />
              Use regular dates
            </button>
            <div className="flex gap-2">
              <button type="button" className="h-10 rounded-lg border border-[#dce4de] bg-white px-4 text-sm" onClick={onClose}>Cancel</button>
              <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => { portal.saveWeekException({ period, payday, cutoff }); onClose(); }}>Save exception</button>
            </div>
          </div>
        </div>
      </ScheduleDialog>
      <Modal open={Boolean(pendingPeriod)} title="Switch earning period?" description="Changes to these dates haven’t been saved." onClose={() => setPendingPeriod(null)}>
        <div className="flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setPendingPeriod(null)}>Keep editing</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { if (pendingPeriod) applyPeriod(pendingPeriod); setPendingPeriod(null); }}>Discard and switch</button>
        </div>
      </Modal>
    </>
  );
}

export function DayExceptionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const portal = usePortal();
  const [period, setPeriod] = useState(workDates[0]);
  const [payday, setPayday] = useState(regularDay.payday);
  const [cutoff, setCutoff] = useState(regularDay.cutoff);
  const [payout, setPayout] = useState(regularDay.payout);
  const [pendingPeriod, setPendingPeriod] = useState<string | null>(null);
  const dirty = payday !== regularDay.payday || cutoff !== regularDay.cutoff || payout !== regularDay.payout;
  const preview = resolveDay(period, payday, cutoff, payout);

  useEffect(() => {
    if (!open) return;
    const saved = portal.dayExceptions.find((item) => item.period === workDates[0]);
    setPeriod(saved?.period ?? workDates[0]);
    setPayday(saved?.payday ?? regularDay.payday);
    setCutoff(saved?.cutoff ?? regularDay.cutoff);
    setPayout(saved?.payout ?? regularDay.payout);
    // Load the saved workday only when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function applyPeriod(next: string) {
    const saved = portal.dayExceptions.find((item) => item.period === next);
    setPeriod(next);
    setPayday(saved?.payday ?? regularDay.payday);
    setCutoff(saved?.cutoff ?? regularDay.cutoff);
    setPayout(saved?.payout ?? regularDay.payout);
  }

  function choosePeriod(next: string) {
    if (next === period) return;
    if (dirty) setPendingPeriod(next);
    else applyPeriod(next);
  }

  return (
    <>
      <ScheduleDialog open={open} title="Change one workday" closeLabel onClose={onClose}>
        <p className="mt-1 text-sm text-[#526459]">Choose the earning period, then adjust when employees can withdraw and when they get paid.</p>
        <div className="mt-4 space-y-3">
          <Menu label="Work date" value={period} options={workDates} onChange={choosePeriod} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Menu label="Payday" value={payday} options={dayPaydays} onChange={setPayday} />
            <Menu label="Cut-off on workday" value={cutoff} options={dayTimes} onChange={setCutoff} />
          </div>
          <Menu label="Payout time" value={payout} options={dayTimes.filter((time) => time !== "23:59 WAT")} onChange={setPayout} />
          <Preview payday={preview.payday} cutoff={preview.cutoff} />
          <p className="text-sm text-[#526459]">Only this workday changes. The earning period and regular schedule stay the same.</p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-[#17803d]" onClick={() => { setPayday(regularDay.payday); setCutoff(regularDay.cutoff); setPayout(regularDay.payout); portal.removeDayException(period); }}>
              <img src="/icons/setup/sync.svg" alt="" className="size-4" />
              Use regular dates
            </button>
            <div className="flex gap-2">
              <button type="button" className="h-10 rounded-lg border border-[#dce4de] bg-white px-4 text-sm" onClick={onClose}>Cancel</button>
              <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => { portal.saveDayException({ period, payday, cutoff, payout }); onClose(); }}>Save exception</button>
            </div>
          </div>
        </div>
      </ScheduleDialog>
      <Modal open={Boolean(pendingPeriod)} title="Switch earning period?" description="Changes to these dates haven’t been saved." onClose={() => setPendingPeriod(null)}>
        <div className="flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setPendingPeriod(null)}>Keep editing</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { if (pendingPeriod) applyPeriod(pendingPeriod); setPendingPeriod(null); }}>Discard and switch</button>
        </div>
      </Modal>
    </>
  );
}

function Preview({ payday, cutoff }: { payday: string; cutoff: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 rounded-xl bg-[#f4f6f3] px-4 py-3 text-sm">
      <p className="text-[#526459]">Payday</p>
      <p className="text-right font-medium text-[#162e25]">{payday}</p>
      <p className="text-[#526459]">Withdrawals close</p>
      <p className="text-right font-medium text-[#162e25]">{cutoff}</p>
    </div>
  );
}

function ScheduleDialog({ open, title, closeLabel = false, onClose, children }: { open: boolean; title: string; closeLabel?: boolean; onClose: () => void; children: React.ReactNode }) {
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
      <button type="button" className="absolute inset-0 bg-[#1c2420]/55" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="schedule-dialog-title" className="relative z-10 max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 id="schedule-dialog-title" className="text-xl font-semibold text-[#0f2a1f]">{title}</h2>
          <button type="button" className="inline-flex items-center gap-1 text-sm text-[#526459]" onClick={onClose}>
            <span aria-hidden="true">×</span>
            {closeLabel ? "Close" : <span className="sr-only">Close</span>}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Menu({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#162e25]">{label}</span>
      <select className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm text-[#162e25] outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
