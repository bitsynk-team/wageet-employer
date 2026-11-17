"use client";

import { useState } from "react";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { usePortal } from "@/components/portal/store";

const alerts = [
  ["Payroll deadlines", "Cutoffs, paydays and exceptions that need a review."],
  ["Funding & payouts", "Confirmed top-ups, failed transfers and reversals."],
  ["Earnings delivery", "Missed syncs, rejected records and upload issues."],
  ["Employee setup", "Invitation failures and bank verification issues."],
];

export default function NotificationSettingsPage() {
  const portal = usePortal();
  const [selected, setSelected] = useState<string[]>(alerts.map(([title]) => title));

  function toggle(title: string) {
    setSelected((current) => {
      const next = current.includes(title) ? current.filter((item) => item !== title) : [...current, title];
      portal.notify(next.length ? "Notification preferences saved." : "Optional alerts are off. Security notices still send.");
      return next;
    });
  }

  return (
    <SettingsFrame description="Choose which workplace alerts reach your administrator email." aside={
      <aside className="rounded-2xl bg-[#f4f5ef] p-4 text-sm text-[#4e6358]">
        <h2 className="font-semibold text-[#162e25]">Delivery channels</h2>
        <p className="mt-2">Alerts go to the email address you use to sign in to the employer portal.</p>
        <p className="mt-3 font-medium text-[#162e25]">Security notices</p>
        <p className="mt-1">Sign-in and account recovery emails are always delivered.</p>
      </aside>
    }>
      <section className="rounded-2xl border border-[#e4e4e7] p-4">
        <h2 className="font-semibold text-[#162e25]">Email alerts</h2>
        <p className="mt-1 text-sm text-[#4e6358]">Choose which workplace events reach your sign-in email. Changes save automatically.</p>
        <ul className="mt-4 divide-y divide-[#f0f2f0]">
          {alerts.map(([title, body]) => (
            <li key={title} className="flex items-center justify-between gap-4 py-3">
              <span>
                <span className="block text-sm font-medium text-[#162e25]">{title}</span>
                <span className="block text-sm text-[#4e6358]">{body}</span>
              </span>
              <button type="button" role="switch" aria-checked={selected.includes(title)} onClick={() => toggle(title)} className={`relative h-6 w-11 rounded-full ${selected.includes(title) ? "bg-[#153a2b]" : "bg-[#d4d4d8]"}`}>
                <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${selected.includes(title) ? "left-5" : "left-0.5"}`} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </SettingsFrame>
  );
}
