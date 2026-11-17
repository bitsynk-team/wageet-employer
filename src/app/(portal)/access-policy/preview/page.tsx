"use client";

import Link from "next/link";
import { useState } from "react";
import { naira } from "@/lib/mock-data";
import { usePortal } from "@/components/portal/store";

const scenarios = [
  { id: "full", label: "Full employer allowance", share: "100%", accessible: 60000, withdrawn: 24400, pending: 0, used: 1, next: 35600, note: "The remaining accessible earnings set the maximum for this withdrawal.", controls: "No lower limits set" },
  { id: "personal", label: "Personal limit", share: "40%", accessible: 24000, withdrawn: 0, pending: 0, used: 0, next: 24000, note: "The employee lowered their share of the employer allowance to 40%.", controls: "Personal share locked for 14 days" },
  { id: "missing", label: "Missing account", share: "100%", accessible: 60000, withdrawn: 0, pending: 0, used: 0, next: 0, note: "A verified employer-provided bank account is required before a withdrawal can be sent.", controls: "No lower limits set" },
];

export default function PolicyPreviewPage() {
  const portal = usePortal();
  const [scenario, setScenario] = useState(scenarios[0]);
  const allowance = Math.round(100000 * (portal.policy.percentage / 100));
  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href="/access-policy" className="inline-flex items-center gap-2 text-sm font-medium text-[#236355]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        Access policy
      </Link>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Employee impact preview</h1>
      <p className="mt-1 text-sm text-[#4e6358]">See how the selected policy applies to an example employee in {portal.workspaceName}.</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Example scenario</span>
            <select value={scenario.id} onChange={(event) => setScenario(scenarios.find((item) => item.id === event.target.value) ?? scenarios[0])} className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm">
              {scenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <h2 className="mt-5 font-semibold text-[#162e25]">How the amount is calculated</h2>
          <dl className="mt-2">
            {[
              ["Sample pay cycle", "November 2026"],
              ["Confirmed earnings", naira(100000)],
              ["Employer allowance", naira(allowance)],
              ["Employee’s share of the allowance", scenario.share],
              ["Accessible before withdrawals", naira(scenario.id === "full" ? allowance : scenario.accessible)],
              ["Already withdrawn this cycle", naira(scenario.withdrawn)],
              ["Pending withdrawals", naira(scenario.pending)],
              ["Withdrawals used this cycle", String(scenario.used)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-t border-[#f0f2f0] py-3 text-sm">
                <dt className="text-[#4e6358]">{label}</dt>
                <dd className="font-medium text-[#162e25]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-2 flex items-center justify-between rounded-xl bg-[#f4f5ef] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[#162e25]">Maximum next withdrawal</p>
              <p className="text-sm text-[#4e6358]">{scenario.note}</p>
            </div>
            <p className="text-lg font-semibold text-[#162e25]">{naira(scenario.id === "full" ? Math.max(allowance - scenario.withdrawn, 0) : scenario.next)}</p>
          </div>
        </section>
        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#e4e4e7] p-4">
            <h2 className="font-semibold text-[#162e25]">Other limits applied</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {[["Per transaction", naira(portal.policy.perTransaction)], ["Per day", naira(portal.policy.perDay)], ["Per payroll cycle", naira(portal.policy.perCycle)]].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-[#4e6358]">{label}</dt>
                  <dd className="font-medium text-[#162e25]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-2xl border border-[#e4e4e7] p-4 text-sm text-[#4e6358]">
            <h2 className="font-semibold text-[#162e25]">Personal controls</h2>
            <p className="mt-2 font-medium text-[#162e25]">{scenario.controls}</p>
            <p className="mt-2">Employees can lower their share, single-transfer limit or daily limit, and lock those choices for 7, 14 or 30 days. A lock prevents edits until it ends. A lower employer limit still applies.</p>
          </section>
        </aside>
      </div>
      <p className="mt-4 text-sm text-[#4e6358]">The examples use confirmed earnings. Daily limits reset at midnight in Africa/Lagos. Any applicable fee is shown before the employee confirms with their workspace PIN.</p>
    </div>
  );
}
