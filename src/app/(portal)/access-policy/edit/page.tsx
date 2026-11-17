"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/portal/icons";
import { usePortal } from "@/components/portal/store";
import type { Policy } from "@/lib/types";
import { naira } from "@/lib/mock-data";

export default function EditPolicyPage() {
  return (
    <Suspense>
      <ConfigurePolicy />
    </Suspense>
  );
}

function ConfigurePolicy() {
  const portal = usePortal();
  const router = useRouter();
  const params = useSearchParams();
  const schedule = params.get("schedule") === "1";
  const fromSetup = params.get("from") === "setup";
  const backHref = fromSetup ? "/get-started" : schedule ? "/access-policy?view=scheduled" : "/access-policy";
  const [form, setForm] = useState<Policy>(schedule ? (portal.scheduledPolicy ?? portal.policy) : portal.policy);
  const [errors, setErrors] = useState<Partial<Record<keyof Policy, string>>>({});

  function save() {
    const next: Partial<Record<keyof Policy, string>> = {};
    if (form.percentage < 1 || form.percentage > 70) next.percentage = "Enter 1–70%. Wageet sets the maximum.";
    if (form.perTransaction > form.perDay) next.perTransaction = "Enter an amount up to the daily limit.";
    if (form.perDay > form.perCycle) next.perDay = "The daily limit cannot exceed the pay-cycle limit.";
    if (form.minimum < 1000) next.minimum = "The minimum withdrawal is ₦1,000.";
    if (form.tenureDays < 0) next.tenureDays = "Employment duration cannot be negative.";
    if (form.maxRequests < 1) next.maxRequests = "Allow at least one request per cycle.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const message = fromSetup ? portal.savePolicy(form) : portal.saveScheduledPolicy(form);
    if (message) {
      setErrors({ percentage: message });
      return;
    }
    router.push(backHref);
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-[#162e25]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        {fromSetup ? "Get Started" : "Access policy"}
      </Link>
      <h1 className="mt-3 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Configure access policy</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Set eligibility and withdrawal limits for everyone in this workspace.</p>
      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
            <h2 className="font-semibold text-[#162e25]">Earnings access</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Apply the percentage to confirmed earnings in the current payroll cycle.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <PolicyField label="Employer access percentage" value={`${form.percentage}%`} error={errors.percentage} onChange={(value) => setForm({ ...form, percentage: Number(value.replace(/\D/g, "")) || 0 })} />
              <PolicyField label="Minimum employment duration" hint="Count from the start date. Enter 0 for no minimum." value={`${form.tenureDays} days`} error={errors.tenureDays} onChange={(value) => setForm({ ...form, tenureDays: Number(value.replace(/\D/g, "")) || 0 })} />
            </div>
          </section>
          <section className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
            <h2 className="font-semibold text-[#162e25]">Withdrawal limits</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Set the limits for each employee. The lowest remaining limit applies.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <PolicyField label="Per transaction" value={naira(form.perTransaction)} error={errors.perTransaction} onChange={(value) => setForm({ ...form, perTransaction: Number(value.replace(/\D/g, "")) || 0 })} />
              <PolicyField label="Per day" value={naira(form.perDay)} error={errors.perDay} onChange={(value) => setForm({ ...form, perDay: Number(value.replace(/\D/g, "")) || 0 })} />
              <PolicyField label="Per payroll cycle" value={naira(form.perCycle)} error={errors.perCycle} onChange={(value) => setForm({ ...form, perCycle: Number(value.replace(/\D/g, "")) || 0 })} />
              <PolicyField label="Minimum withdrawal" value={naira(form.minimum)} error={errors.minimum} onChange={(value) => setForm({ ...form, minimum: Number(value.replace(/\D/g, "")) || 0 })} />
              <PolicyField label="Maximum withdrawals per cycle" value={`${form.maxRequests} requests`} error={errors.maxRequests} onChange={(value) => setForm({ ...form, maxRequests: Number(value.replace(/\D/g, "")) || 0 })} />
            </div>
          </section>
          <div className="flex gap-3 rounded-xl bg-[#f4f5ef] px-4 py-3 text-sm text-[#4e6358]">
            <span className="mt-0.5 text-[#162e25]">ⓘ</span>
            <p>
              <span className="font-medium text-[#162e25]">Starts 1 December 2026</span>
              <br />
              Applies next payroll cycle. Employees can withdraw once their earnings, bank details and funding are ready.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Link href={backHref} className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-4 text-sm font-medium text-[#162e25]">Cancel</Link>
            <button type="button" onClick={save} className="inline-flex h-11 items-center rounded-lg bg-[#0f2a1f] px-4 text-xs font-bold text-[#fffff4]">Save policy</button>
          </div>
        </div>
        <div className="space-y-4">
          <aside className="rounded-2xl border border-[#e4e4e7] p-4">
            <h2 className="flex items-center gap-2 font-semibold text-[#162e25]"><Icon name="shield" className="size-4" /> Wageet maximum</h2>
            <p className="mt-3 text-4xl font-semibold text-[#162e25]">70%</p>
            <p className="mt-2 text-sm text-[#4e6358]">Your organisation can set any percentage from 1% up to Wageet’s system-wide cap.</p>
            <p className="mt-3 border-t border-[#f0f2f0] pt-3 text-sm text-[#4e6358]">Applies to {portal.workspaceName}</p>
          </aside>
          <aside className="rounded-2xl border border-[#e4e4e7] p-4">
            <h2 className="font-semibold text-[#162e25]">What an employee can access</h2>
            <p className="mt-2 text-sm text-[#4e6358]">Example: 60% of ₦100,000 confirmed earnings gives ₦60,000. If an employee chooses 40% of that allowance, their personal limit is ₦24,000.</p>
            <Link href="/access-policy" className="mt-4 inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm font-medium text-[#162e25]">Preview impact</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PolicyField({
  label,
  value,
  hint,
  error,
  onChange,
}: {
  label: string;
  value: string;
  hint?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#162e25]">{label}</span>
      <input className="h-12 w-full rounded-lg border border-[#dce4de] bg-white px-4 text-sm text-[#0f2a1f] outline-none focus:border-[#0f2a1f]" value={value} onChange={(event) => onChange(event.target.value)} />
      {hint ? <span className="mt-1 block text-xs text-[#71717a]">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-[#b42318]">{error}</span> : null}
    </label>
  );
}
