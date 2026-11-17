"use client";

import Link from "next/link";
import { useState } from "react";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";

const rows = [
  { name: "Ada Okafor", id: "ACM-0018", amount: 12500, adjustment: "−₦1,200", readiness: "Needs review", href: "/transactions/wgt-009142" },
  { name: "Mariam Bello", id: "ACM-0026", amount: 8000, adjustment: "₦0", readiness: "Ready" },
  { name: "Chidi Nwosu", id: "ACM-0034", amount: 6500, adjustment: "₦0", readiness: "Ready" },
  { name: "Femi Balogun", id: "ACM-0051", amount: 5000, adjustment: "₦0", readiness: "Pending", href: "/transactions/wgt-009117" },
];

const tones: Record<string, string> = {
  "Needs review": "bg-[#fbf1e0] text-[#b54708]",
  Ready: "bg-[#e7f6ee] text-[#17803d]",
  Pending: "bg-[#fff4e8] text-[#b54708]",
};

export default function PayrollClosePage() {
  const portal = usePortal();
  const [status, setStatus] = useState("All statuses");
  const visible = rows.filter((row) => status === "All statuses" || row.readiness === status);

  return (
    <div className="px-4 py-4">
      <Link href="/dashboard" className="inline-flex h-9 items-center rounded-lg border border-[#dce4de] bg-white px-3 text-sm font-medium text-[#0f2a1f]">Back to dashboard</Link>
      <h1 className="mt-4 text-[26px] font-semibold text-[#0f2a1f]">Payroll close</h1>
      <p className="mt-1 text-sm text-[#526459]">Reconcile settled employee deductions before freezing the November payroll.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Card label="Payroll cycle" value="November 2026" />
        <Card label="Settled deductions" value={naira(27000)} mint />
        <Card label="Reconciliation" value="2 items to review" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <select className="h-9 rounded-lg border border-[#dce4de] bg-white px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
          {["All statuses", "Needs review", "Ready", "Pending"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-3 text-xs font-bold text-[#fffff4]" onClick={() => portal.notify("Cut-off review saved for November 2026.")}>Review cut-off</button>
      </div>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-[#e7ebe4]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="bg-[#f6f7f4] text-xs text-[#71717a]">
              {["Employee", "Employee ID", "Payout amount", "Adjustment", "Readiness", ""].map((heading) => (
                <th key={heading || "go"} className="px-4 py-3 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-t border-[#f0f2f0]">
                <td className="px-4 py-3 font-medium text-[#0f2a1f]">{row.name}</td>
                <td className="px-4 py-3 text-[#526459]">{row.id}</td>
                <td className="px-4 py-3">{naira(row.amount)}</td>
                <td className="px-4 py-3">{row.adjustment}</td>
                <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[row.readiness]}`}>● {row.readiness}</span></td>
                <td className="px-4 py-3">{row.href ? <Link href={row.href} className="text-[#526459]">›</Link> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value, mint }: { label: string; value: string; mint?: boolean }) {
  return (
    <div className={`rounded-xl px-4 py-3 ${mint ? "bg-[#e7f3ea]" : "bg-[#f6f7f4]"}`}>
      <p className="text-xs text-[#526459]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#0f2a1f]">{value}</p>
    </div>
  );
}
