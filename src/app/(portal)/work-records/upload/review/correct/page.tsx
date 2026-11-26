"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";

export default function CorrectAmountPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("6000");
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Correct row 3</h1>
      <p className="mt-1 text-sm text-[#526459]">Sam Adeyemi · EMP003 · Contract staff</p>
      <RecordCard title="Invalid earned amount">
        <RecordNote>An earnings record cannot be negative. Use the approved amount from payroll.</RecordNote>
        <dl className="mt-3">
          <RecordLine label="Work date" value="12 Nov 2026" />
          <RecordLine label="Confirmed hours" value="4.0" />
        </dl>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">Corrected amount (NGN)</span>
          <input className="h-11 w-full max-w-sm rounded-lg border border-[#dce4de] px-3 outline-none" inputMode="numeric" value={amount ? Number(amount).toLocaleString("en-NG") : ""} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} />
        </label>
        <RecordActions>
          <button type="button" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm" onClick={() => router.push("/work-records/upload/review")}>Cancel</button>
          <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => router.push("/work-records/upload/review?fixed=amount")}>Revalidate row</button>
        </RecordActions>
      </RecordCard>
    </div>
  );
}
