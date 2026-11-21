"use client";

import { useState } from "react";
import { Modal } from "@/components/portal/ui";

export const weekPeriods = ["1–6 Dec 2026", "7–13 Dec 2026", "14–20 Dec 2026", "21–27 Dec 2026"];
export const weekPaydays = [
  "3 days before week end",
  "2 days before week end",
  "1 day before week end",
  "On the week’s last day",
  "Day after the week ends",
  "2 days after the week ends",
  "3 days after the week ends",
];
export const weekCutoffs = ["1 day before payday", "2 days before payday", "3 days before payday"];

const regular = { payday: "Day after the week ends", cutoff: "2 days before payday" };

export function WeekExceptionDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (value: { period: string; payday: string; cutoff: string }) => void;
}) {
  const [period, setPeriod] = useState(weekPeriods[0]);
  const [payday, setPayday] = useState(regular.payday);
  const [cutoff, setCutoff] = useState(regular.cutoff);
  const [pendingPeriod, setPendingPeriod] = useState<string | null>(null);
  const dirty = payday !== regular.payday || cutoff !== regular.cutoff;

  function choosePeriod(next: string) {
    if (next === period) return;
    if (dirty) setPendingPeriod(next);
    else setPeriod(next);
  }

  function reset() {
    setPayday(regular.payday);
    setCutoff(regular.cutoff);
  }

  return (
    <>
      <Modal open={open} title="Change one week" description="Choose the earning period, then adjust when employees can withdraw and when they get paid." onClose={onClose}>
        <div className="space-y-3">
          <Menu label="Earning period" value={period} options={weekPeriods} onChange={choosePeriod} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Menu label="Payday" value={payday} options={weekPaydays} onChange={setPayday} />
            <Menu label="Withdrawal cut-off" value={cutoff} options={weekCutoffs} onChange={setCutoff} />
          </div>
          <p className="text-sm text-[#526459]">Only this week changes. The earning period and regular schedule stay the same.</p>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={() => { reset(); onClose(); }}>Use regular dates</button>
            <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={onClose}>Cancel</button>
            <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-3 text-sm text-[#fffff4]" onClick={() => { onSaved({ period, payday, cutoff }); onClose(); }}>Save exception</button>
          </div>
        </div>
      </Modal>
      <Modal open={Boolean(pendingPeriod)} title="Switch earning period?" description="Changes to these dates haven’t been saved." onClose={() => setPendingPeriod(null)}>
        <div className="flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setPendingPeriod(null)}>Keep editing</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { if (pendingPeriod) setPeriod(pendingPeriod); reset(); setPendingPeriod(null); }}>Discard and switch</button>
        </div>
      </Modal>
    </>
  );
}

function Menu({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#162e25]">{label}</span>
      <select className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] bg-white px-3 text-sm text-[#162e25] outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
