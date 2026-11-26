"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { naira } from "@/lib/mock-data";
import { usePortal } from "@/components/portal/store";

const earnings = 100000;

type Scenario = {
  id: string;
  label: string;
  share: string;
  accessible: number;
  withdrawn: number;
  pending: number;
  used: string;
  next: number | null;
  note: string;
  controls: string;
};

export default function PolicyPreviewPage() {
  const portal = usePortal();
  const allowance = Math.round(earnings * (portal.policy.percentage / 100));
  const scenarios: Scenario[] = [
    { id: "full", label: "Full employer allowance", share: "100%", accessible: allowance, withdrawn: 24400, pending: 0, used: "1", next: allowance - 24400, note: "The remaining accessible earnings set the maximum for this withdrawal.", controls: "No lower limits set" },
    { id: "personal", label: "Personal limits locked", share: "40%", accessible: Math.round(allowance * 0.4), withdrawn: 0, pending: 0, used: "0", next: 12000, note: "The employee’s locked ₦12,000 single-transfer limit applies.", controls: "₦12,000 per transfer · ₦20,000 per day" },
    { id: "pending", label: "Withdrawal pending", share: "100%", accessible: allowance, withdrawn: 24400, pending: 5000, used: "1", next: allowance - 24400 - 5000, note: "The remaining accessible earnings set the maximum for this withdrawal.", controls: "No lower limits set" },
    { id: "missing", label: "Receiving account missing", share: "100%", accessible: allowance, withdrawn: 24400, pending: 0, used: "1", next: null, note: "Withdrawals are paused until the employer verifies the receiving account.", controls: "No lower limits set" },
    { id: "cutoff", label: "Payroll cut-off reached", share: "100%", accessible: allowance, withdrawn: 24400, pending: 0, used: "1", next: null, note: "The withdrawal window has closed. The next payroll cycle opens a new window.", controls: "No lower limits set" },
    { id: "count", label: "Withdrawal count reached", share: "100%", accessible: allowance, withdrawn: 24400, pending: 0, used: "3 requests", next: null, note: "The employee has used all withdrawals for this payroll cycle.", controls: "No lower limits set" },
    { id: "daily", label: "Daily limit partly used", share: "100%", accessible: allowance, withdrawn: 20000, pending: 0, used: "1", next: 40000, note: "The remaining accessible earnings set the maximum for this withdrawal.", controls: "No lower limits set" },
    { id: "hired", label: "Recently hired employee", share: "100%", accessible: allowance, withdrawn: 24400, pending: 0, used: "1", next: null, note: "This employee joined 5 days ago and has not reached the required tenure.", controls: "No lower limits set" },
  ];
  const [scenario, setScenario] = useState(scenarios[0]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const rows = [
    ["Confirmed earnings", naira(earnings)],
    ["Employer allowance", naira(allowance)],
    ["Employee’s share of the allowance", scenario.share],
    ["Accessible before withdrawals", naira(scenario.accessible)],
    ["Already withdrawn this cycle", naira(scenario.withdrawn)],
    ["Pending withdrawals", naira(scenario.pending)],
    ["Withdrawals used this cycle", scenario.used],
  ];

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href="/access-policy" className="inline-flex items-center gap-2 text-sm font-medium text-[#236355]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        Access policy
      </Link>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Employee impact preview</h1>
      <p className="mt-1 text-sm text-[#4e6358]">See how the selected policy applies to an example employee in {portal.workspaceName}.</p>

      <div className="mt-5 flex min-h-[68px] flex-col gap-3 rounded-[10px] border border-[#dfe5df] bg-white px-5 py-3 sm:flex-row sm:items-center sm:gap-10 sm:py-0">
        <span className="text-sm font-medium text-[#112c23]">Example scenario</span>
        <div ref={menuRef} className="relative w-full sm:w-[310px]">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((current) => !current)}
            className="flex h-10 w-full items-center justify-between rounded-[7px] border border-[#dfe5df] bg-white px-3 text-sm font-medium text-[#112c23]"
          >
            {scenario.label}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M4.5 6.5L8 9.5L11.5 6.5" stroke="#304B3E" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {open ? (
            <ul id={listId} role="listbox" className="absolute top-11 z-20 w-full rounded-lg border border-[#dfe5df] bg-white px-[5px] py-1.5 shadow-[0_5px_16px_rgba(10,31,20,0.15)]">
              {scenarios.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.id === scenario.id}
                    className="flex h-[37px] w-full items-center rounded px-2.5 text-left text-sm text-[#112c23] hover:bg-[#f4f6f3]"
                    onClick={() => {
                      setScenario(item);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
          <h2 className="font-semibold text-[#162e25]">How the amount is calculated</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Sample pay cycle <span className="font-medium text-[#162e25]">November 2026</span></p>
          <dl className="mt-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-t border-[#eef1ee] py-3 text-sm">
                <dt className="text-[#4e6358]">{label}</dt>
                <dd className="font-medium text-[#162e25]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl bg-[#e7f3ee] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-[#162e25]">
              <img src="/icons/shield.svg" alt="" className="size-4" />
              Maximum next withdrawal
            </p>
            {scenario.next !== null ? <p className="mt-2 text-[32px] leading-9 font-semibold tracking-[-0.4px] text-[#162e25]">{naira(scenario.next)}</p> : null}
            <p className="mt-2 text-sm text-[#4e6358]">{scenario.note}</p>
            <Link href="/employees/tomi" className="mt-3 inline-flex text-sm font-medium text-[#1a6849]">Review Tomi’s bank details</Link>
          </section>
          <section className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
            <h2 className="font-semibold text-[#162e25]">Other limits applied</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {[["Per transaction", naira(portal.policy.perTransaction)], ["Per day", naira(portal.policy.perDay)], ["Per payroll cycle", naira(portal.policy.perCycle)]].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-[#4e6358]">{label}</dt>
                  <dd className="font-medium text-[#162e25]">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 border-t border-[#eef1ee] pt-3">
              <h3 className="text-sm font-semibold text-[#162e25]">Personal controls</h3>
              <p className="mt-1 text-sm text-[#4e6358]">{scenario.controls}</p>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-4 flex gap-2 rounded-xl bg-[#f4f6f3] px-4 py-3">
        <img src="/icons/records/info.svg" alt="" className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#162e25]">Personal settings stay with the employee</p>
          <p className="mt-1 text-sm text-[#4e6358]">Employees can lower their share, single-transfer limit or daily limit, and lock those choices for 7, 14 or 30 days. A lock prevents edits until it ends. A lower employer limit still applies.</p>
        </div>
      </section>
      <p className="mt-4 text-sm text-[#4e6358]">The examples use confirmed earnings. Daily limits reset at midnight in Africa/Lagos. Any applicable fee is shown before the employee confirms with their workspace PIN.</p>
    </div>
  );
}
