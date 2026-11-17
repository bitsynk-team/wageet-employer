"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { StatusPill } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import { naira } from "@/lib/mock-data";
import type { Employee } from "@/lib/types";
import { cn } from "cn";

const banks = ["Access Bank", "Guaranty Trust Bank", "Zenith Bank", "United Bank for Africa"];
const departments = ["Operations", "People operations", "Production"];

export default function EmployeeDetailPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-[#526459]">Loading employee…</p>}>
      <EmployeeDetail />
    </Suspense>
  );
}

function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const portal = usePortal();
  const person = portal.employees.find((item) => item.id === id);
  const [tab, setTab] = useState<"overview" | "transactions">(params.get("view") === "transactions" ? "transactions" : "overview");
  const [invitation, setInvitation] = useState(params.get("view") === "invitation");
  const [editor, setEditor] = useState(params.get("edit") === "1");
  const [endOpen, setEndOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [receipt, setReceipt] = useState<Withdrawal | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);

  if (!person) {
    return (
      <div className="p-6">
        <p className="text-sm text-[#526459]">That employee is not in this workspace.</p>
        <Link href="/employees" className="mt-3 inline-block text-sm font-medium text-[#0f2a1f]">All employees</Link>
      </div>
    );
  }

  if (invitation || person.status === "Invited") {
    return (
      <InvitationDetails
        person={person}
        emailOpen={emailOpen}
        onEmail={() => setEmailOpen(true)}
        onCloseEmail={() => setEmailOpen(false)}
        onBack={() => {
          if (person.status === "Invited") return;
          setInvitation(false);
        }}
      />
    );
  }

  const money = figures(person);
  const initials = person.name.split(" ").map((part) => part[0]).slice(0, 2).join("");
  const withdrawals = person.id === "ada" ? adaWithdrawals : [];

  return (
    <div className="px-4 py-4">
      <Link href="/employees" className="inline-flex items-center gap-2 text-sm font-medium text-[#162e25]">← All employees</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#e7f3ea] text-sm font-semibold text-[#0f2a1f]">{initials}</span>
          <div>
            <h1 className="text-xl font-semibold text-[#0f2a1f]">{person.name}</h1>
            <p className="text-sm text-[#526459]">{person.code} · {person.email}</p>
          </div>
        </div>
        <button type="button" className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-3 text-sm" onClick={() => setEditor(true)}>Edit employment</button>
      </div>
      <div className="mt-4 flex gap-6 border-b border-[#ececed] text-xs font-semibold tracking-[0.08em]">
        <button type="button" className={cn("pb-2", tab === "overview" ? "border-b-2 border-[#153a2b] text-[#162e25]" : "text-[#71717a]")} onClick={() => setTab("overview")}>OVERVIEW</button>
        <button type="button" className={cn("pb-2", tab === "transactions" ? "border-b-2 border-[#153a2b] text-[#162e25]" : "text-[#71717a]")} onClick={() => setTab("transactions")}>TRANSACTIONS</button>
      </div>

      {tab === "overview" ? (
        <div className="mt-4 space-y-4">
          <section className="rounded-2xl bg-[#f6f7f4] p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#0f2a1f]">Withdrawal eligibility</h2>
              <span className="text-xs text-[#526459]">1–30 October 2026</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              <Metric label="Available now" value={naira(money.available)} mint />
              <Metric label="Confirmed earnings" value={naira(money.confirmed)} />
              <Metric label="Already accessed" value={naira(money.accessed)} />
              <Metric label="Pending withdrawals" value={money.pending === 0 ? "₦0" : naira(money.pending)} />
            </div>
          </section>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#e7ebe4] p-4">
              <h2 className="font-semibold text-[#0f2a1f]">Available amount breakdown</h2>
              <dl className="mt-3 divide-y divide-[#f0f2f0] text-sm">
                <Row label="Employer allowance · 60%" value={naira(money.allowance)} />
                <Row label="Personal withdrawal limit" value={money.limit} />
                <Row label="After withdrawals and pending amounts" value={naira(money.after)} />
                <Row label="Available to withdraw" value={naira(money.withdraw)} />
                <Row label="Minimum tenure" value={money.tenure} />
              </dl>
              <p className={cn("mt-3 rounded-lg px-3 py-2 text-sm", money.eligible ? "bg-[#e7f6ee] text-[#17803d]" : "bg-[#fff4e8] text-[#9a6700]")}>
                {money.eligible ? "Eligible to withdraw" : money.note}
              </p>
            </section>
            <section className="rounded-2xl border border-[#e7ebe4] p-4">
              <h2 className="font-semibold text-[#0f2a1f]">Workplace details</h2>
              <dl className="mt-3 divide-y divide-[#f0f2f0] text-sm">
                <Row label="Employer" value={portal.workspaceName} />
                <Row label="Employment status" value={person.status} />
                <Row label="Department" value={person.department} />
                <Row label="Start date" value={person.joined} />
                <Row label="Workspace invitation" value={person.status === "Active" || person.status === "Inactive" ? "Linked" : "Pending"} />
                <Row label="Identity verification" value={person.account === "Verified" ? "Verified" : "Pending"} />
              </dl>
              <div className="mt-3 flex justify-end">
                <button type="button" className="h-9 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={() => setInvitation(true)}>View invitation</button>
              </div>
            </section>
          </div>
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e7ebe4] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#0f2a1f]">Receiving bank account</p>
              {person.account === "Verified" ? (
                <p className="mt-2 flex items-center gap-2 text-sm"><span className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ee] px-2 py-0.5 text-[11px] font-medium text-[#17803d]">● Verified</span> {person.bank}</p>
              ) : (
                <p className="mt-2 text-sm text-[#b58105]">Bank details are missing.</p>
              )}
            </div>
            <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={() => setBankOpen(true)}>{person.account === "Verified" ? "Replace bank details" : "Add bank details"}</button>
          </section>
        </div>
      ) : (
        <section className="mt-4 rounded-2xl border border-[#e7ebe4] p-4">
          <h2 className="font-semibold text-[#0f2a1f]">Withdrawal history</h2>
          <p className="text-sm text-[#526459]">{portal.workspaceName} · October 2026</p>
          {withdrawals.length === 0 ? (
            <p className="mt-6 text-sm text-[#526459]">No withdrawals for this workplace yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-xs text-[#71717a]">
                    {["Reference", "Requested (WAT)", "Status", "Amount", ""].map((heading) => <th key={heading || "go"} className="px-2 py-2 font-medium">{heading}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((item) => (
                    <tr key={item.reference} className="border-t border-[#f0f2f0]">
                      <td className="px-2 py-3">{item.reference}</td>
                      <td className="px-2 py-3">{item.requested}</td>
                      <td className="px-2 py-3"><StatusPill value={item.status} /></td>
                      <td className="px-2 py-3">{naira(item.amount)}</td>
                      <td className="px-2 py-3"><button type="button" className="text-[#17803d]" onClick={() => setReceipt(item)}>View details →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {editor ? <EmploymentEditor person={person} onClose={() => setEditor(false)} onEnd={() => { setEditor(false); setEndOpen(true); }} onRestore={() => { setEditor(false); setRestoreOpen(true); }} /> : null}
      {endOpen ? <Confirm title="End workplace access?" body="The employee will lose access to this workplace immediately. New withdrawals stop. Previous transactions remain available to payroll." person={person} confirm="End access" onClose={() => setEndOpen(false)} onConfirm={() => { portal.patchEmployee(person.id, { status: "Inactive" }); portal.notify("Workplace access ended."); setEndOpen(false); }} /> : null}
      {restoreOpen ? <Confirm title="Restore workplace access?" body="The employee can open this workplace again. Eligibility will be checked against the current policy." person={person} confirm="Restore access" onClose={() => setRestoreOpen(false)} onConfirm={() => { portal.patchEmployee(person.id, { status: "Active" }); portal.notify("Workplace access restored."); setRestoreOpen(false); }} /> : null}
      {bankOpen ? <BankDialog person={person} onClose={() => setBankOpen(false)} /> : null}
      {receipt ? <Receipt person={person} item={receipt} onClose={() => setReceipt(null)} /> : null}
    </div>
  );
}

function InvitationDetails({ person, emailOpen, onEmail, onCloseEmail, onBack }: { person: Employee; emailOpen: boolean; onEmail: () => void; onCloseEmail: () => void; onBack: () => void }) {
  const portal = usePortal();
  const failed = person.delivery === "Delivery failed";
  return (
    <div className="px-4 py-4">
      <Link href={person.status === "Invited" ? "/employees?view=invited" : "/employees"} className="text-sm font-medium text-[#162e25]" onClick={(event) => {
        if (person.status !== "Invited") {
          event.preventDefault();
          onBack();
        }
      }}>← {person.status === "Invited" ? "Invited" : "Employee details"}</Link>
      <h1 className="mt-4 text-xl font-semibold text-[#0f2a1f]">{person.name}</h1>
      <p className="text-sm text-[#526459]">Invitation to {portal.workspaceName}</p>
      <section className="mt-4 max-w-3xl rounded-2xl border border-[#e7ebe4] p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Workspace invitation</h2>
          <StatusPill value={failed ? "Delivery failed" : "Pending"} />
        </div>
        <dl className="mt-3 divide-y divide-[#f0f2f0] text-sm">
          <Row label="Invitation address" value={person.email} />
          <Row label="Delivery" value={failed ? "Email could not be delivered" : "Email delivered"} />
          <Row label="Invited by" value={person.invitedBy} />
          <Row label="Invitation date" value={person.joined} />
        </dl>
        {failed ? <p className="mt-3 text-sm text-[#b42318]">The email could not be delivered. Check the invitation address, then reissue it.</p> : null}
        <div className="mt-4 flex gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#dce4de] px-3 text-sm" onClick={onEmail}>Correct email</button>
          <button type="button" className="h-10 rounded-lg bg-[#0f2a1f] px-3 text-xs font-bold text-[#fffff4]" onClick={() => { portal.patchEmployee(person.id, { delivery: "Pending" }); portal.notify("Invitation resent."); }}>Resend invitation</button>
        </div>
      </section>
      <section className="mt-4 max-w-3xl rounded-2xl bg-[#f6f7f4] p-4 text-sm text-[#526459]">
        <h2 className="font-semibold text-[#0f2a1f]">What the employee does next</h2>
        <p className="mt-2">The employee verifies this invitation email, then links {portal.workspaceName} to their Wageet account.</p>
        <p className="mt-2">The invitation stays valid. An expired verification code can be requested again.</p>
      </section>
      {emailOpen ? <EmailDialog person={person} onClose={onCloseEmail} /> : null}
    </div>
  );
}

function EmploymentEditor({ person, onClose, onEnd, onRestore }: { person: Employee; onClose: () => void; onEnd: () => void; onRestore: () => void }) {
  const portal = usePortal();
  const [department, setDepartment] = useState(person.department);
  const [start, setStart] = useState(person.joined);
  const [openDept, setOpenDept] = useState(false);
  return (
    <Dialog title="Edit employment" onClose={onClose}>
      <p className="text-sm text-[#526459]">Changes apply to this employment at {portal.workspaceName}.</p>
      <dl className="mt-3 text-sm">
        <Row label="Employee" value={person.name} />
        <Row label="Workplace ID" value={person.code} />
      </dl>
      <div className="relative mt-3">
        <span className="mb-1 block text-sm font-medium">Department</span>
        <button type="button" className="flex h-11 w-full items-center justify-between rounded-lg border border-[#dce4de] px-3 text-sm" onClick={() => setOpenDept((open) => !open)}>{department}</button>
        {openDept ? (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-[#e7e9e9] bg-white p-1 shadow-lg">
            {departments.map((item) => <li key={item}><button type="button" className="w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f6f7f4]" onClick={() => { setDepartment(item); setOpenDept(false); }}>{item}</button></li>)}
          </ul>
        ) : null}
      </div>
      <label className="mt-3 block text-sm">
        <span className="mb-1 block font-medium">Employment start date</span>
        <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={start} onChange={(event) => setStart(event.target.value)} />
        <span className="mt-1 block text-xs text-[#526459]">The start date is used to check the policy’s 30-day minimum employment period.</span>
      </label>
      <p className="mt-3 text-sm">Employment is <span className="font-medium">{person.status}</span>.</p>
      {person.status === "Inactive" ? (
        <button type="button" className="mt-2 text-sm font-medium text-[#17803d]" onClick={onRestore}>Restore workplace access</button>
      ) : (
        <button type="button" className="mt-2 text-sm font-medium text-[#b42318]" onClick={onEnd}>End workplace access</button>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={onClose}>Cancel</button>
        <button type="button" className="h-11 rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={() => { portal.patchEmployee(person.id, { department, joined: start }); portal.notify("Employment saved."); onClose(); }}>Save changes</button>
      </div>
    </Dialog>
  );
}

function BankDialog({ person, onClose }: { person: Employee; onClose: () => void }) {
  const portal = usePortal();
  const [bank, setBank] = useState(banks[0]);
  const [account, setAccount] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const holder = account === "1023456789" ? "Hamzah Ridwanullah Opemipo" : person.name;

  function verify() {
    if (!/^\d{10}$/.test(account)) {
      setError("Enter a 10-digit account number.");
      return;
    }
    if (account !== "1023456789" && account.endsWith("0000")) {
      setError("Couldn’t verify this account number.");
      return;
    }
    setError("");
    setVerified(true);
  }

  return (
    <Dialog title={verified ? "Confirm receiving account" : "Receiving bank details"} onClose={onClose}>
      {verified ? (
        <>
          <p className="text-sm text-[#17803d]">Account verified</p>
          <dl className="mt-3 text-sm">
            <Row label="Account holder" value={holder} />
            <Row label="Bank" value={bank} />
            <Row label="Account number" value={account} />
          </dl>
          <p className="mt-3 text-sm text-[#526459]">Future withdrawals will use this account. Earlier transactions keep their original destination.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={() => setVerified(false)}>Back</button>
            <button type="button" className="h-11 rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={() => { portal.saveBank(person.id, `${bank} · •••• ${account.slice(-4)}`); onClose(); }}>Confirm and save</button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-[#526459]">Enter the employee’s bank and account number, then verify the account holder.</p>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium">Bank</span>
            <select className="h-11 w-full rounded-lg border border-[#dce4de] px-3" value={bank} onChange={(event) => setBank(event.target.value)}>{banks.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block font-medium">Account number</span>
            <input className="h-11 w-full rounded-lg border border-[#dce4de] px-3" placeholder="Enter 10-digit account number" value={account} onChange={(event) => setAccount(event.target.value.replace(/\D/g, "").slice(0, 10))} />
          </label>
          {error ? <p className="mt-2 text-xs text-[#d92d20]">{error}</p> : null}
          <p className="mt-3 text-xs text-[#526459]">A replacement becomes the withdrawal destination only after verification and confirmation.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={onClose}>Cancel</button>
            <button type="button" className="h-11 rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={verify}>Verify account</button>
          </div>
        </>
      )}
    </Dialog>
  );
}

function EmailDialog({ person, onClose }: { person: Employee; onClose: () => void }) {
  const portal = usePortal();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return (
    <Dialog title="Correct invitation email" onClose={onClose}>
      <p className="text-sm text-[#526459]">Enter the new workplace email to send a replacement invitation.</p>
      <p className="mt-3 text-sm">Current address · {person.email}</p>
      <input className="mt-2 h-11 w-full rounded-lg border border-[#dce4de] px-3 text-sm" placeholder="Enter corrected workplace email" value={email} onChange={(event) => setEmail(event.target.value)} />
      {error ? <p className="mt-2 text-xs text-[#d92d20]">{error}</p> : null}
      <p className="mt-3 text-xs text-[#526459]">The previous address will no longer be able to claim this invitation.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={onClose}>Cancel</button>
        <button type="button" className="h-11 rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={() => {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid workplace email.");
            return;
          }
          portal.patchEmployee(person.id, { email, delivery: "Pending" });
          portal.notify("Replacement invitation sent.");
          onClose();
        }}>Send replacement</button>
      </div>
    </Dialog>
  );
}

function Receipt({ person, item, onClose }: { person: Employee; item: Withdrawal; onClose: () => void }) {
  const portal = usePortal();
  const failed = item.status === "Failed";
  return (
    <Dialog title="Withdrawal details" onClose={onClose}>
      <p className="text-sm text-[#526459]">{portal.workspaceName} · October 2026</p>
      <dl className="mt-3 text-sm">
        <Row label="Employee" value={person.name} />
        <Row label="Transaction reference" value={item.reference} />
        <Row label="Requested" value={item.requested} />
        <Row label="Status" value={item.status} />
        <Row label="Withdrawal amount" value={naira(item.amount)} />
        <Row label="Transfer fee" value="₦0" />
        <Row label="Counted toward payroll" value={failed ? "₦0" : naira(item.amount)} />
        <Row label="Receiving account" value={person.bank} />
      </dl>
      <p className="mt-3 text-sm text-[#526459]">{failed ? "The bank did not complete this transfer. No amount was deducted from this employee’s pay." : "Transferred to the receiving account."}</p>
      <button type="button" className="mt-4 h-11 w-full rounded-lg bg-[#0f2a1f] text-sm font-bold text-[#fffff4]" onClick={onClose}>Done</button>
    </Dialog>
  );
}

function Confirm({ title, body, person, confirm, onClose, onConfirm }: { title: string; body: string; person: Employee; confirm: string; onClose: () => void; onConfirm: () => void }) {
  const portal = usePortal();
  return (
    <Dialog title={title} onClose={onClose}>
      <p className="text-sm text-[#526459]">{body}</p>
      <dl className="mt-3 text-sm">
        <Row label="Employee" value={person.name} />
        <Row label="Workspace" value={portal.workspaceName} />
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" className="h-11 rounded-lg border border-[#dce4de]" onClick={onClose}>{confirm === "End access" ? "Back" : "Cancel"}</button>
        <button type="button" className={cn("h-11 rounded-lg text-sm font-bold text-[#fffff4]", confirm === "End access" ? "bg-[#b42318]" : "bg-[#0f2a1f]")} onClick={onConfirm}>{confirm}</button>
      </div>
    </Dialog>
  );
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-[#0f2a1f]/40" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold text-[#0f2a1f]">{title}</h2>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

function Metric({ label, value, mint }: { label: string; value: string; mint?: boolean }) {
  return (
    <div className={cn("rounded-xl px-3 py-3", mint ? "bg-[#e7f3ea]" : "bg-white")}>
      <p className="text-xs text-[#526459]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#0f2a1f]">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-[#526459]">{label}</dt>
      <dd className="text-right font-medium text-[#0f2a1f]">{value}</dd>
    </div>
  );
}

type Withdrawal = { reference: string; requested: string; status: "Successful" | "Failed"; amount: number };

const adaWithdrawals: Withdrawal[] = [
  { reference: "WGT-ACM-1042", requested: "10 Oct · 10:42 am", status: "Successful", amount: 12000 },
  { reference: "WGT-ACM-0508", requested: "05 Oct · 2:18 pm", status: "Failed", amount: 5000 },
];

function figures(person: Employee) {
  if (person.status === "Inactive") {
    return { available: 0, confirmed: 0, accessed: 0, pending: 0, allowance: 0, limit: "Full employer allowance", after: 0, withdraw: 0, tenure: "Access ended", eligible: false, note: "Workplace access has ended." };
  }
  if (person.account === "Missing") {
    return { available: 0, confirmed: 80000, accessed: 0, pending: 0, allowance: 48000, limit: "50% of ₦48,000 = ₦24,000", after: 0, withdraw: 0, tenure: "30-day requirement met", eligible: false, note: "A verified receiving account is required before withdrawal." };
  }
  if (person.id === "ada") {
    return { available: 35600, confirmed: 100000, accessed: 24400, pending: 0, allowance: 60000, limit: "Full employer allowance", after: 35600, withdraw: 35600, tenure: "30-day requirement met", eligible: true, note: "" };
  }
  return { available: 18000, confirmed: 50000, accessed: 12000, pending: 0, allowance: 30000, limit: "Full employer allowance", after: 18000, withdraw: 18000, tenure: "30-day requirement met", eligible: true, note: "" };
}
