"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { naira } from "@/lib/mock-data";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import type { TxKind } from "@/lib/types";

function DashIcon({ name, className = "size-4" }: { name: string; className?: string }) {
  return <img src={`/icons/dash/${name}.svg`} alt="" className={`${className} max-w-none shrink-0`} />;
}

const withdrawalDays = [
  { label: "3 Nov", paid: 44, other: 0 },
  { label: "4 Nov", paid: 0, other: 29 },
  { label: "5 Nov", paid: 0, other: 22 },
  { label: "6 Nov", paid: 56, other: 36 },
];
const months = ["November 2026", "September 2026"];

export default function DashboardPage() {
  const portal = usePortal();
  const [filter, setFilter] = useState<"All" | TxKind>("All");
  const [month, setMonth] = useState(months[0]);
  const [monthOpen, setMonthOpen] = useState(false);
  const [cycleOpen, setCycleOpen] = useState(false);
  const november = useMemo(() => portal.transactions.filter((item) => item.cycle !== "October 2026"), [portal.transactions]);
  const rows = useMemo(
    () => (month === "September 2026" ? [] : november.filter((item) => filter === "All" || item.kind === filter)),
    [filter, month, november],
  );
  const withdrawals = november.filter((item) => item.kind === "Withdrawal");
  const completed = withdrawals.filter((item) => item.status === "Successful" || item.status === "Adjusted");
  const paid = completed.reduce((sum, item) => sum + item.amount, 0);
  const requested = withdrawals.reduce((sum, item) => sum + item.amount, 0);
  const topUps = november.filter((item) => item.kind === "Top-up" && item.status === "Successful");
  const received = topUps.reduce((sum, item) => sum + item.amount, 0);
  const pending = november.find((item) => item.status === "Pending");
  const missingBanks = portal.employees.filter((person) => person.account === "Missing").length;
  const held = portal.attention.filter((item) => item.source === "Payroll sync").length;
  const failed = withdrawals.filter((item) => item.status === "Failed").length;
  const unread = portal.notices.some((item) => !item.read);

  return (
    <div className="flex flex-col gap-3 px-3 pt-4 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[32px] leading-9 font-semibold tracking-[-0.64px] text-[#162e25]">Hello, {portal.profile.name.split(" ")[0]}</h1>
          <p className="text-[15px] leading-[19px] text-[#4e6358]">Here’s where {portal.workspaceName} stands this payroll cycle.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex h-[34px] items-center gap-2 rounded-[18px] bg-white px-3 text-[13px] font-medium text-[#162e25]">
            <DashIcon name="date" />
            14 November 2026
          </div>
          <Link href="/dashboard/notifications" aria-label="Notification centre" className="relative inline-flex size-[38px] items-center justify-center rounded-[11px] border border-[#dfe5dd] bg-white" onClick={() => portal.markNoticesRead()}>
            <DashIcon name="bell" className="size-[18px]" />
            {unread ? <span className="absolute top-[5px] left-[23px] size-[7px] rounded-[4px] bg-[#d95125]" /> : null}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="flex flex-col gap-2 rounded-[18px] border border-[#dfe5df] p-[18px]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-[#4e6358]">Available funding balance</h2>
            <span className="inline-flex h-6 items-center rounded-[14px] border border-[#dfe3da] px-2 text-[11px] font-semibold text-[#4e6358]">NGN</span>
          </div>
          <p className="text-[45px] leading-[50px] font-semibold tracking-[-0.9px] text-[#162e25]">{naira(portal.balance)}</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Link href="/dashboard/add-funds" className="inline-flex h-[39px] items-center justify-center gap-2 rounded-[22px] bg-[#153a2b] text-sm font-medium text-white">
              <DashIcon name="plus" />
              Add funds
            </Link>
            <Link href="/transactions?type=Top-up" className="inline-flex h-[39px] items-center justify-center gap-2 rounded-[22px] bg-[#f4f5ef] text-sm font-medium text-[#162e25]">
              <DashIcon name="receipt" />
              Funding history
            </Link>
          </div>
          {cycleOpen ? (
            <div className="rounded-xl bg-[#f4f5ef] px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#162e25]">Payroll cycle</p>
                <div className="flex items-center gap-1.5">
                  <button type="button" className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1a6849]" onClick={() => setCycleOpen(false)}>
                    View cycle
                    <DashIcon name="chev" className="size-[13px]" />
                  </button>
                  <Link href="/dashboard/payroll-close" className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#dfe5dd] bg-white px-2.5 text-[13px] font-medium text-[#113829]">
                    <DashIcon name="calendar" className="size-[15px]" />
                    Review payroll close
                  </Link>
                </div>
              </div>
              <div className="mt-1.5 grid gap-1.5 sm:grid-cols-3">
                {[
                  ["Earning period", "1–30 Nov"],
                  ["Withdrawal cutoff", "28 Nov · 23:59 WAT"],
                  ["Payday", "30 Nov"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white px-2.5 py-2">
                    <p className="text-xs text-[#4e6358]">{label}</p>
                    <p className="text-base font-semibold text-[#162e25]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[#f4f5ef] px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#162e25]">Reconciliation</p>
                <button type="button" className="text-[13px] font-medium text-[#1a6849]" onClick={() => portal.notify("Activity export is ready to download.")}>Export transactions ›</button>
              </div>
              <p className="mt-2 text-sm font-medium text-[#162e25]">1 deposit confirmed · {naira(received || 50000)}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-xs text-[#4e6358]">Review deposit details in funding history.</p>
                <button type="button" className="shrink-0 whitespace-nowrap text-[13px] font-medium text-[#1a6849]" onClick={() => setCycleOpen(true)}>View cycle</button>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-2.5 sm:grid-cols-2">
          <Link href="/transactions?status=Successful" className="flex h-[135px] flex-col justify-between rounded-xl bg-[#112c23] px-4 py-3 text-white">
            <span className="flex items-center justify-between text-sm font-medium">
              Paid to employees
              <span className="inline-flex size-[25px] items-center justify-center rounded-[9px] bg-[#53675e]"><DashIcon name="out" className="size-3" /></span>
            </span>
            <span>
              <span className="block text-[31px] leading-[35px] font-semibold tracking-[-0.62px]">{naira(paid)}</span>
              <span className="text-xs">Paid to {completed.length} employees</span>
            </span>
          </Link>
          <Link href="/transactions" className="flex h-[135px] flex-col justify-between rounded-xl bg-[#f4f5ef] px-4 py-3">
            <span className="flex items-center justify-between text-sm font-medium text-[#162e25]">
              Withdrawals requested
              <span className="inline-flex size-[25px] items-center justify-center rounded-[9px] bg-white"><DashIcon name="layers" className="size-3" /></span>
            </span>
            <span>
              <span className="block text-[31px] leading-[35px] font-semibold tracking-[-0.62px] text-[#162e25]">{naira(requested)}</span>
              <span className="text-xs text-[#4e6358]">{withdrawals.length} requests this cycle</span>
            </span>
          </Link>
          <Link href="/transactions?type=Top-up" className="flex h-[135px] flex-col justify-between rounded-xl bg-[#f4f5ef] px-4 py-3">
            <span className="flex items-center justify-between text-sm font-medium text-[#162e25]">
              Funding received
              <span className="inline-flex size-[25px] items-center justify-center rounded-[9px] bg-white"><DashIcon name="in" className="size-3" /></span>
            </span>
            <span>
              <span className="block text-[31px] leading-[35px] font-semibold tracking-[-0.62px] text-[#162e25]">{naira(received)}</span>
              <span className="text-xs text-[#4e6358]">{topUps.length} confirmed top-up{topUps.length === 1 ? "" : "s"}</span>
            </span>
          </Link>
          <Link href="/transactions?status=Pending" className="flex h-[135px] flex-col justify-between rounded-xl bg-[#f4f5ef] px-4 py-3">
            <span className="flex items-center justify-between text-sm font-medium text-[#162e25]">
              Pending withdrawal
              <span className="inline-flex size-[25px] items-center justify-center rounded-[9px] bg-white"><DashIcon name="clock" className="size-3" /></span>
            </span>
            <span>
              <span className="block text-[31px] leading-[35px] font-semibold tracking-[-0.62px] text-[#162e25]">{pending ? naira(pending.amount) : "₦0"}</span>
              <span className="text-xs text-[#4e6358]">Awaiting bank confirmation</span>
            </span>
          </Link>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-[18px] border border-[#dfe5df] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#162e25]">Recent activity</h2>
            <Link href="/transactions" className="text-sm font-medium text-[#1a6849]">View all transactions ›</Link>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex rounded-full bg-[#f4f5ef] p-1 text-sm">
              {(["All", "Top-up", "Withdrawal"] as const).map((item) => (
                <button key={item} type="button" onClick={() => setFilter(item)} className={`h-8 rounded-full px-3 ${filter === item ? "bg-[#153a2b] text-white" : "text-[#4e6358]"}`}>
                  {item === "Top-up" ? "Top-ups" : item === "Withdrawal" ? "Withdrawals" : "All"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#dfe5dd] bg-white px-3 text-xs font-medium text-[#162e25]" aria-expanded={monthOpen} onClick={() => setMonthOpen((open) => !open)}>
                  <DashIcon name="calendar" className="size-3.5" />
                  {month}
                  <DashIcon name="chev" className="size-3" />
                </button>
                {monthOpen ? (
                  <ul className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-[#e4e4e7] bg-white p-1 shadow-lg">
                    {months.map((item) => (
                      <li key={item}>
                        <button type="button" className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-[#f4f5ef]" onClick={() => { setMonth(item); setMonthOpen(false); }}>
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <button type="button" className="inline-flex h-8 items-center gap-1.5 text-sm font-medium text-[#162e25]" onClick={() => portal.notify("Activity export is ready to download.")}>
                <DashIcon name="download" className="size-3.5" />
                Export
              </button>
            </div>
          </div>
          <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                  {["Employee / organisation", "Reference", "Date", "Amount", "Status", ""].map((heading) => (
                    <th key={heading || "go"} className="px-3 py-2 font-medium first:rounded-l-lg last:rounded-r-lg">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-[#526459]">No activity in {month}.</td>
                  </tr>
                ) : null}
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#f3f3f1]">
                    <td className="px-3 py-3">
                      <Link href={`/transactions/${row.id}`} className="flex items-center gap-2">
                        <span className={`inline-flex size-7 items-center justify-center rounded-full ${row.kind === "Top-up" ? "bg-[#e7f6ee]" : "bg-[#f4f5ef]"}`}>
                          <DashIcon name={row.kind === "Top-up" ? "topup" : "arrow"} className="size-3.5" />
                        </span>
                        <span>
                          <span className="block font-medium text-[#162e25]">{row.name}</span>
                          <span className="text-xs text-[#71717a]">{row.kind === "Top-up" ? "Top-up" : "Withdrawal"}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-[#3f3f46]">{row.reference}</td>
                    <td className="px-3 py-3">{row.date}</td>
                    <td className="px-3 py-3 font-medium">{row.kind === "Top-up" ? `+${naira(row.amount)}` : naira(row.amount)}</td>
                    <td className="px-3 py-3"><StatusPill value={row.status} /></td>
                    <td className="px-3 py-3"><DashIcon name="row-chev" className="size-3" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-1 rounded-[18px] border border-[#dfe5df] bg-white p-[14px]">
            <div className="flex h-[29px] items-center justify-between gap-3">
              <h2 className="text-[18px] leading-[23px] font-semibold text-[#162e25]">Withdrawal requests</h2>
              {month === "September 2026" ? null : <p className="shrink-0 text-[12px] leading-[15px] font-medium whitespace-nowrap text-[#4e6358]">3–6 Nov</p>}
            </div>
            {month === "September 2026" ? (
              <>
                <div className="relative mt-2 h-[66px] rounded-[10px] bg-[#f4f5ef]" aria-hidden="true">
                  <span className="absolute top-[18px] bottom-[16px] left-[31px] w-px bg-[#d9ded4]" />
                  <span className="absolute right-4 bottom-[16px] left-[29px] h-px bg-[#d9ded4]" />
                </div>
                <p className="mt-2 text-sm font-semibold text-[#162e25]">No requests this cycle</p>
                <p className="text-[13px] leading-[17px] text-[#4e6358]">The chart starts with the first employee request.</p>
              </>
            ) : (
              <>
                <div className="flex h-5 items-center gap-3 text-[11px] leading-[14px] text-[#4e6358]">
                  <span className="inline-flex items-center gap-[5px]"><span className="size-[9px] rounded-[3px] bg-[#153a2b]" />Paid</span>
                  <span className="inline-flex items-center gap-[5px]"><span className="size-[9px] rounded-[3px] bg-[#f18b64]" />Other requests</span>
                </div>
                <div className="relative h-[143px] w-full rounded-[10px] bg-[#f4f5ef]">
                  <span className="absolute top-[15px] left-[5px] text-[9px] leading-3 text-[#607065]">₦20k</span>
                  <span className="absolute top-[59px] left-[5px] text-[9px] leading-3 text-[#607065]">₦10k</span>
                  <span className="absolute top-[104px] left-[5px] text-[9px] leading-3 text-[#607065]">₦0</span>
                  <span className="absolute top-[21px] right-3 left-[37px] h-px bg-[#d9ded4]" />
                  <span className="absolute top-[65px] right-3 left-[37px] h-px bg-[#d9ded4]" />
                  <span className="absolute top-[110px] right-3 left-[37px] h-px bg-[#d9ded4]" />
                  <div className="absolute top-[21px] right-2 left-[37px] grid h-[89px] grid-cols-4">
                    {withdrawalDays.map((day) => (
                      <div key={day.label} className="flex h-full flex-col items-center justify-end">
                        {day.other ? (
                          <div className="relative w-7 overflow-hidden rounded-[3px] bg-[#f18b64]" style={{ height: day.other }}>
                            <img src="/icons/dash/hatch.svg" alt="" className="absolute inset-0 h-full w-full max-w-none" />
                          </div>
                        ) : null}
                        {day.paid ? <div className="w-7 rounded-[3px] bg-[#153a2b]" style={{ height: day.paid }} /> : null}
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-[117px] right-2 left-[37px] grid grid-cols-4">
                    {withdrawalDays.map((day) => (
                      <span key={day.label} className="text-center text-[11px] leading-[14px] text-[#4e6358]">{day.label}</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
          <section className="rounded-[18px] border border-[#dfe5df] p-4">
            <h2 className="font-semibold text-[#162e25]">Needs attention</h2>
            <ul className="mt-3 divide-y divide-[#f3f3f1]">
              {[
                [String(missingBanks), "Bank accounts to complete", "/employees?account=Missing"],
                [String(held), "Held payroll records", "/work-records"],
                [String(failed), "Failed withdrawal", "/transactions?status=Failed"],
              ].map(([count, label, href]) => (
                <li key={label}>
                  <Link href={href} className="flex items-center gap-3 py-2.5 text-sm text-[#162e25]">
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#fbf1e0] text-xs font-semibold text-[#b54708]">{count}</span>
                    <span className="flex-1">{label}</span>
                    <DashIcon name="row-chev" className="size-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-[18px] border border-[#dfe5df] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-[#162e25]">Earnings confirmed through</h2>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4e6358]">
            <span className="inline-flex items-center gap-2"><DashIcon name="calendar" className="size-4" /> Salary accrual <strong className="font-semibold text-[#162e25]">12 Nov</strong></span>
            <span className="inline-flex items-center gap-2"><DashIcon name="sync" className="size-4" /> Payroll sync <strong className="font-semibold text-[#162e25]">12 Nov</strong></span>
            <span className="inline-flex items-center gap-2"><DashIcon name="record" className="size-4" /> Manual uploads <strong className="font-semibold text-[#162e25]">6 Nov</strong></span>
          </div>
        </div>
        <Link href="/work-records" className="text-sm font-medium text-[#1a6849]">View work records ›</Link>
      </section>
    </div>
  );
}
