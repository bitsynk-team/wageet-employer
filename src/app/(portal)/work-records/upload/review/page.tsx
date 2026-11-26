"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OutlineLink, RecordActions, RecordCard } from "@/components/portal/records-ui";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

export default function ReviewUploadPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#526459]">Loading the spreadsheet…</p>}>
      <Review />
    </Suspense>
  );
}

function Review() {
  const params = useSearchParams();
  const past = params.get("period") === "past";
  const november = params.get("file") === "november";
  const amountFixed = params.get("fixed") === "amount";
  const [rowFixed, setRowFixed] = useState(false);
  const [fixOpen, setFixOpen] = useState(false);

  if (past) return <PastReview />;
  if (november) return <NovemberReview fixed={rowFixed} fixOpen={fixOpen} onFix={() => setFixOpen(true)} onClose={() => setFixOpen(false)} onRevalidate={() => { setFixOpen(false); setRowFixed(true); }} />;
  return <AmountReview fixed={amountFixed} />;
}

function AmountReview({ fixed }: { fixed: boolean }) {
  const router = useRouter();
  const portal = usePortal();
  const rows = [
    ["2", "Ngozi Eze · EMP004", "11 Nov 2026", "6.0", "₦9,000", "Ready"],
    ["3", "Sam Adeyemi · EMP003", "12 Nov 2026", "4.0", fixed ? "₦6,000" : "−₦6,000", fixed ? "Ready" : "Invalid amount"],
    ["4", "—", "6 Nov 2026", "—", "₦6,000", "Duplicate"],
  ];
  return (
    <Screen
      title="Review spreadsheet"
      meta="Contract-work-November.xlsx · Acme Foods Ltd · 9–12 Nov 2026"
      summary={fixed ? "2 records ready. The duplicate has been excluded." : "1 invalid amount needs review. An exact duplicate has been excluded."}
      headings={["Row", "Employee", "Work date", "Hours", "Earned amount", "Validation", ""]}
      rows={rows.map((row) => [...row, row[0] === "3" && !fixed ? "fix-amount" : ""])}
      postLabel={fixed ? "Post 2 records" : undefined}
      onPost={fixed ? () => { portal.markRecordsSubmitted(); router.push("/work-records/all?posted=contract"); } : undefined}
    />
  );
}

function NovemberReview({ fixed, fixOpen, onFix, onClose, onRevalidate }: { fixed: boolean; fixOpen: boolean; onFix: () => void; onClose: () => void; onRevalidate: () => void }) {
  const router = useRouter();
  const portal = usePortal();
  const rows = fixed
    ? [
        ["2", "EMP001 · Ada", "11 Nov 2026", "8.0", "₦12,000", "Ready", ""],
        ["3", "EMP002 · Tomi", "11 Nov 2026", "6.0", "₦9,000", "Ready", ""],
        ["4", "—", "10 Nov 2026", "—", "—", "Duplicate", ""],
      ]
    : [
        ["2", "EMP001 · Ada", "11 Nov 2026", "8.0", "₦12,000", "Ready", ""],
        ["3", "EMP020", "11 Nov 2026", "6.0", "₦9,000", "Unmatched ID", "fix-id"],
        ["4", "—", "10 Nov 2026", "—", "—", "Duplicate", ""],
      ];
  return (
    <>
      <Screen
        title="Review spreadsheet"
        meta="November work records.xlsx · Acme Foods Ltd · November 2026"
        summary={fixed ? "2 records ready. ₦21,000 will post. One duplicate is excluded." : "1 record needs a correction. 1 duplicate will be excluded."}
        headings={["Row", "Employee ID", "Work date", "Hours", "Earnings", "Validation", "Action"]}
        rows={rows}
        onFixId={onFix}
        postLabel={fixed ? "Post 2 records" : undefined}
        onPost={fixed ? () => { portal.markRecordsSubmitted(); router.push("/work-records/upload/submission"); } : undefined}
      />
      {fixOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-[570px] rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-[#0f2a1f]">Correct spreadsheet row</h2>
              <button type="button" aria-label="Close" onClick={onClose}>×</button>
            </div>
            <p className="mt-1 text-sm text-[#526459]">Row 3 · November work records.xlsx</p>
            <p className="mt-3 text-sm text-[#8a5a12]">EMP020 does not match an employee at {portal.workspaceName}.</p>
            <dl className="mt-3 divide-y divide-[#eef1ee] rounded-xl border border-[#e4e4e7] px-4 text-sm">
              <Row label="Replace employee ID" value="EMP002 · Tomi Adebayo" />
              <Row label="Work date" value="11 Nov 2026" />
              <Row label="Hours / earnings" value="6.0 hours · ₦9,000" />
            </dl>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm" onClick={onClose}>Cancel</button>
              <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={onRevalidate}>Revalidate row</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function PastReview() {
  const router = useRouter();
  const portal = usePortal();
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Review past-period spreadsheet</h1>
      <p className="mt-1 text-sm text-[#526459]">October-backfill.xlsx · Posting to November 2026</p>
      <RecordCard>
        <p className="text-sm text-[#526459]">1 valid row. Its work date belongs to October and the earnings will post to November.</p>
        <Table headings={["Employee", "Employee ID", "Work date", "Hours", "Earnings", "Status"]} rows={[["Fatima Yusuf", "EMP005", "30 Oct 2026", "2.0", "₦3,000", "Ready"]]} />
        <RecordActions>
          <OutlineLink href="/work-records/upload/past">Replace file</OutlineLink>
          <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={() => { portal.markRecordsSubmitted(); router.push("/work-records/all?posted=past"); }}>Post record</button>
        </RecordActions>
      </RecordCard>
    </div>
  );
}

function Screen({ title, meta, summary, headings, rows, onFixId, postLabel, onPost }: { title: string; meta: string; summary: string; headings: string[]; rows: string[][]; onFixId?: () => void; postLabel?: string; onPost?: () => void }) {
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">{title}</h1>
      <p className="mt-1 text-sm text-[#526459]">{meta}</p>
      <RecordCard title="File review">
        <p className="mt-1 text-sm text-[#526459]">{summary}</p>
        <Table headings={headings} rows={rows} onFixId={onFixId} />
        <RecordActions>
          <OutlineLink href="/work-records/upload">Replace file</OutlineLink>
          {postLabel && onPost ? <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white" onClick={onPost}>{postLabel}</button> : null}
        </RecordActions>
      </RecordCard>
    </div>
  );
}

function Table({ headings, rows, onFixId }: { headings: string[]; rows: string[][]; onFixId?: () => void }) {
  return (
    <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead>
          <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
            {headings.map((heading) => <th key={heading || "action"} className="px-3 py-2 font-medium">{heading}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const action = row.at(-1);
            const actionSlot = headings.at(-1) === "Action" || headings.at(-1) === "";
            const cells = actionSlot ? row.slice(0, -1) : row;
            return (
              <tr key={row[0] + row[1]} className="border-t border-[#f0f2f0]">
                {cells.map((cell, index) => (
                  <td key={index} className="px-3 py-3">{headings[index] === "Validation" || headings[index] === "Status" ? <StatusPill value={cell} /> : cell}</td>
                ))}
                {action === "fix-amount" ? <td className="px-3 py-3"><Link href="/work-records/upload/review/correct" className="text-sm font-medium text-[#1a6849]">Fix row 3</Link></td> : null}
                {action === "fix-id" ? <td className="px-3 py-3"><button type="button" className="text-sm font-medium text-[#1a6849]" onClick={onFixId}>Fix row →</button></td> : null}
                {action === "" && headings.at(-1) === "Action" ? <td className="px-3 py-3 text-[#71717a]">—</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-[#526459]">{label}</dt>
      <dd className="font-medium text-[#0f2a1f]">{value}</dd>
    </div>
  );
}
