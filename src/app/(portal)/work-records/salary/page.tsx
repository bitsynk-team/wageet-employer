"use client";

import Link from "next/link";
import { OutlineLink, RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";

export default function SalaryAccrualPage() {
  const portal = usePortal();
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Salary accrual</h1>
      <p className="mt-1 text-sm text-[#526459]">Fixed salaries · {portal.workspaceName}</p>
      <RecordCard title="Accrual schedule">
        <dl className="mt-2">
          <RecordLine label="Employee" value="Ada Okafor · EMP001" />
          <RecordLine label="Monthly salary" value="₦300,000" />
          <RecordLine label="Earnings confirmed through" value="12 Nov 2026" />
          <RecordLine label="November earnings" value="₦120,000" />
          <RecordLine label="Accrual basis" value="Calendar days" />
          <RecordLine label="Next calculation" value="14 Nov · 00:05 WAT" />
        </dl>
        <RecordNote tone="blue">Salary changes, unpaid leave and exits can be reviewed against the affected work dates.</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records">Work records</OutlineLink>
          <OutlineLink href="/work-records/attention/leave">Review adjustment</OutlineLink>
          <Link href="/work-records/salary/setup" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-bold text-[#fffff4]">Edit setup</Link>
        </RecordActions>
      </RecordCard>
    </div>
  );
}
