"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { OutlineLink, RecordActions, RecordCard, RecordNote } from "@/components/portal/records-ui";

export default function PastUploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(csv|xlsx)$/i.test(file.name)) return;
    router.push("/work-records/upload/review?period=past");
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Upload past-period records</h1>
      <p className="mt-1 text-sm text-[#526459]">Keep the original work dates when submitting a previous payroll period.</p>
      <RecordCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#71717a]">Original payroll period</p>
            <p className="text-sm font-medium text-[#0f2a1f]">October 2026 · Frozen</p>
          </div>
          <div>
            <p className="text-xs text-[#71717a]">Posting period</p>
            <p className="text-sm font-medium text-[#0f2a1f]">November 2026 · Open</p>
          </div>
        </div>
        <RecordNote>The frozen October snapshot is preserved. Confirmed records post to the open November cycle.</RecordNote>
        <div className="mt-4">
          <p className="text-sm font-medium text-[#0f2a1f]">Upload a CSV or Excel file</p>
          <p className="mt-1 text-sm text-[#526459]">Include the original work date for each employee.</p>
        </div>
        <input ref={fileRef} type="file" accept=".csv,.xlsx" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
        <RecordActions>
          <OutlineLink href="/work-records/upload">Back</OutlineLink>
          <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-bold text-[#fffff4]" onClick={() => fileRef.current?.click()}>Choose file</button>
        </RecordActions>
      </RecordCard>
    </div>
  );
}
