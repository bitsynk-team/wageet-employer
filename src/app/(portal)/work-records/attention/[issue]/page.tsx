"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DarkButton, OutlineLink, RecordActions, RecordCard, RecordLine, RecordNote } from "@/components/portal/records-ui";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";

export default function AttentionPage() {
  const { issue } = useParams<{ issue: string }>();
  if (issue === "leave") return <LeaveReview />;
  if (issue === "match") return <MatchReview />;
  if (issue === "conflict") return <ConflictReview />;
  return <div className="p-6 text-sm">That review is not open. <Link href="/work-records" className="font-medium">Work records</Link></div>;
}

function LeaveReview() {
  const portal = usePortal();
  const router = useRouter();
  return (
    <Frame title="Review unpaid leave" meta="Salary accrual · Ada Okafor · EMP001">
      <RecordCard>
        <h2 className="text-base font-semibold text-[#0f2a1f]">12 November 2026</h2>
        <dl className="mt-2">
          <RecordLine label="Approved leave" value="One unpaid calendar day · HR record LV-021" />
          <RecordLine label="Already accrued for this date" value={naira(10000)} />
          <RecordLine label="Corrected daily earnings" value={naira(0)} />
          <RecordLine label="Adjustment to November" value="−₦10,000" />
          <RecordLine label="Earnings after correction" value={naira(110000)} />
        </dl>
        <RecordNote>The adjustment keeps the original accrual in the record history. Any settled excess is flagged for payroll review.</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records">Back</OutlineLink>
          <DarkButton onClick={() => { portal.resolveAttention("leave"); portal.notify("Leave adjustment applied."); router.push("/work-records"); }}>Apply leave adjustment</DarkButton>
        </RecordActions>
      </RecordCard>
    </Frame>
  );
}

function MatchReview() {
  const portal = usePortal();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("fatima");
  return (
    <Frame title="Match employee ID" meta="Payroll API · Row 4 · Work date 12 Nov 2026">
      <RecordCard title="Unmatched employee">
        <dl className="mt-2">
          <RecordLine label="Source employee" value="Fatima Yusuf · EMP020" />
          <RecordLine label="Approved work" value={`6 hours · ${naira(9000)}`} />
          <RecordLine label="Reason held" value="EMP020 is not an employee ID in this organisation." />
        </dl>
        <label className="mt-4 block text-sm">
          <span className="mb-1 block font-medium text-[#0f2a1f]">Matching employee at {portal.workspaceName}</span>
          <select className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
            {portal.employees.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.code}</option>)}
          </select>
        </label>
        <RecordNote>Confirm this match for this record only. Fix the employee ID in the payroll source for future deliveries.</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records">Back</OutlineLink>
          <DarkButton onClick={() => {
            const person = portal.employees.find((item) => item.id === employeeId);
            portal.resolveAttention("emp020");
            portal.notify(`EMP020 matched to ${person?.name ?? "the employee"}.`);
            router.push("/work-records");
          }}>Confirm match and post</DarkButton>
        </RecordActions>
      </RecordCard>
    </Frame>
  );
}

function ConflictReview() {
  const portal = usePortal();
  const router = useRouter();
  return (
    <Frame title="Compare work records" meta="Payroll API · Tomi Adebayo · EMP002 · 12 Nov 2026">
      <RecordCard title="Changed earnings">
        <div className="mt-3 overflow-hidden rounded-xl border border-[#eef0ea]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                {["Version", "Hours", "Earned amount"].map((heading) => <th key={heading} className="px-3 py-2 font-medium">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#f0f2f0]"><td className="px-3 py-3">Already confirmed</td><td>8.0</td><td>{naira(12000)}</td></tr>
              <tr className="border-t border-[#f0f2f0]"><td className="px-3 py-3">Approved payroll update</td><td>7.0</td><td>{naira(10500)}</td></tr>
              <tr className="border-t border-[#f0f2f0]"><td className="px-3 py-3">Difference if accepted</td><td /><td>−₦1,500</td></tr>
            </tbody>
          </table>
        </div>
        <RecordLine label="Reason supplied by payroll" value="Revised approved hours" />
        <RecordNote>Apply only the difference. Keeping the current record dismisses this incoming change.</RecordNote>
        <RecordActions>
          <OutlineLink href="/work-records">Back</OutlineLink>
          <button type="button" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm" onClick={() => { portal.resolveAttention("tomi"); portal.notify("Current record kept."); router.push("/work-records"); }}>Keep current record</button>
          <DarkButton onClick={() => { portal.resolveAttention("tomi"); portal.notify("Approved update applied. Difference −₦1,500."); router.push("/work-records"); }}>Apply −₦1,500</DarkButton>
        </RecordActions>
      </RecordCard>
    </Frame>
  );
}

function Frame({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">{title}</h1>
      <p className="mt-1 text-sm text-[#526459]">{meta}</p>
      {children}
    </div>
  );
}
