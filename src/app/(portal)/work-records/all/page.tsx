"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DateField } from "@/components/portal/date-field";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";
import type { WorkRecord } from "@/lib/types";
import { cn } from "cn";

const submissions = [
  { name: "November work records.xlsx", period: "November 2026", submitted: "11 Nov 2026", records: 3, status: "Confirmed" },
  { name: "Operations payroll.csv", period: "November 2026", submitted: "10 Nov 2026", records: 3, status: "Confirmed" },
  { name: "November correction", period: "November 2026", submitted: "9 Nov 2026", records: 1, status: "Confirmed" },
];

export default function AllRecordsPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#526459]">Loading work records…</p>}>
      <RecordsDirectory />
    </Suspense>
  );
}

function RecordsDirectory() {
  const portal = usePortal();
  const params = useSearchParams();
  const [tab, setTab] = useState<"records" | "submissions">("records");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Newest first");
  const [selected, setSelected] = useState<WorkRecord | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [addOpen, setAddOpen] = useState(params.get("add") === "1");
  const [exportOpen, setExportOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const rows = useMemo(() => {
    const filtered = portal.records.filter((record) => {
      const haystack = `${record.name} ${record.code}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (status !== "All statuses" && record.status !== status) return false;
      return true;
    });
    return [...filtered].sort((a, b) => (sort === "Name A–Z" ? a.name.localeCompare(b.name) : sort === "Oldest first" ? a.iso.localeCompare(b.iso) : b.iso.localeCompare(a.iso)));
  }, [portal.records, query, sort, status]);

  function exportRows(kind: "csv" | "xls") {
    const header = ["Employee", "Employee ID", "Work date", "Hours", "Earnings", "Status"];
    const body = rows.map((record) => [record.name, record.code, record.date, record.hours, String(record.amount), record.status]);
    if (kind === "csv") {
      download("work-records.csv", [header, ...body].map((line) => line.map((cell) => `"${cell}"`).join(",")).join("\n"), "text/csv");
    } else {
      const table = `<table><tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr>${body.map((line) => `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
      download("work-records.xls", table, "application/vnd.ms-excel");
    }
    setNotice(kind === "csv" ? "Export prepared · work-records.csv" : "Export prepared · work-records.xls");
    setExportOpen(false);
  }

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#162e25]">Work records</h1>
          <p className="text-sm text-[#526459]">Review the work and earnings your organisation has submitted.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm" onClick={() => setExportOpen((open) => !open)}>
              <img src="/icons/records/download.svg" alt="" className="size-4" />
              Export
            </button>
            {exportOpen ? (
              <ul className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-[#e7e9e9] bg-white p-1 text-sm shadow-lg">
                <li><button type="button" className="w-full rounded px-3 py-2 text-left hover:bg-[#f6f7f4]" onClick={() => exportRows("csv")}>Records CSV</button></li>
                <li><button type="button" className="w-full rounded px-3 py-2 text-left hover:bg-[#f6f7f4]" onClick={() => exportRows("xls")}>Records Excel</button></li>
              </ul>
            ) : null}
          </div>
          <Link href="/work-records/upload" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm">
            <img src="/icons/records/upload.svg" alt="" className="size-4" />
            Upload records
          </Link>
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-3 text-sm font-bold text-[#fffff4]" onClick={() => setAddOpen(true)}>
            <img src="/icons/records/add.svg" alt="" className="size-4" />
            Add record
          </button>
        </div>
      </div>

      {notice ? <p className="mt-3 text-sm text-[#17803d]">{notice}</p> : null}
      <div className="mt-4 flex gap-6 border-b border-[#ececed] text-sm font-medium">
        <button type="button" className={cn("pb-2", tab === "records" ? "border-b-2 border-[#153a2b] text-[#162e25]" : "text-[#71717a]")} onClick={() => setTab("records")}>All records</button>
        <button type="button" className={cn("pb-2", tab === "submissions" ? "border-b-2 border-[#153a2b] text-[#162e25]" : "text-[#71717a]")} onClick={() => setTab("submissions")}>Submissions</button>
      </div>

      {tab === "records" ? (
        <>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Menu label="Sort by" value={sort} hideValue options={["Newest first", "Oldest first"]} onChange={setSort} />
              <Menu label="" value={status} options={["All statuses", "Confirmed", "Corrected"]} onChange={setStatus} />
            </div>
            <label className="relative sm:w-64">
              <img src="/icons/records/search.svg" alt="" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <input className="h-9 w-full rounded-lg border border-[#e4e4e7] bg-white pr-3 pl-9 text-sm" placeholder="Search employee or ID" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
          </div>
          <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                  {["Employee", "Employee ID", "Work date", "Hours", "Earnings", "Status", ""].map((heading) => <th key={heading || "go"} className="px-4 py-2 font-medium">{heading}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-[#526459]">No records match.</td></tr>
                ) : rows.map((record) => (
                  <tr key={record.id} className="border-t border-dashed border-[#ececed]">
                    <td className="px-4 py-3 font-medium text-[#162e25]">{record.name}</td>
                    <td className="px-4 py-3">{record.code}</td>
                    <td className="px-4 py-3">{record.date}</td>
                    <td className="px-4 py-3">{record.hours}</td>
                    <td className="px-4 py-3">{naira(record.amount)}</td>
                    <td className="px-4 py-3"><StatusPill value={record.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className="text-[#526459]" aria-label={`Open ${record.name}`} onClick={() => { setSelected(record); setCorrecting(false); }}>
                        <img src="/icons/records/next.svg" alt="" className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                {["Submission", "Pay period", "Submitted", "Records", "Status", ""].map((heading) => <th key={heading || "go"} className="px-4 py-2 font-medium">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              {submissions.map((file) => (
                <tr key={file.name} className="border-t border-dashed border-[#ececed]">
                  <td className="px-4 py-3 font-medium">{file.name}</td>
                  <td className="px-4 py-3">{file.period}</td>
                  <td className="px-4 py-3">{file.submitted}</td>
                  <td className="px-4 py-3">{file.records}</td>
                  <td className="px-4 py-3"><StatusPill value={file.status} /></td>
                  <td className="px-4 py-3 text-right"><button type="button" aria-label={`Open ${file.name}`} onClick={() => { setTab("records"); setQuery(file.name.includes("correction") ? "Ngozi" : ""); }}><img src="/icons/records/next.svg" alt="" className="size-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 flex items-center justify-between text-xs text-[#71717a]">
        <span>{tab === "submissions" ? `${submissions.length} records` : status === "All statuses" ? `${rows.length} records` : `${status} records`}</span>
        <span>Page 1 of 1</span>
      </p>

      {selected ? (
        <Dialog title="Work record" onClose={() => setSelected(null)}>
          <p className="text-sm text-[#526459]">{portal.workspaceName} · Employer-submitted record</p>
          {correcting ? (
                <CorrectForm record={selected} onClose={() => setCorrecting(false)} onSaved={() => { setNotice("Correction saved. November earnings updated."); setSelected(null); }} />
          ) : (
            <>
              <dl className="mt-3 divide-y divide-[#f0f2f0] text-sm">
                <Line label="Employee" value={`${selected.name} · ${selected.code}`} />
                <Line label="Work date" value={selected.date} />
                <Line label="Confirmed hours" value={selected.hours} />
                <Line label="Confirmed earnings" value={naira(selected.amount)} />
                <Line label="Source" value={selected.source} />
                <Line label="Record status" value={selected.status} />
              </dl>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm" onClick={() => setSelected(null)}>Close</button>
                <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-bold text-[#fffff4]" onClick={() => setCorrecting(true)}>Correct record</button>
              </div>
            </>
          )}
        </Dialog>
      ) : null}

      {addOpen ? <AddRecord onClose={() => setAddOpen(false)} /> : null}
    </div>
  );
}

function AddRecord({ onClose }: { onClose: () => void }) {
  const portal = usePortal();
  const [employeeId, setEmployeeId] = useState(portal.employees[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("8.0");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  return (
    <Dialog title="Add record" onClose={onClose}>
      <p className="text-sm text-[#526459]">Each record needs an employee, a work date, hours, and confirmed earnings.</p>
      <label className="mt-3 block text-sm">
        <span className="mb-1 block font-medium">Employee</span>
        <select className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
          {portal.employees.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.code}</option>)}
        </select>
      </label>
      <div className="mt-3 block text-sm">
        <span className="mb-1 block font-medium">Work date</span>
        <DateField format="medium" placeholder="DD/MM/YYYY" value={date} onChange={setDate} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm"><span className="mb-1 block font-medium">Hours</span><input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={hours} onChange={(event) => setHours(event.target.value)} /></label>
        <label className="text-sm"><span className="mb-1 block font-medium">Earnings</span><input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} /></label>
      </div>
      {error ? <p className="mt-2 text-xs text-[#d92d20]">{error}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={onClose}>Cancel</button>
        <button type="button" className="h-11 rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={() => {
          const message = portal.addRecord({ employeeId, date, hours, amount: Number(amount) });
          if (message) { setError(message); return; }
          onClose();
        }}>Save record</button>
      </div>
    </Dialog>
  );
}

function CorrectForm({ record, onClose, onSaved }: { record: WorkRecord; onClose: () => void; onSaved: () => void }) {
  const portal = usePortal();
  const [hours, setHours] = useState(record.hours);
  const [amount, setAmount] = useState(String(record.amount));
  return (
    <div className="mt-3">
      <p className="text-sm text-[#526459]">The correction keeps the original entry in the record history.</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm"><span className="mb-1 block font-medium">Hours</span><input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={hours} onChange={(event) => setHours(event.target.value)} /></label>
        <label className="text-sm"><span className="mb-1 block font-medium">Earnings</span><input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} /></label>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={onClose}>Back</button>
        <button type="button" className="h-11 rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={() => { portal.correctRecord(record.id, { hours, amount: Number(amount) }); onSaved(); }}>Save correction</button>
      </div>
    </div>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#0f2a1f]">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-[#526459]">{label}</dt>
      <dd className="text-right font-medium text-[#0f2a1f]">{value}</dd>
    </div>
  );
}

function Menu({ label, value, options, hideValue, onChange }: { label: string; value: string; options: string[]; hideValue?: boolean; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-medium" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        {label ? <span className="text-[#666e6d]">{label}</span> : null}
        {hideValue ? null : value}
        <span className="text-[#98a29c]"><img src={label === "Sort by" ? "/icons/records/down.svg" : "/icons/records/filter.svg"} alt="" className="size-4" /></span>
      </button>
      {open ? (
        <ul className="absolute z-20 mt-1 min-w-36 rounded-lg border border-[#e7e9e9] bg-white p-1 text-sm shadow-lg">
          {options.map((option) => (
            <li key={option}><button type="button" className="w-full rounded px-3 py-2 text-left hover:bg-[#f6f7f4]" onClick={() => { onChange(option); setOpen(false); }}>{option}</button></li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function download(filename: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
