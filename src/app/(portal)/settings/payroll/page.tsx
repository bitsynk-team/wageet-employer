"use client";

import Link from "next/link";
import { useState } from "react";
import { DateField, parsePortalDate } from "@/components/portal/date-field";
import { Modal } from "@/components/portal/ui";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { WeekExceptionDialog } from "@/components/portal/week-exception";
import { usePortal } from "@/components/portal/store";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function withYear(value: string) {
  return /\d{4}/.test(value) ? value : `${value} 2026`;
}

function cycleTitle(end: string) {
  const date = parsePortalDate(end);
  if (!date) return end;
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function PayrollSettingsPage() {
  const portal = usePortal();
  const [open, setOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);
  const [exceptions, setExceptions] = useState<{ month: string; payday: string; cutoff: string }[]>([]);
  const [weeks, setWeeks] = useState<{ period: string; payday: string; cutoff: string }[]>([]);
  const [draft, setDraft] = useState({ month: "December 2026", payday: "24 Dec 2026", cutoff: "22 Dec · 23:59 WAT" });
  return (
    <SettingsFrame description="Manage the regular payroll schedule and adjust individual paydays." aside={
      <aside className="space-y-4">
        <section className="rounded-2xl border border-[#e4e4e7] p-4 text-sm text-[#4e6358]">
          <h2 className="font-semibold text-[#162e25]">Payroll timing</h2>
          <p className="mt-2">Cut-offs and paydays use the organisation’s time zone.</p>
        </section>
        <section className="rounded-2xl bg-[#f4f5ef] p-4 text-sm text-[#4e6358]">
          <h2 className="font-semibold text-[#162e25]">Changing one payday</h2>
          <p className="mt-2">An exception changes payment timing for the selected earning period. The regular schedule continues afterwards.</p>
        </section>
      </aside>
    }>
      <section className="rounded-2xl border border-[#e4e4e7] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-[#71717a]">Current payroll cycle</p>
            <h2 className="text-lg font-semibold text-[#162e25]">{cycleTitle(portal.payroll.end)}</h2>
            <p className="text-sm text-[#4e6358]">{portal.payroll.frequency} · {portal.payroll.start} – {portal.payroll.end} · Africa/Lagos</p>
          </div>
          <Link href="/settings/payroll/edit" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm">Edit schedule</Link>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#f8f8f8] px-4 py-3"><dt className="text-xs text-[#71717a]">Earning period starts</dt><dd className="font-medium text-[#162e25]">{portal.payroll.start}</dd></div>
          <div className="rounded-xl bg-[#f8f8f8] px-4 py-3"><dt className="text-xs text-[#71717a]">Earning period ends</dt><dd className="font-medium text-[#162e25]">{portal.payroll.end}</dd></div>
          <div className="rounded-xl bg-[#f8f8f8] px-4 py-3"><dt className="text-xs text-[#71717a]">Withdrawal cut-off</dt><dd className="font-medium text-[#162e25]">{portal.payroll.cutoff}</dd></div>
          <div className="rounded-xl bg-[#f8f8f8] px-4 py-3"><dt className="text-xs text-[#71717a]">Payday</dt><dd className="font-medium text-[#162e25]">{withYear(portal.payroll.payday)}</dd></div>
        </dl>
        <p className="mt-3 text-sm text-[#4e6358]">Payday is {withYear(portal.payroll.payday)}. Withdrawals close on {portal.payroll.cutoff}.</p>
      </section>
      <section className="mt-4 rounded-2xl border border-[#e4e4e7] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#162e25]">Monthly exceptions</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Choose a different payday or withdrawal cut-off for a month.</p>
          </div>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => setOpen(true)}>Add exception</button>
        </div>
        {exceptions.length === 0 ? <p className="mt-4 text-sm text-[#4e6358]">All months follow your regular schedule.</p> : (
          <ul className="mt-4 divide-y divide-[#f0f2f0]">
            {exceptions.map((item) => (
              <li key={item.month} className="flex items-center justify-between py-3 text-sm">
                <span><span className="block font-medium text-[#162e25]">{item.month}</span><span className="text-[#4e6358]">Payday {item.payday} · Cut-off {item.cutoff}</span></span>
                <button type="button" className="text-[#b42318]" onClick={() => { setExceptions((current) => current.filter((row) => row.month !== item.month)); portal.notify("Regular dates restored."); }}>Restore</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-4 rounded-2xl border border-[#e4e4e7] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#162e25]">Weekly exceptions</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Choose a different payday or withdrawal cut-off for one earning week.</p>
          </div>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => setWeekOpen(true)}>Change one week</button>
        </div>
        {weeks.length === 0 ? <p className="mt-4 text-sm text-[#4e6358]">All weeks follow your regular schedule.</p> : (
          <ul className="mt-4 divide-y divide-[#f0f2f0]">
            {weeks.map((item) => (
              <li key={item.period} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span><span className="block font-medium text-[#162e25]">{item.period}</span><span className="text-[#4e6358]">Payday {item.payday} · Cut-off {item.cutoff}</span></span>
                <button type="button" className="text-[#b42318]" onClick={() => { setWeeks((current) => current.filter((row) => row.period !== item.period)); portal.notify("Regular dates restored."); }}>Restore</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <WeekExceptionDialog open={weekOpen} onClose={() => setWeekOpen(false)} onSaved={(value) => { setWeeks((current) => [value, ...current.filter((item) => item.period !== value.period)]); portal.notify("Exception saved."); }} />
      <Modal open={open} title="Add a monthly exception" description="Change dates for one earning period. Other months follow the regular schedule." onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <div className="block text-sm">
            <span className="font-medium text-[#162e25]">Month</span>
            <DateField className="mt-1.5" format="month" value={draft.month} onChange={(month) => setDraft({ ...draft, month })} />
          </div>
          <div className="block text-sm">
            <span className="font-medium text-[#162e25]">Payday</span>
            <DateField className="mt-1.5" format="medium" value={draft.payday} onChange={(payday) => setDraft({ ...draft, payday })} />
          </div>
          <div className="block text-sm">
            <span className="font-medium text-[#162e25]">Withdrawal cut-off</span>
            <DateField className="mt-1.5" format="cutoff" value={draft.cutoff} onChange={(cutoff) => setDraft({ ...draft, cutoff })} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { setExceptions((current) => [draft, ...current.filter((item) => item.month !== draft.month)]); portal.notify("Monthly change saved."); setOpen(false); }}>Save exception</button>
          </div>
        </div>
      </Modal>
    </SettingsFrame>
  );
}
