"use client";

import Link from "next/link";
import { OutlineLink, RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";

export default function PayrollSyncPage() {
  const portal = usePortal();
  const held = portal.attention.filter((item) => item.source === "Payroll sync").length;
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Payroll sync</h1>
      <p className="mt-1 text-sm text-[#526459]">Hourly staff · {portal.workspaceName}</p>
      <RecordCard title="Latest delivery">
        <dl className="mt-2">
          <RecordLine label="Connection" value="Payroll API · Connected" />
          <RecordLine label="Last successful delivery" value="13 Nov · 08:05 WAT" />
          <RecordLine label="Earnings confirmed through" value="12 Nov 2026" />
          <RecordLine label="Delivery result" value="10 rows received · 8 posted · 2 held" />
          <RecordLine label="Expected delivery" value="Daily · 08:00 WAT" />
        </dl>
        <RecordNote tone="blue">{held === 0 ? "All received rows have been reviewed." : "Held records do not change the affected employee’s earnings until resolved."}</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records/sync/history">Delivery history</OutlineLink>
          <OutlineLink href="/work-records/sync/connect">Edit schedule</OutlineLink>
          <Link href="/work-records/held" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-bold text-[#fffff4]">Review {held} held rows</Link>
        </RecordActions>
      </RecordCard>
    </div>
  );
}
