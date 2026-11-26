"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DateField, parsePortalDate } from "@/components/portal/date-field";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";
import type { WorkRecord } from "@/lib/types";
import { cn } from "cn";

const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const submissions = [
  { name: "November work records.xlsx", period: "November 2026", submitted: "11 Nov 2026", records: 3, status: "Needs review", href: "/work-records/upload/review?file=november" },
  { name: "Operations payroll.csv", period: "November 2026", submitted: "10 Nov 2026", records: 3, status: "Confirmed", href: "/work-records/upload/submission" },
  { name: "November correction", period: "November 2026", submitted: "9 Nov 2026", records: 1, status: "Confirmed", href: "/work-records/upload/submission" },
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
  const [tab, setTab] = useState<"records" | "submissions">(params.get("view") === "submissions" ? "submissions" : "records");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("Newest first");
  const [selected, setSelected] = useState<WorkRecord | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [addOpen, setAddOpen] = useState(params.get("add") === "1");
  const [exportOpen, setExportOpen] = useState(false);
  const posted = params.get("posted");
  const [notice, setNotice] = useState(posted === "past" ? "Past-period record confirmed. ₦3,000 posted to November for work on 30 October." : posted === "contract" ? "2 records confirmed. ₦21,000 added across 2 employees. The duplicate was excluded." : "");

  const rows = useMemo(() => {
    const filtered = portal.records.filter((record) => {
      const haystack = `${record.name} ${record.code}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (status !== "All statuses" && record.status !== status) return false;
      return true;
    });
    return [...filtered].sort((a, b) => (sort === "Name A–Z" ? a.name.localeCompare(b.name) : sort === "Oldest first" ? a.iso.localeCompare(b.iso) : b.iso.localeCompare(a.iso)));
  }, [portal.records, query, sort, status]);

  function exportRows(kind: "csv" | "xlsx") {
    const recordsExport = tab === "records";
    const header = recordsExport
      ? ["Employee ID", "Employee", "Work date", "Hours", "Earnings", "Payroll period", "Status"]
      : ["Submission", "Payroll period", "Date submitted", "Records", "Status"];
    const body = recordsExport
      ? rows.map((record) => [record.code, record.name, record.date, record.hours, String(record.amount), "November 2026", record.status])
      : submissions.map((file) => [file.name, file.period, file.submitted, String(file.records), file.status]);
    const filename = recordsExport ? (kind === "csv" ? "work-records.csv" : "work-records.xlsx") : (kind === "csv" ? "work-record-submissions.csv" : "work-record-submissions.xlsx");
    if (kind === "csv") {
      download(filename, [header, ...body].map((line) => line.map((cell) => `"${cell}"`).join(",")).join("\n"), "text/csv");
    } else {
      const table = `<table><tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr>${body.map((line) => `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
      download(filename, table, "application/vnd.ms-excel");
    }
    const subject = recordsExport ? "Work records" : "Submissions";
    setNotice(`${subject} exported as ${kind === "csv" ? "CSV" : "Excel"}.`);
    setExportOpen(false);
  }

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#162e25]">Work records</h1>
          <p className="text-sm text-[#526459]">{posted === "past" ? "Past record posted to November." : "Review the work and earnings your organisation has submitted."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm" onClick={() => setExportOpen(true)}>
            <img src="/icons/records/download.svg" alt="" className="size-4" />
            Export
          </button>
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
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center">
                      {portal.records.length === 0 && !query && status === "All statuses" ? (
                        <>
                          <p className="text-sm font-semibold text-[#162e25]">No work records yet</p>
                          <p className="mt-1 text-sm text-[#526459]">Submit a record or upload a spreadsheet to confirm employee earnings.</p>
                          <button type="button" className="mt-3 inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-3 text-sm font-bold text-[#fffff4]" onClick={() => setAddOpen(true)}>Add first record</button>
                        </>
                      ) : (
                        <p className="text-[#526459]">No records match.</p>
                      )}
                    </td>
                  </tr>
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
                  <td className="px-4 py-3 font-medium"><Link href={file.href} className="text-[#162e25]">{file.name}</Link></td>
                  <td className="px-4 py-3">{file.period}</td>
                  <td className="px-4 py-3">{file.submitted}</td>
                  <td className="px-4 py-3">{file.records}</td>
                  <td className="px-4 py-3"><StatusPill value={file.status} /></td>
                  <td className="px-4 py-3 text-right"><Link href={file.href} aria-label={`Open ${file.name}`}><img src="/icons/records/next.svg" alt="" className="size-3.5" /></Link></td>
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
        <Dialog title={correcting ? "Correct work record" : "Work record"} onClose={() => { setSelected(null); setCorrecting(false); }} wide>
          {correcting ? (
            <CorrectForm record={selected} cycle={longMonths[(parsePortalDate(portal.payroll.end) ?? new Date(2026, 10, 30)).getMonth()]} onClose={() => setCorrecting(false)} onSaved={() => { setNotice("Correction saved. November earnings updated."); setSelected(null); setCorrecting(false); }} />
          ) : (
            <>
              <p className="text-sm text-[#526459]">{portal.workspaceName} · Employer-submitted record</p>
              <dl className="mt-4 divide-y divide-[#eef1ee] rounded-xl border border-[#e4e4e7] px-4 text-sm">
                <Line label="Employee" value={`${selected.name} · ${selected.code}`} />
                <Line label="Work date" value={selected.date} />
                <Line label="Confirmed hours" value={selected.hours} />
                <Line label="Confirmed earnings" value={naira(selected.amount)} />
                <Line label="Source" value={selected.source} />
                <Line label="Record status" value={selected.status} />
              </dl>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" className="h-10 rounded-lg border border-[#dce4de] bg-white px-4 text-sm font-medium text-[#162e25]" onClick={() => setSelected(null)}>Close</button>
                <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => setCorrecting(true)}>Correct record</button>
              </div>
            </>
          )}
        </Dialog>
      ) : null}

      {addOpen ? <AddRecord onClose={() => setAddOpen(false)} /> : null}
      {exportOpen ? <ExportDialog records={tab === "records"} onClose={() => setExportOpen(false)} onExport={exportRows} /> : null}
    </div>
  );
}

function AddRecord({ onClose }: { onClose: () => void }) {
  const portal = usePortal();
  const cycleDate = parsePortalDate(portal.payroll.end) ?? new Date(2026, 10, 30);
  const cycleMonth = longMonths[cycleDate.getMonth()];
  const cycleLabel = `${cycleMonth} ${cycleDate.getFullYear()}`;
  const [past, setPast] = useState(false);
  const [employeeId, setEmployeeId] = useState(portal.employees[0]?.id ?? "");
  const [date, setDate] = useState("11 November 2026");
  const [hours, setHours] = useState("8.0");
  const [amount, setAmount] = useState("12000");
  const [error, setError] = useState("");
  const workDate = parsePortalDate(date);
  const workMonth = workDate ? longMonths[workDate.getMonth()] : "October";

  function openPast() {
    setPast(true);
    setEmployeeId(portal.employees.find((person) => person.id === "fatima")?.id ?? portal.employees[0]?.id ?? "");
    setDate("30 October 2026");
    setHours("2.0");
    setAmount("3000");
    setError("");
  }

  function save() {
    const message = portal.addRecord({ employeeId, date, hours, amount: Number(amount) });
    if (message) { setError(message); return; }
    onClose();
  }

  return (
    <Dialog title={past ? "Add a past-period record" : "Add work record"} onClose={onClose} wide>
      <p className="text-sm text-[#526459]">{past ? "Use the original work date and the current open payroll period." : `${portal.workspaceName} · ${cycleLabel}`}</p>
      <label className="mt-4 block text-sm">
        <span className="mb-1.5 block font-medium text-[#162e25]">Employee</span>
        <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-[#162e25] outline-none" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
          {portal.employees.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.code}</option>)}
        </select>
      </label>
      <div className="mt-4 block text-sm">
        <span className="mb-1.5 block font-medium text-[#162e25]">{past ? "Original work date" : "Work date"}</span>
        <DateField format="full" value={date} onChange={setDate} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">Confirmed hours</span>
          <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none" value={hours} onChange={(event) => setHours(event.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">{past ? "Earnings (NGN)" : "Earned amount (NGN)"}</span>
          <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none" inputMode="numeric" value={amount ? Number(amount).toLocaleString("en-NG") : ""} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} />
        </label>
      </div>
      <div className="mt-4 flex gap-2 rounded-lg bg-[#fbf6ee] px-3 py-2.5 text-sm text-[#8a5a12]">
        <img src="/icons/records/info.svg" alt="" className="mt-0.5 size-4 shrink-0" />
        <p>{past ? `${workMonth} is frozen. This record posts to ${cycleMonth} and retains its ${workMonth} work date.` : "Review the amount before adding it to this employee’s earnings."}</p>
      </div>
      {error ? <p className="mt-2 text-xs text-[#d92d20]">{error}</p> : null}
      {past ? null : <button type="button" className="mt-3 text-sm font-medium text-[#1a6849]" onClick={openPast}>Add a past-period record</button>}
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="h-10 rounded-lg border border-[#dce4de] bg-white px-4 text-sm font-medium text-[#162e25]" onClick={past ? () => { setPast(false); setEmployeeId(portal.employees[0]?.id ?? ""); setDate("11 November 2026"); setHours("8.0"); setAmount("12000"); setError(""); } : onClose}>{past ? "Back" : "Cancel"}</button>
        <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={save}>{past ? "Post record" : "Save record"}</button>
      </div>
    </Dialog>
  );
}

function CorrectForm({ record, cycle, onClose, onSaved }: { record: WorkRecord; cycle: string; onClose: () => void; onSaved: () => void }) {
  const portal = usePortal();
  const [hours, setHours] = useState(record.hours);
  const [amount, setAmount] = useState(String(record.amount));
  const [reason, setReason] = useState("");
  return (
    <div>
      <p className="text-sm text-[#526459]">Save the adjustment to {cycle}. Payroll flags any settled excess.</p>
      <dl className="mt-4 divide-y divide-[#eef1ee] rounded-xl border border-[#e4e4e7] px-4 text-sm">
        <Line label="Employee" value={`${record.name} · ${record.code}`} />
        <Line label="Work date" value={record.date} />
        <Line label="Previously confirmed" value={`${record.hours} hours · ${naira(record.amount)}`} />
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">Revised hours</span>
          <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none" value={hours} onChange={(event) => setHours(event.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">Revised earnings</span>
          <span className="flex h-11 items-center rounded-lg border border-[#dce4de] px-3">
            <span className="text-sm text-[#526459]">₦</span>
            <input className="h-full w-full bg-transparent pl-1 outline-none" inputMode="numeric" value={amount ? Number(amount).toLocaleString("en-NG") : ""} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} />
          </span>
        </label>
      </div>
      <label className="mt-4 block text-sm">
        <span className="mb-1.5 block font-medium text-[#162e25]">Reason for correction</span>
        <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none" placeholder="Work hours revised in payroll records" value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" className="h-10 rounded-lg border border-[#dce4de] bg-white px-4 text-sm font-medium text-[#162e25]" onClick={onClose}>Cancel</button>
        <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => { portal.correctRecord(record.id, { hours, amount: Number(amount) }); onSaved(); }}>Save changes</button>
      </div>
    </div>
  );
}

function Dialog({ title, onClose, wide, children }: { title: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={cn("relative z-10 max-h-[90vh] w-full overflow-auto rounded-2xl bg-white p-5 shadow-xl", wide ? "max-w-[570px]" : "max-w-lg")}>
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

function ExportDialog({ records, onClose, onExport }: { records: boolean; onClose: () => void; onExport: (kind: "csv" | "xlsx") => void }) {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const filename = records ? (format === "csv" ? "work-records.csv" : "work-records.xlsx") : (format === "csv" ? "work-record-submissions.csv" : "work-record-submissions.xlsx");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-[520px] rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#0f2a1f]">{records ? "Export work records" : "Export submissions"}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <p className="mt-4 text-sm font-medium text-[#162e25]">File format</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {([["csv", "CSV (.csv)"], ["xlsx", "Excel (.xlsx)"]] as const).map(([value, label]) => (
            <button key={value} type="button" className={cn("h-11 rounded-lg border px-3 text-sm", format === value ? "border-[#0f2a1f] bg-[#f4f6f3] font-medium text-[#0f2a1f]" : "border-[#dce4de] text-[#526459]")} onClick={() => setFormat(value)}>{label}</button>
          ))}
        </div>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">File name</span>
          <input readOnly value={filename} className="h-11 w-full rounded-lg border border-[#dce4de] bg-[#fafafa] px-3 text-sm" />
        </label>
        <p className="mt-4 text-sm text-[#526459]"><span className="font-medium text-[#162e25]">Included columns. </span>{records ? "Employee ID, employee name, work date, hours, earnings, payroll period and record status" : "Submission, payroll period, date submitted, record count and status"}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm" onClick={onClose}>Cancel</button>
          <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => onExport(format)}>{format === "csv" ? "Export CSV" : "Export Excel"}</button>
        </div>
      </div>
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
