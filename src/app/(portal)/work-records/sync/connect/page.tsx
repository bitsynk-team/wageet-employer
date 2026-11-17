"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DarkButton, OutlineLink, RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";

export default function ConnectPayrollPage() {
  const portal = usePortal();
  const router = useRouter();
  const [cadence, setCadence] = useState("Daily · 08:00 WAT");
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Connect payroll</h1>
      <p className="mt-1 text-sm text-[#526459]">Choose the approved records to import and when Wageet should expect them.</p>
      <RecordCard title="Configuration">
        <dl className="mt-2">
          <RecordLine label="Source name" value="Payroll API" />
          <RecordLine label="Connection method" value="API · secure token" />
          <RecordLine label="Payroll endpoint" value="https://payroll.example/approved" />
          <RecordLine label="Access token" value="••••••••••••••••" />
          <RecordLine label="Employee group" value="Hourly staff" />
        </dl>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block font-medium">Expected delivery</span>
          <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3" value={cadence} onChange={(event) => setCadence(event.target.value)}>
            <option>Daily · 08:00 WAT</option>
            <option>Weekly · Friday, 08:00 WAT</option>
          </select>
        </label>
        <RecordNote>Map the Wageet employee ID, work date, approved hours and earned amount. Unapproved rows stay out of earnings.</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records/sync">Back</OutlineLink>
          <DarkButton onClick={() => { portal.notify(`Payroll schedule set to ${cadence}.`); router.push("/work-records/sync"); }}>Connect payroll</DarkButton>
        </RecordActions>
      </RecordCard>
    </div>
  );
}
