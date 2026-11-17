"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { naira } from "@/lib/mock-data";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portal = usePortal();
  const record = portal.records.find((item) => item.id === id);
  if (!record) {
    return <div className="p-6 text-sm">That work record was not found. <Link href="/work-records/all" className="font-medium text-[#0f2a1f]">All records</Link></div>;
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <Link href="/work-records/all" className="text-sm font-medium text-[#162e25]">← All records</Link>
      <div className="mt-4 flex items-center gap-2">
        <h1 className="text-xl font-semibold text-[#0f2a1f]">{record.name}</h1>
        <StatusPill value={record.status} />
      </div>
      <p className="mt-1 text-sm text-[#526459]">{portal.workspaceName} · Employer-submitted record</p>
      <dl className="mt-4 divide-y divide-[#f0f2f0] rounded-2xl border border-[#e7ebe4] px-4 text-sm">
        {[
          ["Employee", `${record.name} · ${record.code}`],
          ["Work date", record.date],
          ["Confirmed hours", record.hours],
          ["Confirmed earnings", naira(record.amount)],
          ["Source", record.source],
          ["Record status", record.status],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-3">
            <dt className="text-[#526459]">{label}</dt>
            <dd className="font-medium text-[#0f2a1f]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
