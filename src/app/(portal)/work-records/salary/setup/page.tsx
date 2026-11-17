"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DarkButton, OutlineLink, RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";

export default function SalarySetupPage() {
  const portal = usePortal();
  const router = useRouter();
  const [basis, setBasis] = useState("Calendar days");
  const [salary, setSalary] = useState("300000");
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Set up salary accrual</h1>
      <p className="mt-1 text-sm text-[#526459]">Set the salary basis once. Wageet will calculate the earned amount on schedule.</p>
      <RecordCard title="Configuration">
        <dl className="mt-2">
          <RecordLine label="Employee" value="Ada Okafor · EMP001" />
          <RecordLine label="Pay cycle" value="Monthly · 1–30 November" />
        </dl>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">Monthly salary (NGN)</span>
          <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={salary} onChange={(event) => setSalary(event.target.value.replace(/\D/g, ""))} />
        </label>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">Accrual basis</span>
          <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3" value={basis} onChange={(event) => setBasis(event.target.value)}>
            <option>Calendar days</option>
            <option>Scheduled weekdays</option>
          </select>
        </label>
        <dl className="mt-2">
          <RecordLine label="Effective from" value="1 Nov 2026" />
          <RecordLine label="Calculation time" value="00:05 WAT · previous completed day" />
        </dl>
        <RecordNote>For this example, ₦300,000 over 30 calendar days earns ₦10,000 per completed day. Employees’ withdrawal limits still apply.</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records/salary">Back</OutlineLink>
          <DarkButton onClick={() => { portal.notify("Salary accrual started."); router.push("/work-records/salary"); }}>Start accrual</DarkButton>
        </RecordActions>
      </RecordCard>
    </div>
  );
}
