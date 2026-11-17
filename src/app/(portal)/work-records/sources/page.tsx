"use client";

import Link from "next/link";
import { OutlineLink } from "@/components/portal/records-ui";

const sources = [
  { href: "/work-records/salary", title: "Salary accrual", body: "Calculate fixed salary earnings automatically from salary and pay-cycle dates.", icon: "/icons/records/salary.svg", tone: "bg-[#e7f6ee]" },
  { href: "/work-records/sync", title: "Payroll sync", body: "Import approved hours and earnings on a schedule from your payroll system.", icon: "/icons/records/sync.svg", tone: "bg-[#eef4ff]" },
  { href: "/work-records/upload", title: "Manual uploads", body: "Submit a file covering several employees and work dates at once.", icon: "/icons/records/manual.svg", tone: "bg-[#fff4e8]" },
];

export default function SourcesPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Earnings sources</h1>
      <p className="mt-1 text-sm text-[#526459]">Choose a method for each group of employees. Each employee can have one active source.</p>
      <section className="mt-4 max-w-3xl rounded-2xl border border-[#e6e8e3] bg-white p-4">
        <h2 className="px-2 text-sm font-semibold text-[#0f2a1f]">Choose an earnings source</h2>
        <div className="mt-3 space-y-3">
          {sources.map((source) => (
            <Link key={source.href} href={source.href} className="flex items-center gap-3 rounded-xl border border-[#e6e8e3] px-3 py-3 hover:bg-[#f8f8f8]">
              <span className={`inline-flex size-10 items-center justify-center rounded-lg ${source.tone}`}>
                <img src={source.icon} alt="" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#0f2a1f]">{source.title}</span>
                <span className="block text-sm text-[#526459]">{source.body}</span>
              </span>
              <img src="/icons/records/next.svg" alt="" className="size-4" />
            </Link>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <OutlineLink href="/work-records">Back to work records</OutlineLink>
        </div>
      </section>
    </div>
  );
}
