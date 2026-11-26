"use client";

import Link from "next/link";
import { StatusPill } from "@/components/portal/ui";

const rows = [
  ["Ada Okafor", "EMP001", "11 Nov 2026", "8.0", "₦12,000", "Confirmed"],
  ["Tomi Adebayo", "EMP002", "11 Nov 2026", "6.0", "₦9,000", "Confirmed"],
  ["—", "—", "10 Nov 2026", "—", "—", "Excluded"],
];

export default function SubmissionDetailsPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Submission details</h1>
      <p className="mt-1 text-sm text-[#526459]">November work records.xlsx · Acme Foods Ltd · November 2026</p>
      <p className="mt-3 text-sm text-[#17803d]">2 records confirmed. ₦21,000 added to earnings. The duplicate was excluded.</p>
      <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-[#e6e8e3] [&_th]:whitespace-nowrap">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
              {["Employee", "Employee ID", "Work date", "Hours", "Earnings", "Outcome"].map((heading) => <th key={heading} className="px-4 py-2 font-medium">{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-t border-[#f0f2f0]">
                {row.map((cell, index) => <td key={index} className="px-4 py-3">{index === 5 && cell === "Confirmed" ? <StatusPill value={cell} /> : cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Link href="/work-records/all?view=submissions" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm">All submissions</Link>
        <Link href="/work-records/all" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white">View all records</Link>
      </div>
    </div>
  );
}
