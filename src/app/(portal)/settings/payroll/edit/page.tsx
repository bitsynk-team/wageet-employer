"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateField } from "@/components/portal/date-field";
import { WeekExceptionDialog, weekCutoffs, weekPaydays } from "@/components/portal/week-exception";
import { usePortal } from "@/components/portal/store";
import type { Payroll } from "@/lib/types";

export default function EditPayrollPage() {
  const portal = usePortal();
  const router = useRouter();
  const [form, setForm] = useState<Payroll>(portal.payroll);
  const [error, setError] = useState("");
  const [weekOpen, setWeekOpen] = useState(false);
  const [weekStart, setWeekStart] = useState("Monday");
  const [weeks, setWeeks] = useState<{ period: string; payday: string; cutoff: string }[]>([]);

  function save() {
    if (!form.start || !form.end || !form.payday || !form.cutoff) {
      setError("Set the earning period, payday, and withdrawal cut-off.");
      return;
    }
    portal.savePayroll(form);
    router.push("/settings/payroll");
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <p className="text-sm text-[#71717a]">Settings</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Payroll cycle</h1>
      <p className="mt-1 max-w-2xl text-sm text-[#4e6358]">{form.frequency === "Weekly" ? "Choose how each earning week repeats and when withdrawals close." : "Set the recurring schedule. Use a monthly exception when payday or the cut-off changes for one month."}</p>
      <p className="mt-4 text-xs text-[#fa4d01]">Fields marked * are required.</p>
      <section className="mt-4 max-w-3xl rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Pay frequency *</span>
            <select value={form.frequency} onChange={(event) => {
              const frequency = event.target.value as Payroll["frequency"];
              if (frequency === "Weekly") {
                setForm({
                  ...form,
                  frequency,
                  payday: (weekPaydays as readonly string[]).includes(form.payday) ? form.payday : "Day after the week ends",
                  cutoff: (weekCutoffs as readonly string[]).includes(form.cutoff) ? form.cutoff : "2 days before payday",
                });
                return;
              }
              setForm({ ...form, frequency });
            }} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Currency</span>
            <input readOnly value="NGN · Nigerian naira" className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] bg-[#fafafa] px-3" />
          </label>
          {form.frequency === "Weekly" ? (
            <>
              <label className="block text-sm">
                <span className="font-medium text-[#162e25]">Week starts *</span>
                <select className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" value={weekStart} onChange={(event) => setWeekStart(event.target.value)}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => <option key={day}>{day}</option>)}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#162e25]">Week ends</span>
                <input readOnly value={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(weekStart)]} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] bg-[#fafafa] px-3" />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#162e25]">Regular payday *</span>
                <select className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" value={form.payday} onChange={(event) => setForm({ ...form, payday: event.target.value })}>
                  {weekPaydays.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-[#162e25]">Withdrawal cut-off *</span>
                <select className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" value={form.cutoff} onChange={(event) => setForm({ ...form, cutoff: event.target.value })}>
                  {weekCutoffs.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </>
          ) : (
            <>
              <DateLabel label="Earning period starts *"><DateField className="mt-1.5" format="medium" value={form.start} onChange={(start) => setForm({ ...form, start })} /></DateLabel>
              <DateLabel label="Earning period ends *"><DateField className="mt-1.5" format="medium" value={form.end} onChange={(end) => setForm({ ...form, end })} /></DateLabel>
              <DateLabel label="Regular payday *"><DateField className="mt-1.5" format="dayMon" value={form.payday} onChange={(payday) => setForm({ ...form, payday })} /></DateLabel>
              <DateLabel label="Withdrawal cut-off *"><DateField className="mt-1.5" format="cutoff" value={form.cutoff} onChange={(cutoff) => setForm({ ...form, cutoff })} /></DateLabel>
            </>
          )}
        </div>
        {form.frequency === "Weekly" ? (
          <div className="mt-4 rounded-xl border border-[#e4e4e7] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[#162e25]">Weekly preview</h2>
                <p className="mt-1 text-sm text-[#4e6358]">Repeat every week. Weekly earning periods follow the same seven-day schedule.</p>
              </div>
              <button type="button" className="h-9 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => setWeekOpen(true)}>Change one week</button>
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-[#71717a]">Earning week</dt><dd className="font-medium text-[#162e25]">1–6 Dec 2026</dd></div>
              <div><dt className="text-xs text-[#71717a]">Payday</dt><dd className="font-medium text-[#162e25]">{form.payday}</dd></div>
              <div><dt className="text-xs text-[#71717a]">Withdrawal cut-off</dt><dd className="font-medium text-[#162e25]">{form.cutoff}</dd></div>
            </dl>
            {weeks.length === 0 ? <p className="mt-3 text-sm text-[#4e6358]">Regular dates</p> : (
              <ul className="mt-3 divide-y divide-[#f0f2f0]">
                {weeks.map((item) => (
                  <li key={item.period} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span><span className="block font-medium text-[#162e25]">{item.period}</span><span className="text-[#4e6358]">Payday {item.payday} · Cut-off {item.cutoff}</span></span>
                    <button type="button" className="text-[#b42318]" onClick={() => { setWeeks((current) => current.filter((row) => row.period !== item.period)); portal.notify("Regular dates restored."); }}>Restore</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
        <p className="mt-4 text-sm text-[#4e6358]">{form.frequency === "Weekly" ? "The first week can be shorter when the schedule starts midweek." : `Repeats ${form.frequency.toLowerCase()}. Withdrawals close at 23:59 WAT on the cut-off date. This lets you reconcile withdrawals before running payroll.`}</p>
        {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Link href="/settings/payroll" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Back to settings</Link>
          <button type="button" onClick={save} className="h-10 rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">Save cycle</button>
        </div>
      </section>
      <WeekExceptionDialog open={weekOpen} onClose={() => setWeekOpen(false)} onSaved={(value) => { setWeeks((current) => [value, ...current.filter((item) => item.period !== value.period)]); portal.notify("Exception saved."); }} />
    </div>
  );
}

function DateLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block text-sm">
      <span className="font-medium text-[#162e25]">{label}</span>
      {children}
    </div>
  );
}
