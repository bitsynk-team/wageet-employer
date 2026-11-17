"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RequiredNote, SetupCard, SetupPage, SupportLine, fieldClass } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";

export default function SubmitRecordsPage() {
  const portal = usePortal();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(csv|xlsx)$/i.test(file.name)) {
      setError("We couldn’t read this file. Use a CSV or XLSX file with the template’s column headings. No records have been saved.");
      return;
    }
    portal.markRecordsSubmitted();
    router.push("/get-started");
  }

  return (
    <SetupPage title="Submit Work Records" subtitle="Upload confirmed work information to update employee earnings.">
      <SetupCard>
        <RequiredNote />
        <p className="mt-6 text-sm font-semibold text-[#0f2a1f]">Work records file</p>
        <p className="mt-1.5 text-xs text-[#526459]">
          Include the employee ID, work date and the required earnings or work information from your payroll records.{" "}
          <a href="/templates/work-records.csv" download="work-records.csv" className="font-semibold text-[#0f2a1f] underline">
            Download work-records template (.csv) ↗
          </a>
        </p>
        <div className="mt-3 flex h-[138px] w-full max-w-[696px] flex-col items-center justify-center rounded-lg border border-dashed border-[#d5ddd6] text-sm font-medium text-[#0f2a1f]">
          Drop your CSV or XLSX file here
          <button type="button" className="mt-3 inline-flex h-10 w-[180px] items-center justify-center rounded-lg bg-[#0f2a1f] text-xs font-bold text-[#fffff4]" onClick={() => fileRef.current?.click()}>
            Choose file
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".csv,.xlsx" className={`${fieldClass} sr-only`} onChange={(event) => onFile(event.target.files?.[0])} />
        {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
      </SetupCard>
      <SupportLine align="left" />
    </SetupPage>
  );
}
