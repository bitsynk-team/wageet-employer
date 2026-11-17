"use client";

import { useState } from "react";
import { DarkButton, OutlineLink, RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";

const columns = [
  ["employee_id", "EMP001"],
  ["work_date", "2026-11-11"],
  ["confirmed_hours", "8.0"],
  ["earnings_ngn", "12000"],
];

export default function UploadRecordsPage() {
  const portal = usePortal();
  const [period, setPeriod] = useState("November 2026");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(false);
  const [posted, setPosted] = useState(false);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(csv|xlsx)$/i.test(file.name)) {
      setError("Use a CSV or Excel (.xlsx) file from the spreadsheet template. Nothing was posted.");
      setFileName("");
      return;
    }
    setError("");
    setFileName(file.name);
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Upload work records</h1>
      <p className="mt-1 text-sm text-[#526459]">Contract staff · Upload employer-confirmed work dates, hours and earnings.</p>
      <RecordCard title="Work records file">
        <p className="mt-1 text-sm text-[#526459]">Use one row per employee and work date.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#71717a]">Organisation</p>
            <p className="text-sm font-medium text-[#0f2a1f]">{portal.workspaceName}</p>
          </div>
          <div>
            <p className="text-xs text-[#71717a]">Pay period</p>
            <p className="text-sm font-medium text-[#0f2a1f]">{period}</p>
          </div>
        </div>
        <button type="button" className="mt-4 text-sm font-medium text-[#17803d] underline" onClick={() => setTemplate(true)}>Spreadsheet template ↗</button>
        <label className="mt-4 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#d5ddd6] bg-[#f8f8f8] text-sm text-[#526459]">
          <img src="/icons/records/upload-lg.svg" alt="" className="size-6" />
          <span>{fileName || "Choose a spreadsheet or drop it here"}</span>
          <span className="text-xs">CSV or Excel (.xlsx)</span>
          <input type="file" className="sr-only" accept=".csv,.xlsx,.xls" onChange={(event) => onFile(event.target.files?.[0])} />
        </label>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <RecordNote>Earnings update only after you review and confirm the valid records.</RecordNote>
        {posted ? <p className="mt-3 text-sm text-[#17803d]">{fileName} is ready in Submissions for {period}.</p> : null}
        <RecordActions>
          <OutlineLink href="/work-records/all">Back to records</OutlineLink>
          <button type="button" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm" onClick={() => setPeriod(period === "November 2026" ? "October 2026" : "November 2026")}>Upload a past period</button>
          <DarkButton onClick={() => {
            if (!fileName) {
              setError("Choose a CSV or Excel file.");
              return;
            }
            portal.markRecordsSubmitted();
            portal.notify(`${fileName} posted for ${period}.`);
            setPosted(true);
          }}>Choose file</DarkButton>
        </RecordActions>
      </RecordCard>
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
