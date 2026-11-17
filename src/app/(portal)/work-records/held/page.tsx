"use client";

import Link from "next/link";
import { OutlineLink } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";

const rows = [
  { id: "emp020", who: "EMP020", reason: "No matching employee ID", date: "12 Nov 2026", action: "Match employee", href: "/work-records/attention/match" },
  { id: "tomi", who: "Tomi Adebayo · EMP002", reason: "Changed amount on an existing record", date: "12 Nov 2026", action: "Compare amounts", href: "/work-records/attention/conflict" },
];

export default function HeldRecordsPage() {
  const portal = usePortal();
  const open = rows.filter((row) => portal.attention.some((item) => item.id === row.id));
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Records needing attention</h1>
      <p className="mt-1 text-sm text-[#526459]">Payroll API · Delivery received 13 Nov at 08:05 WAT</p>
      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e6e8e3]">
        <div className="px-4 py-3">
          <h2 className="font-semibold text-[#0f2a1f]">Held records</h2>
          <p className="text-sm text-[#526459]">Approved records post automatically. Review the held items below.</p>
        </div>
        {open.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-[#17803d]">All held records have been resolved.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                {["Employee or source ID", "Reason held", "Work date", "Action"].map((heading) => (
                  <th key={heading} className="px-4 py-2 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {open.map((row) => (
                <tr key={row.id} className="border-t border-[#f0f2f0]">
                  <td className="px-4 py-3 font-medium">{row.who}</td>
                  <td className="px-4 py-3">{row.reason}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3"><Link href={row.href} className="inline-flex h-9 items-center rounded-lg border border-[#e4e4e7] px-3">{row.action}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-end px-4 py-3">
          <OutlineLink href="/work-records">Back to work records</OutlineLink>
        </div>
      </section>
    </div>
  );
}
