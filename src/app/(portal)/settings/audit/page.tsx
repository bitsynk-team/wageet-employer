"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Modal } from "@/components/portal/ui";

const events = [
  { action: "Role assignment", admin: "Employer admin", resource: "Mariam Bello", at: "6 Nov · 14:03", outcome: "Recorded" },
  { action: "Export snapshot", admin: "Payroll manager", resource: "ACM-OCT-2026", at: "6 Nov · 11:24", outcome: "Recorded" },
  { action: "Employment status", admin: "People operations", resource: "Ada Okafor · ACM-0018", at: "6 Nov · 10:12", outcome: "Recorded" },
];

export default function AuditLogPage() {
  const [action, setAction] = useState("All actions");
  const [admin, setAdmin] = useState("All administrators");
  const [date, setDate] = useState("All dates");
  const [selected, setSelected] = useState<(typeof events)[number] | null>(null);
  const rows = useMemo(
    () => events.filter((item) => (action === "All actions" || item.action === action) && (admin === "All administrators" || item.admin === admin) && (date === "All dates" || item.at.startsWith("6 Nov"))),
    [action, admin, date],
  );
  const filtered = action !== "All actions" || admin !== "All administrators" || date !== "All dates";

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href="/settings/organisation" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        Back to settings
      </Link>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Audit log</h1>
      <p className="mt-1 text-sm text-[#4e6358]">See who changed workplace settings and when the change was recorded.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Select value={action} options={["All actions", "Role assignment", "Export snapshot", "Employment status"]} onChange={setAction} />
        <Select value={admin} options={["All administrators", "Employer admin", "Payroll manager", "People operations"]} onChange={setAdmin} />
        <Select value={date} options={["All dates", "6 Nov 2026"]} onChange={setDate} />
        {filtered ? <button type="button" className="h-10 px-2 text-sm text-[#236355]" onClick={() => { setAction("All actions"); setAdmin("All administrators"); setDate("All dates"); }}>Clear filters</button> : null}
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-[#4e6358]">No matching events. Clear a filter to see recorded workspace actions.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-[#e4e4e7]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">{["Action", "Administrator", "Resource", "Recorded at", "Outcome"].map((heading) => <th key={heading} className="px-4 py-2.5 font-medium">{heading}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.action} className="cursor-pointer border-t border-[#f0f2f0]" onClick={() => setSelected(row)}>
                  <td className="px-4 py-3 font-medium text-[#162e25]">{row.action}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{row.admin}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{row.resource}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{row.at}</td>
                  <td className="px-4 py-3 text-[#17803d]">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={Boolean(selected)} title={selected?.action ?? "Event"} description="Recorded in the workspace audit log." onClose={() => setSelected(null)}>
        {selected ? (
          <dl className="space-y-2 text-sm">
            {[["Administrator", selected.admin], ["Resource", selected.resource], ["Recorded at", selected.at], ["Outcome", selected.outcome]].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4"><dt className="text-[#71717a]">{label}</dt><dd className="font-medium text-[#162e25]">{value}</dd></div>
            ))}
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm">
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}
