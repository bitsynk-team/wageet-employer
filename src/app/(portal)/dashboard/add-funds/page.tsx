"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";
import { cn } from "cn";

const presets = [10000, 15000, 20000, 50000];

export default function AddFundsPage() {
  const portal = usePortal();
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [transfer, setTransfer] = useState(false);
  const shown = amount ? naira(Number(amount) || 0) : "₦0";

  function continueTransfer() {
    const value = Number(amount);
    const result = portal.startFunding(value);
    if (result) {
      setError(result);
      return;
    }
    setTransfer(true);
  }

  if (transfer) {
    return (
      <div className="px-4 py-4">
        <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Transfer details</h1>
        <p className="mt-1 text-sm text-[#526459]">Send {naira(portal.fundingAmount)} to the one-time account below.</p>
        <section className="mt-4 max-w-[720px] rounded-2xl border border-[#e4e7e4] bg-white p-5">
          <p className="text-sm text-[#526459]">Account number</p>
          <p className="text-3xl font-semibold tracking-wide text-[#0f2a1f]">0004106101</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[#526459]">Bank</dt><dd>Titan Trust Bank</dd></div>
            <div className="flex justify-between"><dt className="text-[#526459]">Account name</dt><dd>Wageet / {portal.workspaceName}</dd></div>
            <div className="flex justify-between"><dt className="text-[#526459]">Expires</dt><dd>10 minutes</dd></div>
          </dl>
          <button type="button" className="mt-4 h-10 rounded-lg bg-[#0f2a1f] px-4 text-xs font-bold text-[#fffff4]" onClick={() => { portal.confirmFunding(); router.push("/transactions?type=Top-up"); }}>I’ve made the transfer</button>
        </section>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-[22px] font-semibold text-[#0f2a1f]">Add funds</h1>
      <p className="mt-1 text-sm text-[#526459]">Generate a temporary account to fund your Wageet balance by bank transfer.</p>
      <section className="mt-4 max-w-[720px] rounded-2xl bg-[#0f2a1f] px-5 py-4 text-white">
        <p className="text-sm text-white/80">Available Wageet balance</p>
        <p className="mt-1 text-4xl font-semibold">{naira(portal.balance)}</p>
        <p className="mt-1 text-sm text-white/70">{portal.workspaceName} · NGN</p>
      </section>
      <section className="mt-4 max-w-[720px] rounded-2xl border border-[#e4e7e4] bg-white p-5">
        <h2 className="text-lg font-semibold text-[#0f2a1f]">One-time transfer</h2>
        <p className="mt-1 text-sm text-[#526459]">Choose an amount to generate a bank account for this transfer.</p>
        <p className="mt-4 text-sm font-medium text-[#0f2a1f]">Transfer amount</p>
        <input className="mt-2 h-14 w-full rounded-xl border border-[#dce4de] px-4 text-2xl font-semibold outline-none focus:border-[#0f2a1f]" inputMode="numeric" value={shown} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} />
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button key={preset} type="button" onClick={() => setAmount(String(preset))} className={cn("h-8 rounded-lg border px-3 text-xs", amount === String(preset) ? "border-[#0f2a1f] bg-[#f4f5ef]" : "border-[#dce4de]")}>
              {naira(preset)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#526459]">Enter an amount or choose a preset.</p>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <p className="mt-4 rounded-lg bg-[#fff4e8] px-4 py-3 text-sm text-[#9a6700]">The account expires 10 minutes after you continue.</p>
        <button type="button" className="mt-4 h-11 rounded-lg bg-[#0f2a1f] px-4 text-xs font-bold text-[#fffff4]" onClick={continueTransfer}>Continue To Transfer</button>
      </section>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/dashboard" className="inline-flex h-11 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-xs font-medium text-[#0f2a1f]">Back To Setup</Link>
        <Link href="/transactions?type=Top-up" className="inline-flex h-11 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-xs font-medium text-[#0f2a1f]">View Funding Activity</Link>
      </div>
    </div>
  );
}
