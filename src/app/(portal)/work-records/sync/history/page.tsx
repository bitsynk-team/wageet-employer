"use client";

import Link from "next/link";

const rows = [
  { when: "14 Nov · 08:00", through: "12 Nov 2026", status: "Overdue", action: "Review delivery", href: "/work-records/held" },
  { when: "13 Nov · 08:00", through: "12 Nov 2026", status: "Received", action: "View results", href: "/work-records/sync" },
];

export default function DeliveryHistoryPage() {
  return (
    <div className="px-4 py-4">
      <Link href="/work-records" className="text-sm font-medium text-[#162e25]">← Work records</Link>
      <h1 className="mt-4 text-[22px] font-semibold text-[#0f2a1f]">Delivery history</h1>
      <p className="mt-1 text-sm text-[#526459]">Payroll API · Scheduled deliveries and recovery</p>
      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e6e8e3]">
        <h2 className="px-4 py-3 font-semibold text-[#0f2a1f]">Recent payroll deliveries</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
              {["Expected (WAT)", "Last confirmed work date", "Status", "Action"].map((heading) => (
                <th key={heading} className="px-4 py-2 font-medium">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.when} className="border-t border-[#f0f2f0]">
                <td className="px-4 py-3">{row.when}</td>
                <td className="px-4 py-3">{row.through}</td>
                <td className="px-4 py-3"><span className={row.status === "Overdue" ? "text-[#b54708]" : "text-[#17803d]"}>{row.status}</span></td>
                <td className="px-4 py-3"><Link href={row.href} className="font-medium text-[#1a6849]">{row.action} →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
