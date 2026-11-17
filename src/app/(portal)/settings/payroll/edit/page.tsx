"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateField } from "@/components/portal/date-field";
import { usePortal } from "@/components/portal/store";
import type { Payroll } from "@/lib/types";

export default function EditPayrollPage() {
  const portal = usePortal();
  const router = useRouter();
  const [form, setForm] = useState<Payroll>(portal.payroll);
  const [error, setError] = useState("");

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
      <p className="mt-1 max-w-2xl text-sm text-[#4e6358]">Set the recurring schedule. Use a monthly exception when payday or the cut-off changes for one month.</p>
      <p className="mt-4 text-xs text-[#fa4d01]">Fields marked * are required.</p>
      <section className="mt-4 max-w-3xl rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Pay frequency *</span>
            <select value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value as Payroll["frequency"] })} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Currency</span>
            <input readOnly value="NGN · Nigerian naira" className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] bg-[#fafafa] px-3" />
          </label>
          <DateLabel label="Earning period starts *"><DateField className="mt-1.5" format="medium" value={form.start} onChange={(start) => setForm({ ...form, start })} /></DateLabel>
          <DateLabel label="Earning period ends *"><DateField className="mt-1.5" format="medium" value={form.end} onChange={(end) => setForm({ ...form, end })} /></DateLabel>
          <DateLabel label="Regular payday *"><DateField className="mt-1.5" format="dayMon" value={form.payday} onChange={(payday) => setForm({ ...form, payday })} /></DateLabel>
          <DateLabel label="Withdrawal cut-off *"><DateField className="mt-1.5" format="cutoff" value={form.cutoff} onChange={(cutoff) => setForm({ ...form, cutoff })} /></DateLabel>
        </div>
        <p className="mt-4 text-sm text-[#4e6358]">Repeats {form.frequency.toLowerCase()}. Withdrawals close at 23:59 WAT on the cut-off date. This lets you reconcile withdrawals before running payroll.</p>
        {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Link href="/settings/payroll" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Back to settings</Link>
          <button type="button" onClick={save} className="h-10 rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">Save cycle</button>
        </div>
      </section>
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
