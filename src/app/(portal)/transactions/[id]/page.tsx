"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { naira } from "@/lib/mock-data";
import type { Transaction } from "@/lib/types";
import { Modal, StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

const reasons = ["Check transfer status", "Employee reports a debit", "Check payroll deduction"];

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const portal = usePortal();
  const item = portal.transactions.find((row) => row.id === id);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  if (!item) {
    return (
      <div className="px-4 py-6 text-sm text-[#4e6358]">
        That transaction is not in this workspace. <Link className="font-medium text-[#162e25]" href="/transactions">All transactions</Link>
      </div>
    );
  }
  const funding = item.kind === "Top-up";
  const review = item.review ?? "none";
  const view = describe(item);
  const banner = view.banner;

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href="/transactions" className="inline-flex items-center gap-2 text-sm font-medium text-[#236355]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        All transactions
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">{funding ? "Funding details" : "Withdrawal details"}</h1>
          <p className="mt-1 text-sm text-[#4e6358]">{item.reference}</p>
        </div>
        <StatusPill value={item.status} />
      </div>
      <div className={`mt-4 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${banner.tone}`}>
        <div className="flex gap-3">
          <img src={banner.icon} alt="" className="mt-0.5 size-4" />
          <div>
            <p className="text-sm font-semibold">{banner.title}</p>
            <p className="text-sm">{banner.body}</p>
          </div>
        </div>
        {item.status === "Failed" && review === "none" ? (
          <button type="button" className="h-9 shrink-0 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]" onClick={() => setOpen(true)}>Request review</button>
        ) : null}
        {item.status === "Failed" && review === "requested" ? <span className="text-sm font-medium">Review requested</span> : null}
        {item.status === "Failed" && review === "complete" ? <span className="text-sm font-medium">Review complete</span> : null}
      </div>
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-[#e4e4e7] px-4 py-4">
          <h2 className="font-semibold text-[#162e25]">Transaction details</h2>
          <dl className="mt-2">
            {view.rows.map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 border-t border-[#f0f2f0] py-3 text-sm">
                <dt className="text-[#71717a]">{label}</dt>
                <dd className="text-right font-medium text-[#162e25]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="rounded-2xl border border-[#e4e4e7] px-4 py-4">
          <h2 className="font-semibold text-[#162e25]">Activity</h2>
          <p className="mt-1 text-sm text-[#71717a]">Events for this transaction</p>
          <ol className="mt-4 space-y-4">
            {view.events.map((event, index) => (
              <li key={event.title} className="relative pl-5">
                {index < view.events.length - 1 ? <span className="absolute top-4 left-[5px] h-[calc(100%+8px)] w-px bg-[#e4e4e7]" /> : null}
                <span className={`absolute top-1.5 left-0 size-2.5 rounded-full ${event.dot}`} />
                <p className="text-sm font-medium text-[#162e25]">{event.title}</p>
                <p className="text-sm text-[#4e6358]">{event.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#f4f5ef] px-4 py-4">
        <div>
          <p className="text-sm font-medium text-[#162e25]">{view.payrollTitle}</p>
          <p className="text-sm text-[#4e6358]">{view.payrollBody}</p>
        </div>
        <p className="text-lg font-semibold text-[#162e25]">{naira(view.payrollAmount)}</p>
      </div>
      <Modal open={open} title="Request payout review" description="Send this transfer to Wageet’s payout team for investigation." onClose={() => setOpen(false)}>
        <dl className="space-y-2 text-sm">
          {[["Employee", item.name], ["Transaction", item.reference], ["Amount", naira(item.amount)]].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-[#71717a]">{label}</dt>
              <dd className="font-medium text-[#162e25]">{value}</dd>
            </div>
          ))}
        </dl>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block font-medium text-[#162e25]">Reason for review</span>
          <select value={reason} onChange={(event) => setReason(event.target.value)} className="h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm">
            {reasons.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <p className="mt-3 text-sm text-[#4e6358]">Requesting a review keeps the original payout and payroll amount unchanged.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setOpen(false)}>Cancel</button>
          <button
            type="button"
            className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white"
            onClick={() => {
              portal.requestReview(item.id, reason);
              setOpen(false);
            }}
          >
            Send request
          </button>
        </div>
      </Modal>
    </div>
  );
}

function describe(item: Transaction) {
  const when = item.requested.replace(" · ", " 2026 · ").replace(/(\d{2}:\d{2})$/, "$1 WAT");
  const funding = item.kind === "Top-up";
  if (funding) {
    return {
      banner: { title: "Funding received", body: item.note, tone: "border-[#d7eadc] bg-[#e7f6ee] text-[#17803d]", icon: "/icons/tx/check.svg" },
      rows: [
        ["Organisation", item.name],
        ["Funding reference", item.reference],
        ["Received (WAT)", when],
        ["Payment method", "Bank transfer"],
        ["Amount received", naira(item.amount)],
        ["Currency", "Nigerian naira (NGN)"],
        ["Bank reference", item.provider ?? "DEP-061"],
      ] as [string, string][],
      events: [
        { title: "Bank transfer received", body: `A transfer was received for ${item.name}.`, dot: "bg-[#d4d4d8]" },
        { title: "Funding reference matched", body: "The deposit was matched to this workspace.", dot: "bg-[#d4d4d8]" },
        { title: "Balance credited", body: `${naira(item.amount)} was added to the employer balance.`, dot: "bg-[#17803d]" },
      ],
      payrollTitle: "Credited to employer balance",
      payrollBody: "Available to fund eligible employee withdrawals.",
      payrollAmount: item.amount,
    };
  }

  const rows: [string, string][] = [
    ["Employee", item.name],
    ["Employee ID", item.employeeId ?? "—"],
    ["Requested (WAT)", when],
    ["Pay cycle", item.cycle],
    ["Receiving account", item.account ?? "—"],
    ["Withdrawal amount", naira(item.amount)],
    ["Transfer fee", naira(item.fee ?? 0)],
    ["Provider reference", item.provider ?? "—"],
  ];
  const review = item.review ?? "none";
  const sent = { title: "Sent for review", body: `${item.reviewRef ?? ""} · ${item.reviewReason ?? "Check transfer status"}`.replace(/^ · /, ""), dot: "bg-[#d4d4d8]" };
  const done = { title: "Review complete", body: "Wageet confirmed the transfer failed. No deduction was posted and no further action is needed.", dot: "bg-[#17803d]" };

  if (item.status === "Failed") {
    const events = [
      { title: "Withdrawal requested", body: "Submitted from the employee’s workspace.", dot: "bg-[#d4d4d8]" },
      { title: "Transfer sent", body: "Wageet submitted the payout to the receiving bank.", dot: "bg-[#d4d4d8]" },
      { title: "Transfer failed", body: "The bank returned an unsuccessful response.", dot: "bg-[#d92d20]" },
    ];
    if (review !== "none") events.push(sent);
    if (review === "complete") events.push(done);
    return {
      banner: { title: "Transfer failed", body: item.note, tone: "border-[#f3c7c7] bg-[#fdecec] text-[#b42318]", icon: "/icons/tx/alert.svg" },
      rows,
      events,
      payrollTitle: "Counted toward payroll",
      payrollBody: "No payroll deduction for this withdrawal.",
      payrollAmount: 0,
    };
  }
  if (item.status === "Pending") {
    return {
      banner: { title: "Awaiting bank confirmation", body: item.note, tone: "border-[#f3e0b8] bg-[#fff6e8] text-[#b54708]", icon: "/icons/records/clock.svg" },
      rows,
      events: [
        { title: "Withdrawal requested", body: "Submitted from the employee’s workspace.", dot: "bg-[#d4d4d8]" },
        { title: "Request authorised", body: "The workspace checks passed.", dot: "bg-[#d4d4d8]" },
        { title: "Transfer sent", body: "Waiting for the bank to confirm the outcome.", dot: "bg-[#b54708]" },
      ],
      payrollTitle: "Counted toward payroll",
      payrollBody: "Pending confirmation from the receiving bank.",
      payrollAmount: 0,
    };
  }
  if (item.status === "Reversed") {
    return {
      banner: { title: "Funds returned", body: item.note, tone: "border-[#ddd6fe] bg-[#f3eefe] text-[#7a5af8]", icon: "/icons/tx/in.svg" },
      rows,
      events: [
        { title: "Withdrawal requested", body: "The employee requested a payout.", dot: "bg-[#d4d4d8]" },
        { title: "Transfer sent", body: "The receiving bank processed the request.", dot: "bg-[#d4d4d8]" },
        { title: "Transfer reversed", body: "The bank returned the original payout.", dot: "bg-[#d4d4d8]" },
        { title: "Employer balance credited", body: "The reversal was recorded against this transaction.", dot: "bg-[#7a5af8]" },
      ],
      payrollTitle: "Counted toward payroll",
      payrollBody: "The reversal offsets the original withdrawal.",
      payrollAmount: 0,
    };
  }
  if (item.status === "Adjusted") {
    return {
      banner: { title: "Payroll amount adjusted", body: item.note, tone: "border-[#e4e4e7] bg-[#f4f5ef] text-[#475467]", icon: "/icons/tx/alert.svg" },
      rows,
      events: [
        { title: "Withdrawal requested", body: "The employee requested a payout.", dot: "bg-[#d4d4d8]" },
        { title: "Withdrawal paid", body: `The bank confirmed delivery of ${naira(item.amount)}.`, dot: "bg-[#d4d4d8]" },
        { title: "Payroll adjustment recorded", body: "A ₦1,000 reduction was recorded for reconciliation.", dot: "bg-[#475467]" },
      ],
      payrollTitle: "Counted toward payroll",
      payrollBody: `${naira(item.amount)} original withdrawal less a ₦1,000 adjustment.`,
      payrollAmount: item.amount - 1000,
    };
  }
  return {
    banner: { title: "Withdrawal paid", body: "The receiving bank confirmed delivery.", tone: "border-[#d7eadc] bg-[#e7f6ee] text-[#17803d]", icon: "/icons/tx/check.svg" },
    rows,
    events: [
      { title: "Withdrawal requested", body: "Submitted from the employee’s workspace.", dot: "bg-[#d4d4d8]" },
      { title: "Request authorised", body: "The workspace limit and transaction PIN checks passed.", dot: "bg-[#d4d4d8]" },
      { title: "Transfer sent", body: "Wageet sent the payout to the receiving bank.", dot: "bg-[#d4d4d8]" },
      { title: "Bank confirmed delivery", body: "The withdrawal is included in payroll reconciliation.", dot: "bg-[#17803d]" },
    ],
    payrollTitle: "Counted toward payroll",
    payrollBody: "Included in this employee’s payroll reconciliation.",
    payrollAmount: item.amount,
  };
}
