"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/portal/ui";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { usePortal } from "@/components/portal/store";

export default function PayrollSettingsPage() {
  const portal = usePortal();
  const [open, setOpen] = useState(false);
  const [exceptions, setExceptions] = useState<{ month: string; payday: string; cutoff: string }[]>([]);
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
            <h2 className="text-lg font-semibold text-[#162e25]">November 2026</h2>
            <p className="text-sm text-[#4e6358]">Monthly · 1–30 November · Africa/Lagos</p>
          </div>
          <Link href="/settings/payroll/edit" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm">Edit schedule</Link>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#f8f8f8] px-4 py-3"><dt className="text-xs text-[#71717a]">Withdrawal cut-off</dt><dd className="font-medium text-[#162e25]">{portal.payroll.cutoff}</dd></div>
          <div className="rounded-xl bg-[#f8f8f8] px-4 py-3"><dt className="text-xs text-[#71717a]">Payday</dt><dd className="font-medium text-[#162e25]">{portal.payroll.payday} 2026</dd></div>
        </dl>
        <p className="mt-3 text-sm text-[#4e6358]">Payday is the last day of the month. Withdrawals close 2 days earlier.</p>
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
      <Modal open={open} title="Add a monthly exception" description="Change dates for one earning period. Other months follow the regular schedule." onClose={() => setOpen(false)}>
        <div className="space-y-3">
          {([["month", "Month"], ["payday", "Payday"], ["cutoff", "Withdrawal cut-off"]] as const).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="font-medium text-[#162e25]">{label}</span>
              <input value={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" />
            </label>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { setExceptions((current) => [draft, ...current.filter((item) => item.month !== draft.month)]); portal.notify("Exception saved."); setOpen(false); }}>Save exception</button>
          </div>
        </div>
      </Modal>
    </SettingsFrame>
  );
}
