"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateField, parsePortalDate } from "@/components/portal/date-field";
import { MonthExceptionDialog } from "@/app/(portal)/settings/payroll/page";
import { DayExceptionDialog, WeekExceptionDialog, resolveDay, resolveWeek, weekCutoffs, weekPaydays, workDates } from "@/components/portal/week-exception";
import { usePortal } from "@/components/portal/store";
import type { Payroll } from "@/lib/types";

const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const payoutTimes = ["12:00 WAT", "14:00 WAT", "16:00 WAT", "18:00 WAT", "20:00 WAT"];
const cutoffTimes = ["12:00 WAT", "14:00 WAT", "16:00 WAT", "18:00 WAT", "20:00 WAT", "23:59 WAT"];

export default function EditPayrollPage() {
  const portal = usePortal();
  const router = useRouter();
  const [form, setForm] = useState<Payroll>({
    ...portal.payroll,
    start: toDmy(portal.payroll.start),
    end: toDmy(portal.payroll.end),
    payday: portal.payroll.frequency === "Monthly" ? toDmy(portal.payroll.payday) : portal.payroll.payday,
    cutoff: portal.payroll.frequency === "Monthly" ? toDmy(portal.payroll.cutoff) : portal.payroll.cutoff,
    weekStart: portal.payroll.weekStart || "Monday",
    payoutTime: portal.payroll.payoutTime || "18:00 WAT",
  });
  const [dayPayday, setDayPayday] = useState(portal.payroll.payday.includes("Same") ? "Same workday" : "Following calendar day");
  const [dayCutoff, setDayCutoff] = useState(cutoffTimes.find((time) => portal.payroll.cutoff.includes(time)) || "23:59 WAT");
  const [error, setError] = useState("");
  const [weekOpen, setWeekOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);

  function chooseFrequency(frequency: Payroll["frequency"]) {
    if (frequency === "Weekly") {
      setForm({
        ...form,
        frequency,
        payday: (weekPaydays as readonly string[]).includes(form.payday) ? form.payday : "Day after the week ends",
        cutoff: (weekCutoffs as readonly string[]).includes(form.cutoff) ? form.cutoff : "2 days before payday",
        weekStart: form.weekStart || "Monday",
      });
      return;
    }
    if (frequency === "Daily") {
      setForm({ ...form, frequency, payday: dayPayday, cutoff: dayCutoff, payoutTime: form.payoutTime || "18:00 WAT" });
      return;
    }
    setForm({
      ...form,
      frequency,
      start: parsePortalDate(form.start) ? form.start : "01/11/2026",
      end: parsePortalDate(form.end) ? form.end : "30/11/2026",
      payday: parsePortalDate(form.payday) ? toDmy(form.payday) : "30/11/2026",
      cutoff: parsePortalDate(form.cutoff) ? toDmy(form.cutoff) : "28/11/2026",
    });
  }

  function save() {
    if (form.frequency === "Monthly" && (!parsePortalDate(form.start) || !parsePortalDate(form.end) || !parsePortalDate(form.payday) || !parsePortalDate(form.cutoff))) {
      setError("Set the earning period, payday, and withdrawal cut-off.");
      return;
    }
    const next: Payroll = form.frequency === "Monthly"
      ? { ...form, start: toMedium(form.start), end: toMedium(form.end), payday: toDayMon(form.payday), cutoff: toCutoff(form.cutoff) }
      : form.frequency === "Daily"
        ? { ...form, payday: `${dayPayday} at ${form.payoutTime}`, cutoff: `On the workday at ${dayCutoff}`, payoutTime: form.payoutTime }
        : form;
    portal.savePayroll(next);
    router.push("/settings/payroll");
  }

  const weekPreview = resolveWeek("1–6 Dec 2026", (weekPaydays as readonly string[]).includes(form.payday) ? form.payday : "Day after the week ends", (weekCutoffs as readonly string[]).includes(form.cutoff) ? form.cutoff : "2 days before payday");
  const savedWeek = portal.weekExceptions.find((item) => item.period === "1–6 Dec 2026");
  const shownWeek = savedWeek ? resolveWeek(savedWeek.period, savedWeek.payday, savedWeek.cutoff) : weekPreview;
  const savedDay = portal.dayExceptions.find((item) => item.period === workDates[0]);
  const shownDay = resolveDay(workDates[0], savedDay?.payday ?? dayPayday, savedDay?.cutoff ?? dayCutoff, savedDay?.payout ?? form.payoutTime ?? "18:00 WAT");
  const paydayDate = parsePortalDate(form.payday);
  const endDate = parsePortalDate(form.end);
  const paydayIsLast = Boolean(paydayDate && endDate && paydayDate.getDate() === new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate());

  return (
    <div className="px-4 py-5 sm:px-6">
      <p className="text-sm text-[#526459]">Settings</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Payroll Cycle</h1>
      <p className="mt-1 max-w-3xl text-sm text-[#4e6358]">
        {form.frequency === "Weekly"
          ? "Choose how each earning week repeats and when withdrawals close."
          : form.frequency === "Daily"
            ? "Choose when each workday is paid and when employees can last withdraw."
            : "Set the recurring schedule. Use a monthly exception when payday or the cut-off changes for one month."}
      </p>
      <section className="mt-4 max-w-3xl rounded-2xl border border-[#e7ebe6] bg-[#f7f8f4] p-4 sm:p-5">
        <p className="text-xs text-[#fa4d01]">Fields marked * are required.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Pay Frequency *">
            <select value={form.frequency} onChange={(event) => chooseFrequency(event.target.value as Payroll["frequency"])} className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </Field>
          <Field label="Currency">
            <input readOnly value="NGN · Nigerian naira" className="h-11 w-full rounded-lg border border-[#dce4de] bg-[#f4f6f3] px-3 text-sm" />
          </Field>
          {form.frequency === "Weekly" ? (
            <>
              <Field label="Week Starts *">
                <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={form.weekStart} onChange={(event) => setForm({ ...form, weekStart: event.target.value })}>
                  {weekDays.map((day) => <option key={day}>{day}</option>)}
                </select>
              </Field>
              <Field label="Week Ends">
                <input readOnly value={weekDays[(weekDays.indexOf(form.weekStart || "Monday") + 6) % 7]} className="h-11 w-full rounded-lg border border-[#dce4de] bg-[#f4f6f3] px-3 text-sm" />
              </Field>
              <Field label="Regular Payday *">
                <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={form.payday} onChange={(event) => setForm({ ...form, payday: event.target.value })}>
                  {weekPaydays.map((option) => <option key={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Withdrawal Cut-Off *">
                <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={form.cutoff} onChange={(event) => setForm({ ...form, cutoff: event.target.value })}>
                  {weekCutoffs.map((option) => <option key={option}>{option}</option>)}
                </select>
              </Field>
            </>
          ) : form.frequency === "Daily" ? (
            <>
              <Field label="Regular Payday *">
                <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={dayPayday} onChange={(event) => setDayPayday(event.target.value)}>
                  <option>Following calendar day</option>
                  <option>Same workday</option>
                </select>
              </Field>
              <Field label="Payout Time *">
                <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={form.payoutTime} onChange={(event) => setForm({ ...form, payoutTime: event.target.value })}>
                  {payoutTimes.map((time) => <option key={time}>{time}</option>)}
                </select>
              </Field>
              <Field label="Cut-Off On Workday *">
                <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={dayCutoff} onChange={(event) => setDayCutoff(event.target.value)}>
                  {cutoffTimes.map((time) => <option key={time}>{time}</option>)}
                </select>
              </Field>
              <Field label="Earning Period">
                <input readOnly value="One workday" className="h-11 w-full rounded-lg border border-[#dce4de] bg-[#f4f6f3] px-3 text-sm" />
              </Field>
            </>
          ) : (
            <>
              <Field label="Earning period starts *"><DateField format="dmy" value={form.start} onChange={(start) => setForm({ ...form, start })} /></Field>
              <Field label="Earning period ends *"><DateField format="dmy" value={form.end} onChange={(end) => setForm({ ...form, end })} /></Field>
              <Field label="Regular payday *"><DateField format="dmy" value={form.payday} onChange={(payday) => setForm({ ...form, payday })} /></Field>
              <Field label="Withdrawal Cut-Off *"><DateField format="dmy" value={form.cutoff} onChange={(cutoff) => setForm({ ...form, cutoff })} /></Field>
            </>
          )}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-[#17803d]">
          <img src="/icons/setup/sync.svg" alt="" className="size-4" />
          {form.frequency === "Weekly"
            ? `Repeats every week. Week starts ${form.weekStart}.`
            : form.frequency === "Daily"
              ? "Repeats every workday."
              : paydayIsLast
                ? "Repeats monthly · Payday falls on the last calendar day."
                : "Repeats monthly."}
        </p>
        {form.frequency === "Weekly" ? (
          <PreviewCard title="Weekly preview" action="Change one week" onAction={() => setWeekOpen(true)} rows={[["Earning week", "1–6 Dec 2026"], ["Payday", shownWeek.payday], ["Withdrawal cut-off", shownWeek.cutoff]]} badge={savedWeek ? "Exception" : "Regular dates"} />
        ) : form.frequency === "Daily" ? (
          <PreviewCard title="Daily preview" action="Change one workday" onAction={() => setDayOpen(true)} rows={[["Work date", workDates[0]], ["Payday", shownDay.payday], ["Withdrawal cut-off", shownDay.cutoff]]} badge={savedDay ? "Exception" : "Regular dates"} />
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#e6ebe4] bg-white p-4">
            <div>
              <h2 className="font-semibold text-[#162e25]">Monthly exceptions</h2>
              <p className="mt-1 text-sm text-[#4e6358]">Change dates for a specific month. Other months follow this schedule.</p>
            </div>
            <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce4de] bg-white px-3 text-sm text-[#17803d]" onClick={() => setMonthOpen(true)}>
              <img src="/icons/dash/calendar.svg" alt="" className="size-4" />
              Manage exceptions
            </button>
          </div>
        )}
        <div className="mt-4 rounded-xl border border-dashed border-[#c9d4cc] px-4 py-3 text-sm text-[#4e6358]">
          <p className="flex items-start gap-2 font-medium text-[#162e25]">
            <img src="/icons/records/info.svg" alt="" className="mt-0.5 size-4 shrink-0" />
            {form.frequency === "Weekly"
              ? "Weekly earning periods follow the same seven-day schedule."
              : form.frequency === "Daily"
                ? "Daily earnings use employer-submitted work records."
                : "Withdrawals close at 23:59 WAT on the cut-off date."}
          </p>
          <p className="mt-1 pl-6">
            {form.frequency === "Weekly"
              ? "The first week can be shorter when the schedule starts midweek."
              : form.frequency === "Daily"
                ? "The withdrawal cut-off is on the workday. All times use Africa/Lagos (WAT)."
                : "This lets you reconcile withdrawals before running payroll."}
          </p>
        </div>
        {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/settings/payroll" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm">Back to settings</Link>
          <button type="button" onClick={save} className="h-10 min-w-[140px] rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white">Save cycle</button>
        </div>
      </section>
      <p className="mt-4 text-sm text-[#4e6358]">Need a hand getting set up? <Link href="/help" className="font-semibold text-[#0f2a1f] underline">Contact Wageet support</Link></p>
      <WeekExceptionDialog open={weekOpen} onClose={() => setWeekOpen(false)} />
      <DayExceptionDialog open={dayOpen} onClose={() => setDayOpen(false)} />
      {monthOpen ? <MonthExceptionDialog initial={null} onClose={() => setMonthOpen(false)} /> : null}
    </div>
  );
}

function PreviewCard({ title, action, onAction, rows, badge }: { title: string; action: string; onAction: () => void; rows: string[][]; badge: string }) {
  return (
    <div className="mt-4 rounded-xl border border-[#e6ebe4] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-[#162e25]">{title}</h2>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce4de] px-3 text-sm text-[#17803d]" onClick={onAction}>
          <img src="/icons/dash/calendar.svg" alt="" className="size-4" />
          {action}
        </button>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-[#4e6358]">{label}</dt>
            <dd className="font-medium text-[#162e25]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-[#17803d]">
        <img src="/icons/dash/calendar.svg" alt="" className="size-4" />
        {badge}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#162e25]">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function toDmy(value: string) {
  const date = parsePortalDate(value);
  if (!date) return value;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

function toMedium(value: string) {
  const date = parsePortalDate(value);
  if (!date) return value;
  return `${date.getDate()} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
}

function toDayMon(value: string) {
  const date = parsePortalDate(value);
  if (!date) return value;
  return `${date.getDate()} ${shortMonths[date.getMonth()]}`;
}

function toCutoff(value: string) {
  const date = parsePortalDate(value);
  if (!date) return value;
  return `${date.getDate()} ${shortMonths[date.getMonth()]} · 23:59 WAT`;
}
