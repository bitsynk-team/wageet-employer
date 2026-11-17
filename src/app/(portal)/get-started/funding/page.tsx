"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusPill } from "@/components/portal/ui";
import { SetupActions, SetupCard, SetupPage } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";
import { cn } from "cn";

const presets = [10000, 15000, 20000, 50000];

export default function PrepareFundingPage() {
  const portal = usePortal();
  const router = useRouter();
  const [amount, setAmount] = useState(portal.fundingAmount ? String(portal.fundingAmount) : "");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [accounts, setAccounts] = useState(false);

  if (portal.fundingPhase === "transfer" || portal.fundingPhase === "expired") {
    return <TransferDetails />;
  }
  if (portal.fundingPhase === "confirming") {
    return <Confirming />;
  }

  function continueTransfer() {
    const value = Number(amount.replace(/[^\d]/g, ""));
    const result = portal.startFunding(value);
    if (result) setError(result);
  }

  const shown = amount ? naira(Number(amount.replace(/[^\d]/g, "")) || 0) : "₦0";

  return (
    <SetupPage eyebrow="Earnings & Funding Setup" title="Prepare funding" subtitle="Choose how much to add to your Wageet balance.">
      <section className="w-full max-w-[767px] rounded-2xl border border-[#e4e7e4] bg-white p-6">
        <p className="text-sm font-medium text-[#0f2a1f]">Transfer amount</p>
        <input className="mt-3 h-14 w-full rounded-xl border border-[#dce4de] px-4 text-2xl font-semibold text-[#0f2a1f] outline-none focus:border-[#0f2a1f]" inputMode="numeric" value={shown} onChange={(event) => setAmount(event.target.value.replace(/[^\d]/g, ""))} />
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button key={preset} type="button" onClick={() => setAmount(String(preset))} className={cn("h-8 rounded-lg border px-3 text-xs", amount === String(preset) ? "border-[#0f2a1f] bg-[#f4f5ef]" : "border-[#dce4de] bg-white")}>
              {naira(preset)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#526459]">Enter an amount or choose a preset.</p>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <p className="mt-4 rounded-lg bg-[#fff4e8] px-4 py-3 text-sm text-[#9a6700]">This account is for one transfer and expires after 10 minutes.</p>
        <button type="button" className="mt-4 text-sm font-medium text-[#0f2a1f] underline" onClick={() => setAccounts((open) => !open)}>Create permanent funding accounts</button>
        {accounts ? (
          <div className="mt-4 rounded-xl border border-[#e4e4e7] p-4">
            <p className="font-medium text-[#162e25]">Accounts for {portal.workspaceName}</p>
            <p className="mt-1 text-sm text-[#4e6358]">Wageet will create three bank accounts assigned only to {portal.workspaceName}. Transfers to any of them will credit your organisation’s Wageet balance.</p>
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              I authorise Wageet to create permanent funding accounts for {portal.workspaceName}.
            </label>
            {consentError ? <p className="mt-2 text-sm text-[#b42318]">Authorise the accounts before they can be created.</p> : null}
            <button
              type="button"
              className="mt-3 h-10 rounded-lg bg-[#153a2b] px-3 text-sm text-white"
              onClick={() => {
                if (!consent) {
                  setConsentError(true);
                  return;
                }
                portal.completeFunding(50000);
                router.push("/get-started");
              }}
            >
              Create funding accounts
            </button>
          </div>
        ) : null}
      </section>
      <div className="mt-4">
        <SetupActions backHref="/get-started" backLabel="Back to Get started" primary="Continue to transfer" onPrimary={continueTransfer} titleCase />
      </div>
    </SetupPage>
  );
}

function TransferDetails() {
  const portal = usePortal();
  const expired = portal.fundingPhase === "expired";
  return (
    <SetupPage title={expired ? "Your transfer account expired" : "Transfer to your one-time account"} subtitle={expired ? "Generate fresh details if you still need to make the transfer." : "Use your banking app to send the exact amount shown below."}>
      <SetupCard>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#162e25]">One-time account</h2>
          {expired ? <span className="inline-flex h-[22px] items-center rounded-full bg-[#f4f4f5] px-2 text-[11px] font-medium text-[#71717a]">Expired</span> : <StatusPill value="Active" />}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-[#71717a]">Account number</p>
            <p className="text-3xl font-semibold tracking-wide text-[#162e25]">0004106101</p>
          </div>
          {expired ? null : (
            <button type="button" className="h-9 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => navigator.clipboard?.writeText("0004106101").then(() => portal.notify("Account number copied."))}>
              Copy number
            </button>
          )}
        </div>
        <dl className="mt-4 space-y-3 border-t border-[#f0f2f0] pt-4 text-sm">
          {expired ? null : <Row label="Bank" value="Titan Trust Bank" />}
          {expired ? null : <Row label="Account name" value={`Wageet / ${portal.workspaceName}`} />}
          <Row label={expired ? "Transfer amount" : "Amount to transfer"} value={naira(portal.fundingAmount || 50000)} />
          <Row label={expired ? "Expired at" : "Expires at"} value="11:10 WAT" />
        </dl>
        <p className={cn("mt-4 rounded-lg px-3 py-2 text-sm", expired ? "bg-[#f4f4f5] text-[#4e6358]" : "bg-[#fff6e8] text-[#9a6700]")}>
          {expired ? "Use a new account for your next transfer. If you already sent the money, check its status before sending again." : "Valid for 10 minutes. Use this account for this transfer only."}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/get-started" className="inline-flex h-11 items-center justify-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Back to Get started</Link>
          {expired ? (
            <>
              <button type="button" className="h-11 rounded-lg bg-[#153a2b] px-4 text-sm text-white" onClick={() => portal.startFunding(portal.fundingAmount || 50000)}>Generate new account</button>
              <button type="button" className="h-11 rounded-lg border border-[#e4e4e7] px-4 text-sm" onClick={() => portal.confirmFunding()}>I already transferred</button>
            </>
          ) : (
            <>
              <button type="button" className="h-11 rounded-lg bg-[#153a2b] px-4 text-sm text-white" onClick={() => portal.confirmFunding()}>I’ve made the transfer</button>
              <button type="button" className="h-11 px-2 text-sm text-[#4e6358]" onClick={() => portal.expireFunding()}>This account expired</button>
            </>
          )}
        </div>
      </SetupCard>
    </SetupPage>
  );
}

function Confirming() {
  const portal = usePortal();
  const router = useRouter();
  return (
    <SetupPage title="Confirming your transfer" subtitle="Wageet will update your setup checklist when your bank confirms the deposit.">
      <SetupCard>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#162e25]">Awaiting bank confirmation</h2>
          <StatusPill value="Pending" />
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Expected transfer" value={naira(portal.fundingAmount || 50000)} />
          <Row label="Receiving bank" value="Titan Trust Bank" />
          <Row label="Account number" value="0004106101" />
          <Row label="Beneficiary" value={`Wageet / ${portal.workspaceName}`} />
        </dl>
        <p className="mt-4 text-sm text-[#4e6358]">You can return to Get started while we check with your bank. Your funding step stays open until the deposit arrives.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/get-started" className="inline-flex h-11 items-center justify-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Back to Get started</Link>
          <button
            type="button"
            className="h-11 rounded-lg bg-[#153a2b] px-4 text-sm text-white"
            onClick={() => {
              portal.completeFunding();
              router.push("/get-started");
            }}
          >
            Bank confirmed the deposit
          </button>
        </div>
      </SetupCard>
    </SetupPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[#71717a]">{label}</dt>
      <dd className="font-medium text-[#162e25]">{value}</dd>
    </div>
  );
}
