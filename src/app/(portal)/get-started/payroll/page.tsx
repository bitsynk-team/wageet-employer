"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/portal/ui";
import { RequiredNote, SetupActions, SetupCard, SetupPage, SupportLine, fieldClass, labelClass } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";
import type { Payroll } from "@/lib/types";
import { cn } from "cn";

const frequencies = ["Monthly", "Weekly", "Daily"] as const;

export default function PayrollSetupPage() {
  const portal = usePortal();
  const router = useRouter();
  const [frequency, setFrequency] = useState<Payroll["frequency"]>(portal.payroll.frequency);
  const [open, setOpen] = useState(false);
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [payday, setPayday] = useState("Day after the week ends");
  const [cutoff, setCutoff] = useState("2 days before payday");

  function save() {
    const cycle =
      frequency === "Weekly"
        ? { start: "Monday", end: "Sunday", payday: "Day after the week ends", cutoff: "2 days before payday" }
        : frequency === "Daily"
          ? { start: "One workday", end: "One workday", payday: "Following calendar day", cutoff: "23:59 WAT" }
          : { start: "01/11/2026", end: "30/11/2026", payday: "30/11/2026", cutoff: "28/11/2026" };
    portal.savePayroll({ frequency, ...cycle });
    router.push("/get-started");
  }

  const subtitle =
    frequency === "Weekly"
      ? "Choose how each earning week repeats and when withdrawals close."
      : frequency === "Daily"
        ? "Choose when each workday is paid and when employees can last withdraw."
        : "Set the recurring schedule. Use a monthly exception when payday or the cut-off changes for one month.";

  return (
    <SetupPage title="Payroll Cycle" subtitle={subtitle}>
      <SetupCard>
        <RequiredNote />
        <div className="mt-6 flex max-w-[696px] flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative">
              <span className={`${labelClass} capitalize`}>Pay frequency *</span>
              <button type="button" className={`${fieldClass} flex items-center justify-between text-left text-[#526459]`} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
                {frequency}
                <img src="/icons/setup/caret.svg" alt="" className="size-4" />
              </button>
              {open ? (
                <ul className="absolute z-10 mt-1 w-full rounded-lg border border-[#dce4de] bg-white p-1 shadow-lg">
                  {frequencies.map((item) => (
                    <li key={item}>
                      <button type="button" className="w-full rounded-md px-2.5 py-2 text-left text-sm text-[#0f2a1f] hover:bg-[#f4f5ef]" onClick={() => { setFrequency(item); setOpen(false); }}>
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <Field label="Currency" value="NGN · Nigerian naira" readOnly muted />
          </div>
          {frequency === "Monthly" ? <MonthlyFields /> : null}
          {frequency === "Weekly" ? <WeeklyFields onException={() => setExceptionOpen(true)} /> : null}
          {frequency === "Daily" ? <DailyFields onException={() => setExceptionOpen(true)} /> : null}
          {frequency === "Monthly" ? (
            <div className="flex h-[60px] items-center justify-between rounded-lg border border-[#dfe5dd] bg-[#f8f9f6] px-3">
              <div>
                <p className="text-[15px] font-medium leading-[19px] text-[#142e24]">Monthly exceptions</p>
                <p className="text-[13px] leading-[17px] text-[#52655b]">Change dates for a specific month. Other months follow this schedule.</p>
              </div>
              <button type="button" className="inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-[7px] border border-[#dfe5dd] bg-white px-2.5 text-[13px] font-medium text-[#113829]" onClick={() => setExceptionOpen(true)}>
                <img src="/icons/setup/date.svg" alt="" className="size-[15px]" />
                Manage exceptions
              </button>
            </div>
          ) : null}
          <div className="flex gap-2.5 rounded-md border border-dashed border-[#0f2a1f] px-[17px] py-2.5">
            <img src="/icons/setup/info.svg" alt="" className="mt-0.5 size-[18px] shrink-0" />
            <div className="text-sm leading-[18px] text-[#0f2a1f]">
              <p className="font-semibold">
                {frequency === "Daily"
                  ? "Daily earnings use employer-submitted work records."
                  : frequency === "Weekly"
                    ? "Weekly earning periods follow the same seven-day schedule."
                    : "Withdrawals close at 23:59 WAT on the cut-off date."}
              </p>
              <p className="mt-1">
                {frequency === "Daily"
                  ? "The withdrawal cut-off is on the workday. All times use Africa/Lagos (WAT)."
                  : frequency === "Weekly"
                    ? "The first week can be shorter when the schedule starts midweek."
                    : "This lets you reconcile withdrawals before running payroll."}
              </p>
            </div>
          </div>
          <SetupActions backHref="/get-started" primary="Save cycle" onPrimary={save} />
        </div>
      </SetupCard>
      <SupportLine align="left" />
      <Modal open={exceptionOpen} title="Change one week" description="Choose the earning period, then adjust when employees can withdraw and when they get paid." onClose={() => setExceptionOpen(false)}>
        <label className="block text-sm">
          <span className={labelClass}>Earning week</span>
          <input className={fieldClass} value="1–6 Dec 2026" readOnly />
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className={labelClass}>Payday</span>
            <input className={fieldClass} value={payday} onChange={(event) => setPayday(event.target.value)} />
          </label>
          <label className="text-sm">
            <span className={labelClass}>Withdrawal cut-off</span>
            <input className={fieldClass} value={cutoff} onChange={(event) => setCutoff(event.target.value)} />
          </label>
        </div>
        <p className="mt-3 text-sm text-[#526459]">Payday 7 Dec 2026 · Withdrawals close 5 Dec 2026 · 23:59 WAT</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={() => { setPayday("Day after the week ends"); setCutoff("2 days before payday"); setExceptionOpen(false); }}>Use regular dates</button>
          <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={() => setExceptionOpen(false)}>Cancel</button>
          <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-3 text-sm text-[#fffff4]" onClick={() => setExceptionOpen(false)}>Save exception</button>
        </div>
      </Modal>
    </SetupPage>
  );
}

function MonthlyFields() {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Earning period starts *" value="01/11/2026" muted />
        <Field label="Earning period ends *" value="30/11/2026" muted />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Regular payday *" value="30/11/2026" muted />
          <Field label="Withdrawal cut-off *" value="28/11/2026" muted capitalize />
        </div>
        <p className="flex items-center gap-[7px] text-sm font-medium text-[#0f2a1f]">
          <img src="/icons/setup/sync.svg" alt="" className="size-[15px]" />
          Repeats monthly · Payday falls on the last calendar day.
        </p>
      </div>
    </>
  );
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const paydayOptions = ["On the week’s last day", "Day after the week ends", "2 days after the week ends", "3 days after the week ends"];
const leadOptions = ["1 day before payday", "2 days before payday", "3 days before payday"];
const dayLagOptions = ["Same workday", "Following calendar day"];
const payoutOptions = ["16:00 WAT", "18:00 WAT", "20:00 WAT"];
const cutOptions = ["12:00 WAT", "14:00 WAT", "23:59 WAT"];

function WeeklyFields({ onException }: { onException: () => void }) {
  const [start, setStart] = useState("Monday");
  const [payday, setPayday] = useState("Day after the week ends");
  const [cutoff, setCutoff] = useState("2 days before payday");
  const end = weekdays[(weekdays.indexOf(start) + 6) % 7];
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <MenuField label="Week starts *" value={start} options={weekdays} onChange={setStart} />
        <Field label="Week ends" value={end} muted pale capitalize />
        <MenuField label="Regular payday *" value={payday} options={paydayOptions} onChange={setPayday} />
        <MenuField label="Withdrawal cut-off *" value={cutoff} options={leadOptions} onChange={setCutoff} />
      </div>
      <PreviewCard
        title="Weekly preview"
        action="Change one week"
        onAction={onException}
        rows={[
          ["Earning week", "1–6 Dec 2026"],
          ["Payday", "7 Dec 2026"],
          ["Withdrawal cut-off", "5 Dec 2026 · 23:59 WAT"],
        ]}
      />
    </>
  );
}

function DailyFields({ onException }: { onException: () => void }) {
  const [payday, setPayday] = useState("Following calendar day");
  const [payout, setPayout] = useState("18:00 WAT");
  const [cutoff, setCutoff] = useState("23:59 WAT");
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <MenuField label="Regular payday *" value={payday} options={dayLagOptions} onChange={setPayday} />
        <MenuField label="Payout time *" value={payout} options={payoutOptions} onChange={setPayout} />
        <MenuField label="Cut-off on workday *" value={cutoff} options={cutOptions} onChange={setCutoff} />
        <Field label="Earning period" value="One workday" muted pale />
      </div>
      <PreviewCard
        title="Daily preview"
        action="Change one workday"
        onAction={onException}
        rows={[
          ["Work date", "1 Dec 2026"],
          ["Payday", `2 Dec 2026 · ${payout}`],
          ["Withdrawal cut-off", `1 Dec 2026 · ${cutoff}`],
        ]}
      />
    </>
  );
}

function Field({ label, value, readOnly = true, muted = false, pale = false, capitalize = false }: { label: string; value: string; readOnly?: boolean; muted?: boolean; pale?: boolean; capitalize?: boolean }) {
  return (
    <label>
      <span className={cn(labelClass, capitalize && "capitalize")}>{label}</span>
      <input className={cn(fieldClass, (muted || pale) && "text-[#526459]", pale && "bg-[#f4f6f2]")} defaultValue={value} readOnly={readOnly} />
    </label>
  );
}

function MenuField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <span className={`${labelClass} capitalize`}>{label}</span>
      <button type="button" className={`${fieldClass} flex items-center justify-between text-left text-[#526459]`} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        {value}
        <img src="/icons/setup/caret.svg" alt="" className="size-4" />
      </button>
      {open ? (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#dce4de] bg-white p-1 shadow-lg">
          {options.map((item) => (
            <li key={item}>
              <button type="button" className="w-full rounded-md px-2.5 py-2 text-left text-sm text-[#0f2a1f] hover:bg-[#f4f5ef]" onClick={() => { onChange(item); setOpen(false); }}>
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function PreviewCard({ title, action, onAction, rows }: { title: string; action: string; onAction: () => void; rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-[#e7ebe4] bg-white px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-semibold text-[#0f2a1f]">{title}</p>
        <button type="button" className="inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-[7px] border border-[#dfe5dd] bg-white px-2.5 text-[13px] font-medium text-[#113829]" onClick={onAction}>
          <img src="/icons/setup/date.svg" alt="" className="size-[15px]" />
          {action}
        </button>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-[#526459]">{label}</dt>
            <dd className="text-[#0f2a1f]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#17803d]">
        <img src="/icons/setup/date.svg" alt="" className="size-3.5" />
        Regular dates
      </p>
    </div>
  );
}
