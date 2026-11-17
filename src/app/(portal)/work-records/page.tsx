"use client";

import Link from "next/link";
import { usePortal } from "@/components/portal/store";

const sourceIcon: Record<string, { src: string; tone: string }> = {
  salary: { src: "/icons/records/salary.svg", tone: "bg-[#e7f6ee]" },
  payroll: { src: "/icons/records/sync.svg", tone: "bg-[#eef4ff]" },
  manual: { src: "/icons/records/manual.svg", tone: "bg-[#fff4e8]" },
};

const updates: Record<string, string> = {
  salary: "13 Nov · 00:05",
  payroll: "13 Nov · 08:05 WAT",
  manual: "6 Nov · 16:10 WAT",
};

const sourceHref: Record<string, string> = {
  salary: "/work-records/salary",
  payroll: "/work-records/sync",
  manual: "/work-records/upload",
};

const attentionHref: Record<string, string> = {
  leave: "/work-records/attention/leave",
  emp020: "/work-records/attention/match",
  tomi: "/work-records/attention/conflict",
};

export default function WorkRecordsPage() {
  const portal = usePortal();

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[#162e25]">Work records</h1>
          <p className="max-w-xl text-sm text-[#526459]">See where earnings come from, how current they are and what needs your attention.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/work-records/sources" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe5dd] px-3 text-sm font-medium text-[#1a6849]">
            <img src="/icons/records/settings.svg" alt="" className="size-4" />
            Manage sources
          </Link>
          <Link href="/work-records/all" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe5dd] px-3 text-sm font-medium text-[#162e25]">
            <img src="/icons/records/file.svg" alt="" className="size-4" />
            View all records
          </Link>
        </div>
      </div>

      <h2 className="mt-5 text-sm font-semibold text-[#162e25]">Earnings sources</h2>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {portal.sources.map((source) => (
          <article key={source.id} className="rounded-2xl border border-[#e4e4e7] p-4">
            <Link href={sourceHref[source.id]} className="flex items-center gap-3">
              <span className={`inline-flex size-9 items-center justify-center rounded-xl ${sourceIcon[source.id]?.tone ?? "bg-[#f4f5ef]"}`}>
                <img src={sourceIcon[source.id]?.src} alt="" className="size-[18px]" />
              </span>
              <span>
                <span className="block font-semibold text-[#162e25]">{source.name}</span>
                <span className="text-xs text-[#71717a]">{source.audience}</span>
              </span>
            </Link>
            <p className="mt-4 text-xs text-[#71717a]">Earnings confirmed through</p>
            <p className="text-lg font-semibold text-[#162e25]">{source.confirmedThrough}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-[#4e6358]">{source.schedule}</p>
              {source.id === "manual" ? (
                <Link href="/work-records/upload" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dfe5dd] px-3 text-sm font-medium text-[#1a6849]">
                  <img src="/icons/records/upload.svg" alt="" className="size-4" />
                  Upload
                </Link>
              ) : (
                <Link href={sourceHref[source.id]} aria-label={`Open ${source.name}`}>
                  <img src="/icons/records/next.svg" alt="" className="size-3.5" />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e4e4e7] border-l-4 border-l-[#f4a24b]">
        <div className="flex items-center gap-2 px-4 py-3">
          <h2 className="font-semibold text-[#162e25]">Needs attention</h2>
          <span className="rounded-full bg-[#fbf1e0] px-2 py-0.5 text-xs font-medium text-[#b54708]">{portal.attention.length} open</span>
        </div>
        {portal.attention.length === 0 ? (
          <p className="px-4 pb-4 text-sm text-[#4e6358]">All caught up. There are no records waiting for review.</p>
        ) : (
          <div className="max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                  {["Employee or source", "What needs attention", "Source", "Action"].map((heading) => (
                    <th key={heading} className="px-4 py-2 font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portal.attention.map((item) => (
                  <tr key={item.id} className="border-t border-dashed border-[#ececed]">
                    <td className="px-4 py-3 font-medium text-[#162e25]">{item.who}</td>
                    <td className="px-4 py-3 text-[#3f3f46]">{item.issue}</td>
                    <td className="px-4 py-3">{item.source}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={attentionHref[item.id] ?? "/work-records/all"} className="inline-flex h-9 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm">{item.action}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-4 mb-4 overflow-hidden rounded-2xl border border-[#e4e4e7]">
        <h2 className="px-4 py-3 font-semibold text-[#162e25]">Latest source activity</h2>
        <div className="max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                {["Source", "Last update (WAT)", "Result", "Next action"].map((heading) => (
                  <th key={heading} className="px-4 py-2 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portal.sources.map((source) => (
                <tr key={source.id} className="border-t border-dashed border-[#ececed]">
                  <td className="px-4 py-3 font-medium text-[#162e25]">{source.name}</td>
                  <td className="px-4 py-3">{updates[source.id]}</td>
                  <td className="px-4 py-3">{source.summary}</td>
                  <td className="px-4 py-3">
                    <Link href={sourceHref[source.id]} className="inline-flex items-center gap-1 font-medium text-[#1a6849]">{source.action} <img src="/icons/records/next.svg" alt="" className="size-3.5" /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
