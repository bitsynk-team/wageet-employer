"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { OutlineLink, RecordActions, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";
import { useRouter } from "next/navigation";

const columns = [
  ["employee_id", "EMP001"],
  ["work_date", "2026-11-11"],
  ["confirmed_hours", "8.0"],
  ["earnings_ngn", "12000"],
];

export default function UploadRecordsPage() {
  const portal = usePortal();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [invalid, setInvalid] = useState(false);
  const [template, setTemplate] = useState(false);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(csv|xlsx)$/i.test(file.name)) {
      setInvalid(true);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setInvalid(false);
    router.push("/work-records/upload/review");
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Upload work records</h1>
      <p className="mt-1 text-sm text-[#526459]">{invalid ? "Upload employer-submitted work dates, hours and earnings for a payroll period." : "Contract staff · Upload employer-confirmed work dates, hours and earnings."}</p>
      <section className="mt-4 max-w-[760px] rounded-2xl border border-[#e6e8e3] bg-[#f7f8f6] p-5">
        <h2 className="text-base font-semibold text-[#0f2a1f]">Work records file</h2>
        <p className="mt-1 text-sm text-[#526459]">Use one row per employee and work date.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Organisation</span>
            <input readOnly value={portal.workspaceName} className="mt-1.5 h-11 w-full rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm text-[#162e25]" />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Pay period</span>
            <input readOnly value="November 2026" className="mt-1.5 h-11 w-full rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm text-[#162e25]" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="text-sm font-medium text-[#17803d]" onClick={() => setTemplate(true)}>{invalid ? "View spreadsheet template ↗" : "Spreadsheet template ↗"}</button>
          <Link href="/work-records/upload/past" className="text-sm font-medium text-[#17803d]">Upload a past period</Link>
        </div>
        <div
          className="mt-3 flex flex-col items-center rounded-xl border border-dashed border-[#d5ddd6] bg-white px-4 py-6 text-center"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); onFile(event.dataTransfer.files?.[0]); }}
        >
          <img src="/icons/records/upload-lg.svg" alt="" className="size-6" />
          <p className="mt-2 text-sm font-semibold text-[#162e25]">Choose a spreadsheet or drop it here</p>
          <p className="mt-0.5 text-xs text-[#71717a]">CSV or Excel (.xlsx)</p>
          <button type="button" className="mt-3 inline-flex h-9 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm text-[#162e25]" onClick={() => fileRef.current?.click()}>{invalid ? "Choose another file" : "Choose file"}</button>
          <input ref={fileRef} type="file" className="sr-only" accept=".csv,.xlsx" onChange={(event) => onFile(event.target.files?.[0])} />
        </div>
        {invalid ? <p className="mt-2 text-sm text-[#b42318]">File could not be read. Check the template headings and upload the file again.</p> : null}
        <RecordNote>Earnings update only after you review and confirm the valid records.</RecordNote>
        <div className="mt-4">
          <OutlineLink href="/work-records">Back to records</OutlineLink>
        </div>
      </section>
      {template ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={() => setTemplate(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0f2a1f]">Work records template</h2>
              <button type="button" aria-label="Close" onClick={() => setTemplate(false)}>×</button>
            </div>
            <p className="mt-1 text-sm text-[#526459]">Use the column names below in your CSV or Excel file.</p>
            <dl className="mt-3 rounded-xl border border-[#eef0ea] px-3">
              {columns.map(([label, value]) => <RecordLine key={label} label={label} value={value} />)}
            </dl>
            <RecordNote>Use the Wageet employee ID for this organisation. Each employee and work date must be unique.</RecordNote>
            <RecordActions>
              <button type="button" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] px-4 text-sm" onClick={() => setTemplate(false)}>Back to upload</button>
              <a href="/templates/work-records.csv" download="work-records.csv" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-4 text-sm font-bold text-[#fffff4]">
                <img src="/icons/records/download.svg" alt="" className="size-4 brightness-0 invert" />
                Download CSV template
              </a>
            </RecordActions>
          </div>
        </div>
      ) : null}
    </div>
  );
}
