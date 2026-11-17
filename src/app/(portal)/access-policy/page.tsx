"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { naira } from "@/lib/mock-data";
import type { Policy } from "@/lib/types";
import { Modal } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

export default function AccessPolicyPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#526459]">Loading policy…</p>}>
      <PolicyView />
    </Suspense>
  );
}

function PolicyView() {
  const portal = usePortal();
  const initial = useSearchParams().get("view") === "scheduled" ? "scheduled" : "current";
  const [tab, setTab] = useState<"current" | "scheduled">(initial);
  const [cancelOpen, setCancelOpen] = useState(false);
  const scheduled = portal.scheduledPolicy;
  const viewing = tab === "scheduled" && scheduled ? scheduled : portal.policy;
  const rules = ruleRows(viewing);

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Access policy</h1>
          <p className="mt-1 text-sm text-[#4e6358]">
            {tab === "scheduled"
              ? "Review the policy that will take effect at the start of the next payroll cycle."
              : "Review the withdrawal rules that apply to employees in this workspace."}
          </p>
        </div>
        <Link href={tab === "scheduled" ? "/access-policy/edit?schedule=1" : "/access-policy/edit"} className="inline-flex h-10 items-center rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">
          {tab === "scheduled" ? "Edit scheduled policy" : "Edit policy"}
        </Link>
      </div>
      <div className="mt-5 flex gap-6 border-b border-[#e7e9e9]">
        {([["current", "Current policy"], ["scheduled", "Scheduled policy"]] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={`-mb-px border-b-2 pb-2 text-sm ${tab === id ? "border-[#153a2b] font-medium text-[#162e25]" : "border-transparent text-[#71717a]"}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === "scheduled" && !scheduled ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#e4e4e7] px-5 py-10 text-center">
          <p className="font-medium text-[#162e25]">No scheduled policy</p>
          <p className="mt-1 text-sm text-[#4e6358]">The current rules stay in place until you schedule a change for the next payroll cycle.</p>
        </div>
      ) : (
        <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#e7f3ee]">
                  <img src="/icons/shield.svg" alt="" className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-[#162e25]">{portal.workspaceName}</p>
                  <p className="text-sm text-[#4e6358]">
                    {tab === "scheduled" ? "Starts 1 December 2026 · Next payroll cycle · Africa/Lagos" : "Current payroll cycle · 1–30 November 2026 · Africa/Lagos"}
                  </p>
                </div>
              </div>
              <span className={`inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-[11px] font-medium ${tab === "scheduled" ? "bg-[#eef4ff] text-[#2e5aac]" : "bg-[#e7f6ee] text-[#17803d]"}`}>
                <span className="size-1.5 rounded-full bg-current" />
                {tab === "scheduled" ? "Scheduled" : "Active"}
              </span>
            </div>
            {tab === "scheduled" ? (
              <button type="button" className="mt-3 text-sm font-medium text-[#b42318]" onClick={() => setCancelOpen(true)}>Cancel schedule</button>
            ) : null}
            <h2 className="mt-5 font-semibold text-[#162e25]">Withdrawal rules</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Applies to each eligible employee.</p>
            <dl className="mt-2">
              {rules.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-t border-[#f0f2f0] py-3 text-sm">
                  <dt className="text-[#4e6358]">{label}</dt>
                  <dd className="font-medium text-[#162e25]">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-[#17803d]">Wageet caps the employer’s percentage at 70%.</p>
          </section>
          <div className="space-y-4">
            <article className="rounded-2xl border border-[#e4e4e7] p-4">
              <h2 className="font-semibold text-[#162e25]">Employee impact</h2>
              <p className="mt-2 text-sm text-[#4e6358]">See how confirmed earnings, personal limits and earlier withdrawals affect the next request.</p>
              <Link href="/access-policy/preview" className="mt-4 inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">Preview employee view</Link>
            </article>
            <article className="rounded-2xl border border-[#e4e4e7] p-4">
              <h2 className="font-semibold text-[#162e25]">Withdrawal checks</h2>
              <dl className="mt-3 space-y-3 text-sm">
                {[
                  ["Confirmed earnings", "Only employer-confirmed earnings count."],
                  ["Employee eligibility", "Active employment, verified identity, a linked workspace and the required tenure."],
                  ["Receiving account", "A verified employer-provided bank account is required."],
                  ["Authorisation", "The employee authorises each withdrawal with this workspace’s PIN."],
                ].map(([label, body]) => (
                  <div key={label}>
                    <dt className="font-medium text-[#162e25]">{label}</dt>
                    <dd className="text-[#4e6358]">{body}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-3 rounded-xl bg-[#f4f5ef] px-4 py-3 text-sm text-[#4e6358]">
        <img src="/icons/records/clock.svg" alt="" className="mt-0.5 size-4" />
        <p>
          <span className="font-medium text-[#162e25]">Payroll cut-off</span>
          <br />
          Withdrawals pause at 23:59 WAT on the last withdrawal date set in Payroll Cycle. Daily limits reset at midnight in Africa/Lagos.
        </p>
      </div>
      <Modal open={cancelOpen} title="Cancel this schedule?" description="The current policy stays in place. Employees keep the active withdrawal rules." onClose={() => setCancelOpen(false)}>
        <div className="flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setCancelOpen(false)}>Keep schedule</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { portal.cancelSchedule(); setCancelOpen(false); }}>Cancel schedule</button>
        </div>
      </Modal>
    </div>
  );
}

function ruleRows(policy: Policy): [string, string][] {
  return [
    ["Employer access percentage", `${policy.percentage}%`],
    ["Minimum employment duration", `${policy.tenureDays} days`],
    ["Per transaction", naira(policy.perTransaction)],
    ["Per day", naira(policy.perDay)],
    ["Per payroll cycle", naira(policy.perCycle)],
    ["Minimum withdrawal", naira(policy.minimum)],
    ["Maximum withdrawals per cycle", `${policy.maxRequests} requests`],
  ];
}
