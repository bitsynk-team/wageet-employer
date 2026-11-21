"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DateField } from "@/components/portal/date-field";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import type { Employee } from "@/lib/types";
import { cn } from "cn";

const banks = ["Access Bank", "Guaranty Trust Bank", "Zenith Bank", "United Bank for Africa"];

type Draft = { name: string; email: string; start: string; account: string; bank: string; open: boolean };

export default function EmployeesPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#526459]">Loading employees…</p>}>
      <EmployeesContent />
    </Suspense>
  );
}

function EmployeesContent() {
  const params = useSearchParams();
  return <Directory key={params.get("invite") ?? "list"} initialInvite={params.get("invite") === "1"} initialTab={params.get("view") === "invited" ? "invited" : "all"} />;
}

function Directory({ initialInvite, initialTab }: { initialInvite: boolean; initialTab: "all" | "invited" }) {
  const portal = usePortal();
  const [tab, setTab] = useState<"all" | "invited">(initialTab);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All status");
  const [sort, setSort] = useState("Default order");
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(1);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [prepared, setPrepared] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(initialInvite);
  const [rows, setRows] = useState<Draft[]>([{ name: "", email: "", start: "", account: "", bank: "", open: true }]);
  const [rowError, setRowError] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const list = portal.employees.filter((person) => {
      const haystack = `${person.name} ${person.email} ${person.role} ${person.code} ${person.department}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (tab === "all" && status !== "All status" && person.status !== status) return false;
      if (tab === "invited" && status !== "All status" && person.delivery !== status) return false;
      return true;
    });
    const copy = [...list];
    if (sort === "Name A–Z") copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Name Z–A") copy.sort((a, b) => b.name.localeCompare(a.name));
    return copy;
  }, [portal.employees, query, sort, status, tab]);

  const size = Number(pageSize);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const visible = filtered.slice((page - 1) * size, page * size);
  const statusOptions = tab === "all" ? ["All status", "Active", "Inactive"] : ["All status", "Pending", "Delivery failed"];

  function exportFile(kind: "csv" | "excel") {
    const headers = tab === "all"
      ? ["Employee", "Email", "Employee ID", "Employment", "Joined", "Bank details", "Access"]
      : ["Name", "Email", "Role", "Invited Date", "Invited By", "Status"];
    const lines = filtered.map((person) =>
      tab === "all"
        ? [person.name, person.email, person.code, person.department, person.joined, person.account, person.status]
        : [person.name, person.email, person.role, person.joined, person.invitedBy, person.delivery],
    );
    const title = tab === "all" ? "employees" : "invitations";
    if (kind === "csv") {
      const csv = [headers, ...lines].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
      download(`${title}.csv`, csv, "text/csv");
    } else {
      const table = `<table><tr>${headers.map((cell) => `<th>${cell}</th>`).join("")}</tr>${lines.map((line) => `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
      download(`${title}.xls`, table, "application/vnd.ms-excel");
    }
    setPrepared(kind === "csv" ? "Export prepared · employees.csv" : "Export prepared · employees.xls");
    setExportOpen(false);
  }

  function sendInvites() {
    const next = rows.map((row) => {
      if (!row.name.trim() || !row.email.includes("@") || !row.start.trim()) return "Enter the name, email, and start date.";
      if (row.account && row.account !== "1023456789") return "Couldn't verify Account number";
      return "";
    });
    setRowError(next);
    if (next.some(Boolean)) return;
    for (const row of rows) {
      const message = portal.inviteEmployee({
        name: row.name,
        email: row.email,
        role: "Member",
        joined: row.start,
        bank: row.account === "1023456789" && row.bank ? `${row.bank} · •••• ${row.account.slice(-4)}` : undefined,
      });
      if (message) {
        setRowError(rows.map(() => message));
        return;
      }
    }
    portal.notify(rows.length === 1 ? "Invitation sent." : `${rows.length} invitations sent.`);
    setInviteOpen(false);
    setTab("invited");
    setRows([{ name: "", email: "", start: "", account: "", bank: "", open: true }]);
  }

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#162e25]">Employees</h1>
          <p className="text-sm text-[#526459]">Invite and manage your employees</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-medium" onClick={() => setExportOpen((open) => !open)}>
              ↓ Export
            </button>
            {exportOpen ? (
              <ul className="absolute right-0 z-20 mt-1 w-[280px] rounded-lg border border-[#e7e9e9] bg-white p-2.5 text-sm shadow-lg">
                <li><button type="button" className="h-10 w-full rounded-lg px-3 text-left text-[#162e25] hover:bg-[#f6f7f4]" onClick={() => exportFile("csv")}>Download CSV</button></li>
                <li><button type="button" className="h-10 w-full rounded-lg px-3 text-left text-[#162e25] hover:bg-[#f6f7f4]" onClick={() => exportFile("excel")}>Download Excel</button></li>
              </ul>
            ) : null}
          </div>
          <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-3 text-xs font-bold text-[#fffff4]" onClick={() => setInviteOpen(true)}>Invite employee</button>
        </div>
      </div>
      {prepared ? <p className="mt-3 rounded-lg border border-[#d7eadc] bg-[#e7f6ee] px-3 py-2 text-sm text-[#17803d]">{prepared}</p> : null}

      <div className="mt-4 flex gap-6 border-b border-[#ececed] text-xs font-semibold tracking-[0.08em]">
        <button type="button" className={cn("pb-2", tab === "all" ? "border-b-2 border-[#153a2b] text-[#162e25]" : "text-[#71717a]")} onClick={() => { setTab("all"); setStatus("All status"); setPage(1); }}>ALL EMPLOYEES</button>
        <button type="button" className={cn("pb-2", tab === "invited" ? "border-b-2 border-[#153a2b] text-[#162e25]" : "text-[#71717a]")} onClick={() => { setTab("invited"); setStatus("All status"); setPage(1); }}>INVITED</button>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Filter label="Sort by" open={sortOpen} onToggle={() => setSortOpen((open) => !open)} options={["Default order", "Name A–Z", "Name Z–A"]} value={sort} onChange={(value) => { setSort(value); setSortOpen(false); }} />
          <Filter label="" open={statusOpen} onToggle={() => setStatusOpen((open) => !open)} options={statusOptions} value={status} onChange={(value) => { setStatus(value); setStatusOpen(false); setPage(1); }} />
        </div>
        <label className="relative sm:w-64">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a29c]">⌕</span>
          <input className="h-9 w-full rounded-lg border border-[#e4e4e7] bg-white pl-8 pr-3 text-sm outline-none placeholder:text-[#98a29c]" placeholder="Search name or anything..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
        </label>
      </div>

      <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
              {(tab === "all" ? ["Employee", "Employee ID", "Employment", "Bank details", "Access", ""] : ["Name", "Role", "Invited date", "Invited by", "Status", ""]).map((heading) => (
                <th key={heading || "menu"} className="px-4 py-2 font-medium first:rounded-l-lg last:rounded-r-lg">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  {portal.employees.length === 0 && !query ? (
                    <>
                      <p className="text-sm font-semibold text-[#162e25]">{tab === "all" ? "No employees yet" : "No invitations yet"}</p>
                      <p className="mt-1 text-sm text-[#526459]">Invite your first employee to start setting up earned wage access.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-[#162e25]">No matching {tab === "all" ? "employees" : "invitations"}</p>
                      <p className="mt-1 text-sm text-[#526459]">Try a different name or clear your filters.</p>
                      <button type="button" className="mt-3 inline-flex h-9 items-center rounded-lg border border-[#dce4de] px-3 text-sm font-medium text-[#162e25]" onClick={() => { setQuery(""); setStatus("All status"); setSort("Default order"); setPage(1); }}>Clear filters</button>
                    </>
                  )}
                </td>
              </tr>
            ) : visible.map((person) => (
              <tr key={person.id} className="border-b border-[#f3f3f1] hover:bg-[#f8f8f8]">
                <td className="px-4 py-3.5">
                  <Link href={tab === "invited" ? `/employees/${person.id}?view=invitation` : `/employees/${person.id}`} className="block font-medium text-[#162e25]">{person.name}</Link>
                  <span className="block text-xs text-[#71717a]">{person.email}</span>
                </td>
                {tab === "all" ? (
                  <>
                    <td className="px-4 py-3.5 text-[#3f3f46]">{person.code}</td>
                    <td className="px-4 py-3.5">
                      <span className="block text-[#162e25]">{person.department}</span>
                      <span className="block text-xs text-[#71717a]">Joined {person.joined}</span>
                    </td>
                    <td className="px-4 py-3.5"><StatusPill value={person.account} /></td>
                    <td className="px-4 py-3.5"><StatusPill value={person.status} /></td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3.5 text-[#3f3f46]">{person.role}</td>
                    <td className="px-4 py-3.5">{person.joined}</td>
                    <td className="px-4 py-3.5">{person.invitedBy}</td>
                    <td className="px-4 py-3.5"><StatusPill value={person.delivery} /></td>
                  </>
                )}
                <td className="relative px-4 py-3.5 text-right">
                  <button type="button" aria-label={`Actions for ${person.name}`} className="text-[#71717a]" onClick={() => setMenuId(menuId === person.id ? null : person.id)}>···</button>
                  {menuId === person.id ? <RowMenu person={person} invited={tab === "invited"} onClose={() => setMenuId(null)} /> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ececed] pt-3 text-xs text-[#71717a]">
        <div className="flex items-center gap-3">
          <Filter label="Show" open={sizeOpen} onToggle={() => setSizeOpen((open) => !open)} options={["10", "25", "50"]} value={pageSize} onChange={(value) => { setPageSize(value); setPage(1); setSizeOpen(false); }} />
          <p>Showing {filtered.length === 0 ? 0 : (page - 1) * size + 1}–{Math.min(page * size, filtered.length)} of {filtered.length}</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="h-8 rounded-lg px-2 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <button key={number} type="button" className={cn("inline-flex size-8 items-center justify-center rounded-lg", number === page ? "bg-[#153a2b] font-medium text-white" : "text-[#162e25]")} onClick={() => setPage(number)} aria-current={number === page ? "page" : undefined}>{number}</button>
          ))}
          <button type="button" className="h-8 rounded-lg px-2 disabled:opacity-40" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={() => setInviteOpen(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 max-h-[90vh] w-full max-w-[640px] overflow-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0f2a1f]">Add Employee</h2>
              <button type="button" aria-label="Close" onClick={() => setInviteOpen(false)}>×</button>
            </div>
            <div className="mt-4 space-y-5">
              {rows.map((row, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Employee {index + 1}</p>
                    {index > 0 ? (
                      <button type="button" className="inline-flex h-[26px] items-center gap-1.5 rounded-md bg-[#f8f8f8] px-2.5 text-xs font-medium text-[#fa4d01]" onClick={() => { setRows((current) => current.filter((_, rowIndex) => rowIndex !== index)); setRowError([]); }}>
                        Remove
                        <img src="/icons/setup/remove.svg" alt="" className="size-[18px]" />
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="mb-1 block font-medium">Name *</span>
                      <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none" value={row.name} onChange={(event) => updateRow(setRows, index, { name: event.target.value })} />
                    </label>
                    <label className="text-sm">
                      <span className="mb-1 block font-medium">Email *</span>
                      <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3 outline-none" placeholder="Enter invitation email" value={row.email} onChange={(event) => updateRow(setRows, index, { email: event.target.value })} />
                    </label>
                  </div>
                  <div className="mt-3 block text-sm">
                    <span className="mb-1 block font-medium">Employment start date *</span>
                    <DateField format="long" placeholder="DD/MM/YYYY" value={row.start} onChange={(start) => updateRow(setRows, index, { start })} />
                  </div>
                  <button type="button" className="mt-4 flex w-full items-center justify-between text-sm font-semibold" onClick={() => updateRow(setRows, index, { open: !row.open })}>
                    Account Details <span>{row.open ? "⌃" : "⌄"}</span>
                  </button>
                  {row.open ? (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="text-sm">
                        <span className="mb-1 block font-medium">Account Number</span>
                        <input className={cn("h-11 w-full rounded-lg border px-3 outline-none", row.account && row.account !== "1023456789" ? "border-[#d92d20]" : "border-[#dce4de]")} value={row.account} onChange={(event) => updateRow(setRows, index, { account: event.target.value.replace(/\D/g, "").slice(0, 10) })} />
                        {row.account === "1023456789" ? <span className="mt-1 block text-xs text-[#17803d]">Hamzah Ridwanullah Opemipo</span> : null}
                        {row.account && row.account !== "1023456789" ? <span className="mt-1 block text-xs text-[#d92d20]">Couldn’t verify Account number</span> : null}
                      </label>
                      <label className="text-sm">
                        <span className="mb-1 block font-medium">Bank Name</span>
                        <select className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={row.bank} onChange={(event) => updateRow(setRows, index, { bank: event.target.value })}>
                          <option value="">Select a Bank</option>
                          {banks.map((bank) => <option key={bank}>{bank}</option>)}
                        </select>
                      </label>
                    </div>
                  ) : null}
                  {rowError[index] ? <p className="mt-2 text-xs text-[#d92d20]">{rowError[index]}</p> : null}
                </div>
              ))}
              <button type="button" className="flex h-11 w-full items-center justify-center rounded-lg border border-dashed border-[#dce4de] text-sm" onClick={() => setRows((current) => [...current, { name: "", email: "", start: "", account: "", bank: "", open: true }])}>+ Add Another Employee</button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={() => setInviteOpen(false)}>Cancel</button>
                <button type="button" className="h-11 whitespace-nowrap rounded-lg bg-[#0f2a1f] px-3 text-sm font-bold text-[#fffff4]" onClick={sendInvites}>{rows.length === 1 ? "Send invitation" : `Send ${rows.length} invitations`}</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function updateRow(setRows: React.Dispatch<React.SetStateAction<Draft[]>>, index: number, patch: Partial<Draft>) {
  setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)));
}

function Filter({ label, value, options, open, onToggle, onChange }: { label: string; value: string; options: string[]; open: boolean; onToggle: () => void; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-medium" aria-expanded={open} onClick={onToggle}>
        {label ? <span className="text-[#666e6d]">{label}</span> : null}
        {label === "Sort by" ? null : value}
        <span className="text-[#98a29c]">▾</span>
      </button>
      {open ? (
        <ul className="absolute z-20 mt-1 min-w-40 rounded-lg border border-[#e7e9e9] bg-white p-1 text-sm shadow-lg">
          {options.map((option) => (
            <li key={option}><button type="button" className="w-full rounded px-3 py-2 text-left hover:bg-[#f6f7f4]" onClick={() => onChange(option)}>{label === "Show" ? `Show ${option}` : option}</button></li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function RowMenu({ person, invited, onClose }: { person: Employee; invited: boolean; onClose: () => void }) {
  const href = invited ? `/employees/${person.id}?view=invitation` : `/employees/${person.id}`;
  return (
    <ul className="absolute right-4 z-20 mt-1 w-44 rounded-lg border border-[#e7e9e9] bg-white p-1 text-left text-sm shadow-lg">
      <li><Link href={href} className="block rounded px-3 py-2 hover:bg-[#f6f7f4]" onClick={onClose}>{invited ? "Invitation details" : "View profile"}</Link></li>
      <li><Link href={`/employees/${person.id}?edit=1`} className="block rounded px-3 py-2 hover:bg-[#f6f7f4]" onClick={onClose}>Edit employment</Link></li>
    </ul>
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

