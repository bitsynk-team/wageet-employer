"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/portal/icons";
import { SupportLine } from "@/components/portal/setup-ui";
import { setupProgress, usePortal } from "@/components/portal/store";
import { cn } from "cn";

type SectionId = "organisation" | "employees" | "earnings";

export default function GetStartedPage() {
  const portal = usePortal();
  const progress = setupProgress(portal);
  const [open, setOpen] = useState<SectionId | null>("organisation");
  const organisationDone = [progress.details, progress.payroll, progress.policy].filter(Boolean).length;
  const employeeDone = [progress.invited, progress.banks].filter(Boolean).length;
  const earningsDone = [progress.records, progress.funded].filter(Boolean).length;
  const ready = organisationDone === 3 && employeeDone === 2 && earningsDone === 2;
  const payrollBody = progress.payroll ? `${portal.payroll.frequency} payroll schedule saved.` : "Set how often employees are paid and their next payday.";

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center px-4 py-10">
      <div className="text-center">
        <h1 className="text-[30px] font-semibold tracking-[-0.4px] text-[#162e25]">{ready ? "Your workplace is ready" : "Let’s get your workplace ready"}</h1>
        <p className="mt-2 text-sm text-[#526459]">
          {ready ? "You’ve completed all the steps to set up earned wage access for your team." : "Complete these steps to give your employees access to their earned pay."}
        </p>
      </div>

      <div className="mt-6 flex w-full flex-col gap-4">
        <Section
          title="Organization Setup"
          count={`${organisationDone} of 3 done`}
          done={organisationDone}
          total={3}
          expanded={open === "organisation"}
          onToggle={() => setOpen(open === "organisation" ? null : "organisation")}
        >
          <Step title="Organization Details" body="Add your company’s name, location and contact details." href="/get-started/organisation" action={progress.details ? "Edit Details" : "Set Details"} done={progress.details} />
          <Step title="Payroll Cycle" body={payrollBody} href="/get-started/payroll" action={progress.payroll ? "Edit Payroll Cycle" : "Set Payroll Cycle"} done={progress.payroll} />
          <Step title="Set Your Access Policy" body="Set eligibility and withdrawal limits for your employees." href="/access-policy/edit?from=setup" action={progress.policy ? "Edit policy" : "Set policy"} done={progress.policy} />
        </Section>

        <Section
          title="Employees Setup"
          count={`${employeeDone} of 2 done`}
          done={employeeDone}
          total={2}
          expanded={open === "employees"}
          onToggle={() => setOpen(open === "employees" ? null : "employees")}
        >
          <Step title="Add Employees" body="Add employee details and send their invitations." href="/get-started/employees" action={progress.invited ? "Manage Invitation" : "Add Employees"} done={progress.invited} />
          <Step title="Complete Bank Details" body="Add and verify bank details for employees who still need them." href="/get-started/banks" action="Complete details" done={progress.banks} />
        </Section>

        <Section
          title="Earnings & Funding Setup"
          count={`${earningsDone} of 2 done`}
          done={earningsDone}
          total={2}
          expanded={open === "earnings"}
          onToggle={() => setOpen(open === "earnings" ? null : "earnings")}
        >
          <Step title="Submit Work Records" body="Submit work records to confirm employee earnings." href={progress.records ? "/work-records" : "/get-started/records"} action={progress.records ? "View Records" : "Add Records"} done={progress.records} />
          <Step
            title="Prepare Funding"
            body={progress.funded ? "Your bank confirmed the first deposit to your Wageet balance." : "Make funds available for eligible employee withdrawals."}
            href="/get-started/funding"
            action={portal.fundingPhase === "confirming" ? "View transfer" : "Add Funds"}
            done={progress.funded}
            hideAction={progress.funded}
          />
        </Section>
      </div>
      <SupportLine />
    </div>
  );
}

function Section({
  title,
  count,
  done,
  total,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  count: string;
  done: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full rounded-2xl border border-[#dce4de] bg-white">
      <button type="button" className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left" onClick={onToggle} aria-expanded={expanded}>
        <span className="text-sm font-medium text-[#162e25]">{title}</span>
        <span className="flex items-center gap-2 text-xs font-medium text-[#162e25]">
          <span className="h-[3px] w-[60px] overflow-hidden rounded-full bg-[#e7e9e9]">
            <span className="block h-full bg-[#153a2b]" style={{ width: `${(done / total) * 100}%` }} />
          </span>
          {count}
          <Icon name={expanded ? "chevron-up" : "chevron-down"} className="size-4" />
        </span>
      </button>
      {expanded ? <div className="border-t border-[#dce4de] px-5 py-2">{children}</div> : null}
    </section>
  );
}

function Step({
  title,
  body,
  href,
  action,
  done,
  hideAction,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
  done: boolean;
  hideAction?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e7e9e9] py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border", done ? "border-[#17803d] bg-[#e7f6ee] text-[#17803d]" : "border-[#c5cdc8]")}>
          {done ? <span className="text-[10px] leading-none">✓</span> : null}
        </span>
        <div>
          <p className="text-sm font-medium text-[#162e25]">{title}</p>
          <p className="text-sm text-[#526459]">{body}</p>
        </div>
      </div>
      {hideAction ? null : (
        <Link href={href} className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white sm:w-[164px]">
          {action}
        </Link>
      )}
    </div>
  );
}
