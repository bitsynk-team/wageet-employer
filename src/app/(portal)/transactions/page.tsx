"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { naira } from "@/lib/mock-data";
import type { Transaction } from "@/lib/types";
import { Modal, StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

const cycles = ["November 2026", "October 2026", "September 2026", "All pay cycles"] as const;
const statuses = ["All statuses", "Successful", "Pending", "Failed", "Reversed", "Adjusted"];
const types = ["All types", "Withdrawal", "Funding"];

export default function TransactionsPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#526459]">Loading transactions…</p>}>
      <TransactionsContent />
    </Suspense>
  );
}

function TransactionsContent() {
  const portal = usePortal();
  const params = useSearchParams();
  const initialStatus = params.get("status");
  const initialType = params.get("type");
  const [cycle, setCycle] = useState<(typeof cycles)[number]>("November 2026");
  const [status, setStatus] = useState(initialStatus && statuses.includes(initialStatus) ? initialStatus : "All statuses");
  const [type, setType] = useState(initialType === "Top-up" || initialType === "Funding" ? "Funding" : initialType === "Withdrawal" ? "Withdrawal" : "All types");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [scope, setScope] = useState("Current view");
  const [format, setFormat] = useState("CSV");
  const [ready, setReady] = useState("");

  const scoped = useMemo(
    () => (cycle === "All pay cycles" ? portal.transactions : portal.transactions.filter((item) => item.cycle === cycle)),
    [cycle, portal.transactions],
  );
  const rows = useMemo(
    () =>
      scoped.filter((item) => {
        if (status !== "All statuses" && item.status !== status) return false;
        if (type === "Funding" && item.kind !== "Top-up") return false;
        if (type === "Withdrawal" && item.kind !== "Withdrawal") return false;
        const haystack = `${item.name} ${item.reference}`.toLowerCase();
        return haystack.includes(query.trim().toLowerCase());
      }),
    [query, scoped, status, type],
  );
  const suggestions = portal.transactions.filter((item) => {
    const haystack = `${item.name} ${item.reference}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const withdrawals = scoped.filter((item) => item.kind === "Withdrawal");
  const failed = withdrawals.filter((item) => item.status === "Failed");
  const funded = scoped.filter((item) => item.kind === "Top-up" && item.status === "Successful");
  const filtered = status !== "All statuses" || type !== "All types" || query.trim().length > 0;
  const monthName = cycle.replace(" 2026", "");

  function clearFilters() {
    setStatus("All statuses");
    setType("All types");
    setQuery("");
  }

  function exportFile() {
    const source = scope === "All transactions" ? portal.transactions : rows;
    const filename = format === "CSV" ? "Acme-Foods-transactions.csv" : "Acme-Foods-transactions.xlsx";
    const header = ["Reference", "Employee or organisation", "Date", "Type", "Status", "Amount", "Fee", "Payroll impact"];
    const body = source.map((item) => [item.reference, item.name, item.requested, item.kind === "Top-up" ? "Funding" : "Withdrawal", item.status, String(item.amount), String(item.fee ?? 0), String(payrollImpact(item))]);
    const csv = [header, ...body].map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const payload = format === "CSV" ? csv : `<table><tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr>${body.map((line) => `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
    const blob = new Blob([payload], { type: format === "CSV" ? "text/csv" : "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    setReady(`Export ready · ${filename}`);
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Transactions</h1>
          <p className="mt-1 text-sm text-[#4e6358]">Track employee withdrawals and funding for {portal.workspaceName}.</p>
        </div>
        <button type="button" onClick={() => setExportOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
          <img src="/icons/tx/download.svg" alt="" className="size-4" />
          Export transactions
        </button>
      </div>
      {ready ? (
        <p className="mt-3 flex items-center justify-between rounded-lg border border-[#d7eadc] bg-[#e7f6ee] px-3 py-2 text-sm text-[#17803d]">
          {ready}
          <button type="button" className="text-xs font-medium" onClick={() => setReady("")}>Done</button>
        </p>
      ) : null}
      {portal.transactions.length === 0 ? (
        <EmptyBlock title="No transactions yet" body="Employee withdrawals and balance top-ups will appear here. Add funds so employees can access their earned pay." action={{ href: "/dashboard/add-funds", label: "Add funds" }} />
      ) : (
        <>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <Stat icon="out" tint="bg-[#e7f6ee]" label="Withdrawals requested" value={naira(withdrawals.reduce((sum, item) => sum + item.amount, 0))} hint={`${withdrawals.length} withdrawals this cycle`} />
            <Stat icon="in" tint="bg-[#e7f6ee]" label="Funding received" value={naira(funded.reduce((sum, item) => sum + item.amount, 0))} hint={funded.length === 0 ? (cycle === "September 2026" ? "0 balance top-ups" : "No balance top-ups") : funded.length === 1 ? "1 balance top-up" : `${funded.length} balance top-ups`} />
            <Stat icon="alert" tint="bg-[#fff4e8]" label="Failed withdrawals" value={String(failed.length)} hint={failed.length === 0 ? (cycle === "September 2026" ? "0 failed withdrawals" : "None to investigate") : `${naira(failed.reduce((sum, item) => sum + item.amount, 0))} to investigate`} hintClass="text-[#c2410c]" />
          </div>
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#162e25]">Transaction history</h2>
              <p className="text-sm text-[#71717a]">{rows.length} {rows.length === 1 ? "transaction" : "transactions"}</p>
            </div>
            <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
              <Filter value={cycle} options={[...cycles]} onChange={(value) => setCycle(value as (typeof cycles)[number])} />
              <Filter value={status} options={statuses} onChange={setStatus} />
              <Filter value={type} options={types} onChange={setType} />
              <div className="relative lg:ml-auto lg:w-[280px]">
                <img src="/icons/records/search.svg" alt="" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                  value={query}
                  placeholder="Find employee or reference"
                  aria-label="Find employee or reference"
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
                  className="h-10 w-full rounded-lg border border-[#e4e4e7] bg-white pr-9 pl-9 text-sm text-[#162e25] outline-none placeholder:text-[#71717a]"
                />
                <img src="/icons/tx/chev.svg" alt="" className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2" />
                {searchOpen ? (
                  <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[#e4e4e7] bg-white shadow-lg">
                    {suggestions.map((item) => (
                      <Link key={item.id} href={`/transactions/${item.id}`} className="block px-3 py-2 hover:bg-[#f8f8f8]" onClick={() => setSearchOpen(false)}>
                        <span className="block text-sm font-medium text-[#162e25]">{item.name} · {item.reference}</span>
                        <span className="block text-xs text-[#71717a]">{item.kind === "Top-up" ? "Funding" : "Withdrawal"} · {naira(item.amount)} · {item.date}</span>
                      </Link>
                    ))}
                    <button type="button" className="w-full border-t border-[#f0f2f0] px-3 py-2 text-left text-sm text-[#236355]" onClick={() => { setQuery(""); setSearchOpen(false); }}>Clear search</button>
                  </div>
                ) : null}
              </div>
            </div>
            {rows.length === 0 ? (
              cycle !== "All pay cycles" && scoped.length === 0 ? (
                <EmptyBlock title={`No transactions in ${monthName}`} body="No withdrawals or top-ups were recorded for this pay cycle. Choose another cycle to see activity." action={{ label: "View all pay cycles", onClick: () => setCycle("All pay cycles") }} />
              ) : (
                <EmptyBlock
                  title="No matching transactions"
                  body={query.trim() ? "Choose another filter or clear your search to see more transactions." : "Try another transaction type or status, or clear your filters to see this pay cycle’s activity."}
                  action={filtered ? { label: "Clear filters", onClick: clearFilters } : undefined}
                />
              )
            ) : (
              <div className="mt-3 overflow-x-auto rounded-xl border border-[#e4e4e7]">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead>
                    <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                      {["Employee / organisation", "Reference", "Requested (WAT)", "Amount", "Status", ""].map((heading) => (
                        <th key={heading || "action"} className="px-4 py-2.5 font-medium">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const reviewed = row.review === "requested" || row.review === "complete";
                      const label = row.status === "Failed" ? (reviewed ? "View review" : "Review payout") : "View details";
                      return (
                        <tr key={row.id} className="border-t border-[#f0f2f0]">
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#162e25]">{row.name}</p>
                            <p className="text-xs text-[#71717a]">{row.detail}</p>
                          </td>
                          <td className="px-4 py-3 text-[#4e6358]">{row.reference}</td>
                          <td className="px-4 py-3 text-[#4e6358]">{row.requested}</td>
                          <td className="px-4 py-3 text-[#162e25]">{naira(row.amount)}</td>
                          <td className="px-4 py-3"><StatusPill value={row.status} /></td>
                          <td className="px-4 py-3">
                            <Link href={`/transactions/${row.id}`} className={`inline-flex items-center gap-2 text-sm ${label === "Review payout" ? "font-medium text-[#d92d20]" : "text-[#4e6358]"}`}>
                              {label}
                              <img src="/icons/records/next.svg" alt="" className="size-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
      <Modal open={exportOpen} title="Export transactions" description={`Download a ledger for ${portal.workspaceName}.`} onClose={() => setExportOpen(false)}>
        <p className="text-sm font-medium text-[#162e25]">Records to include</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[["Current view", `${rows.length} transactions`], ["All transactions", `${portal.transactions.length} transactions`]].map(([label, hint]) => (
            <button key={label} type="button" onClick={() => setScope(label)} className={`rounded-lg border px-3 py-2 text-left ${scope === label ? "border-[#153a2b] bg-[#f4f5ef]" : "border-[#e4e4e7]"}`}>
              <span className="block text-sm font-medium text-[#162e25]">{label}</span>
              <span className="block text-xs text-[#71717a]">{hint}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-[#162e25]">File format</p>
        <div className="mt-2 flex gap-2">
          {["CSV", "XLSX"].map((item) => (
            <button key={item} type="button" onClick={() => setFormat(item)} className={`h-9 rounded-lg border px-3 text-sm ${format === item ? "border-[#153a2b] bg-[#f4f5ef] font-medium" : "border-[#e4e4e7]"}`}>{item}</button>
          ))}
        </div>
        <p className="mt-4 text-sm text-[#4e6358]">Included fields: reference, employee or organisation, date, type, status, amount, fee and payroll impact. Account numbers are masked.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setExportOpen(false)}>Cancel</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={exportFile}>Export file</button>
        </div>
      </Modal>
    </div>
  );
}

function payrollImpact(item: Transaction) {
  if (item.status === "Successful") return item.amount;
  if (item.status === "Adjusted") return item.amount - 1000;
  return 0;
}

function Stat({ icon, tint, label, value, hint, hintClass = "text-[#4e6358]" }: { icon: string; tint: string; label: string; value: string; hint: string; hintClass?: string }) {
  return (
    <article className="rounded-2xl border border-[#e4e4e7] p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm text-[#4e6358]">{label}</p>
        <span className={`inline-flex size-8 items-center justify-center rounded-lg ${tint}`}>
          <img src={`/icons/tx/${icon}.svg`} alt="" className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-[28px] leading-8 font-semibold tracking-[-0.4px] text-[#162e25]">{value}</p>
      <p className={`mt-1 text-xs ${hintClass}`}>{hint}</p>
    </article>
  );
}

function Filter({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm text-[#162e25]">
        {value}
        <img src="/icons/tx/chev.svg" alt="" className="size-3" />
      </button>
      {open ? (
        <ul className="absolute z-20 mt-1 min-w-44 rounded-lg border border-[#e4e4e7] bg-white p-1 shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button type="button" className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f4f5ef] ${option === value ? "bg-[#f4f5ef]" : ""}`} onClick={() => { onChange(option); setOpen(false); }}>
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function EmptyBlock({ title, body, action }: { title: string; body: string; action?: { label: string; href?: string; onClick?: () => void } }) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-[#e4e4e7] px-4 py-10 text-center">
      <p className="font-medium text-[#162e25]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-[#4e6358]">{body}</p>
      {action?.href ? <Link href={action.href} className="mt-3 inline-flex h-10 items-center rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">{action.label}</Link> : null}
      {action?.onClick ? <button type="button" className="mt-3 inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] bg-white px-4 text-sm font-medium text-[#162e25]" onClick={action.onClick}>{action.label}</button> : null}
    </div>
  );
}
