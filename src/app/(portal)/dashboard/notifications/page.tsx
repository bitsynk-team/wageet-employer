"use client";

import Link from "next/link";
import { useState } from "react";
import { usePortal } from "@/components/portal/store";

const alerts = [
  { title: "Wageet replied to your support request", body: "WGT-1040 · Funding transfer missing", time: "15 Nov · 10:04 WAT", tone: "bg-[#fff1e8] text-[#c2410c]", unread: true },
  { title: "Wageet resolved your support request", body: "WGT-1039 · Employee invitation email", time: "13 Nov · 15:06 WAT", tone: "bg-[#e7f6ee] text-[#17803d]", unread: false },
  { title: "A withdrawal failed", body: "Review the transaction to see the bank’s response.", time: "", tone: "bg-[#fdecec] text-[#d92d20]", unread: true, href: "/transactions/wgt-009128" },
  { title: "Two work records need review", body: "Resolve the held records before the employee earnings are updated.", time: "", tone: "bg-[#fbf1e0] text-[#b54708]", unread: true, href: "/work-records" },
];

export default function NotificationCentrePage() {
  const portal = usePortal();
  const [read, setRead] = useState(false);
  const [draft, setDraft] = useState(false);

  return (
    <div className="px-4 py-4">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[#162e25]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        Notifications
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold text-[#0f2a1f]">Notification centre</h1>
          <p className="mt-1 text-sm text-[#526459]">Review workplace alerts and updates sent to employees.</p>
        </div>
        <span className="inline-flex h-8 items-center rounded-full bg-[#f4f5ef] px-3 text-xs font-medium text-[#162e25]">{portal.workspaceName}</span>
      </div>

      <section className="mt-5 rounded-2xl bg-[#f6f7f4] p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#0f2a1f]">Workplace alerts</h2>
          <button type="button" className="text-sm font-medium text-[#17803d]" onClick={() => { setRead(true); portal.markNoticesRead(); }}>✓ Mark all as read</button>
        </div>
        <ul className="mt-3 space-y-2">
          {alerts.map((alert) => (
            <li key={alert.title}>
              <Link href={alert.href ?? "/help"} className="flex items-center gap-3 rounded-xl bg-white px-3 py-3">
                <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-xs ${alert.tone}`}>●</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[#0f2a1f]">{alert.title}</span>
                  <span className="block text-xs text-[#526459]">{alert.body}</span>
                </span>
                <span className="text-xs text-[#71717a]">{alert.time}</span>
                {!read && alert.unread ? <span className="size-2 rounded-full bg-[#d95125]" /> : null}
                <span className="text-[#98a29c]">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl bg-[#f6f7f4] p-4">
        <h2 className="font-semibold text-[#0f2a1f]">Employee updates</h2>
        <p className="mt-1 text-sm text-[#526459]">Send a workplace message to employees linked to {portal.workspaceName}.</p>
        <div className="mt-3 flex flex-col gap-3 rounded-xl bg-white px-3 py-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#0f2a1f]">October payroll update</p>
            <p className="text-xs text-[#526459]">Published to the employee app · 28 Oct 2026</p>
          </div>
          <button type="button" className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-3 text-xs font-bold text-[#fffff4]" onClick={() => setDraft(true)}>Write an update</button>
        </div>
        {draft ? (
          <form className="mt-3 rounded-xl bg-white p-3" onSubmit={(event) => { event.preventDefault(); portal.notify("Update published to the employee app."); setDraft(false); }}>
            <textarea className="h-24 w-full rounded-lg border border-[#dce4de] px-3 py-2 text-sm outline-none" placeholder="Write a message for employees" required />
            <button type="submit" className="mt-2 h-9 rounded-lg bg-[#0f2a1f] px-3 text-xs font-bold text-[#fffff4]">Publish update</button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
