"use client";

import { useState } from "react";
import { Modal } from "@/components/portal/ui";
import { SetupPage, SupportLine, fieldClass } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";
import { cn } from "cn";

const banks = ["Access Bank", "GTBank", "UBA", "Zenith", "First Bank"];

export default function SetupBanksPage() {
  const portal = usePortal();
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  function save() {
    if (!bank || account.trim().length < 10) {
      setError("Enter bank details to request verification.");
      return;
    }
    const last = account.trim().slice(-4);
    portal.saveSetupBank(email, `${bank} · •••• ${last}`);
    setEmail("");
    setError("");
  }

  return (
    <SetupPage title="Complete Bank Details" subtitle="Add or correct bank details for employees who still need them.">
      <div className="overflow-x-auto rounded-2xl border border-[#e7ebe4] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="bg-[#f6f7f4] text-xs text-[#71717a]">
              {["Invitation email", "Invitation status", "Bank details", "Bank status", "Action"].map((heading) => (
                <th key={heading} className="px-4 py-3 text-center font-medium first:text-left">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {portal.setupBanks.map((row) => (
              <tr key={row.email} className="border-t border-dashed border-[#e7ebe4]">
                <td className="px-4 py-4 text-[#0f2a1f]">{row.email}</td>
                <td className="px-4 py-4 text-center"><Tone value={row.invitation} tone="gold" /></td>
                <td className={cn("px-4 py-4 text-center", row.details === "Not provided" ? "text-[#b58105]" : "text-[#0f2a1f]")}>{row.details}</td>
                <td className="px-4 py-4 text-center"><Tone value={row.bankStatus} tone={row.bankStatus === "Verification failed" ? "red" : row.bankStatus === "Verified" ? "green" : "gold"} /></td>
                <td className="px-4 py-4 text-center">
                  {row.bankStatus === "Verified" ? <span className="text-xs text-[#17803d]">Saved</span> : (
                    <button type="button" className="inline-flex h-9 items-center rounded-lg border border-[#dce4de] bg-white px-3 text-xs font-medium text-[#0f2a1f]" onClick={() => { setEmail(row.email); setError(""); }}>
                      {row.bankStatus === "Verification failed" ? "Review Details" : "Add Bank Details"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 pb-4">
          <SupportLine align="left" />
        </div>
      </div>
      <Modal open={Boolean(email)} title="Bank Details" description={email} onClose={() => setEmail("")}>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[#162e25]">Bank Name</span>
            <select className={fieldClass} value={bank} onChange={(event) => setBank(event.target.value)}>
              <option value="">Select a Bank</option>
              {banks.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-[#162e25]">Account Number</span>
            <input className={fieldClass} placeholder="Enter account number" value={account} onChange={(event) => setAccount(event.target.value)} />
          </label>
        </div>
        <p className="mt-2 text-sm text-[#4e6358]">Enter bank details to request verification.</p>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setEmail("")}>Cancel</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm text-white" onClick={save}>Confirm & Save</button>
        </div>
      </Modal>
    </SetupPage>
  );
}

function Tone({ value, tone }: { value: string; tone: "gold" | "red" | "green" }) {
  const styles = {
    gold: "bg-[#fbf1e0] text-[#b54708]",
    red: "bg-[#fdecec] text-[#d92d20]",
    green: "bg-[#e7f6ee] text-[#17803d]",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", styles[tone])}><span className="size-1.5 rounded-full bg-current" />{value}</span>;
}
