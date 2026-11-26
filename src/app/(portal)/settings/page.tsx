"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { usePortal } from "@/components/portal/store";

export default function SettingsPage() {
  const portal = usePortal();
  const [editOpen, setEditOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [name, setName] = useState(portal.profile.name);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<"saved" | "pending" | "updated" | null>(null);
  const initials = portal.profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <SettingsFrame description="Manage your administrator profile and sign-in details." aside={
      <aside className="rounded-2xl border border-[#e4e4e7] p-5 text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-[#f8e7df] text-lg font-semibold text-[#9a3412]">{initials}</span>
        <p className="mt-3 font-semibold text-[#162e25]">{portal.profile.name}</p>
        <p className="text-sm text-[#4e6358]">{portal.profile.email}</p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#e7f6ee] px-2 py-1 text-xs font-medium text-[#17803d]">✓ Active administrator</p>
      </aside>
    }>
      <section className="rounded-2xl border border-[#e4e4e7] bg-[#f8faf8] p-4">
        <h2 className="font-semibold text-[#162e25]">Personal information</h2>
        <p className="mt-1 text-sm text-[#4e6358]">Your name appears beside changes you make in the employer portal.</p>
        <div className="mt-4 rounded-xl border border-[#e4e4e7] bg-white p-4">
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Display name</span>
            <input readOnly value={portal.profile.name} className="mt-1.5 h-11 w-full rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 text-sm" />
          </label>
          <div className="mt-4">
            <span className="text-sm font-medium text-[#162e25]">Sign-in email</span>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input readOnly value={portal.profile.email} className="h-11 min-w-0 flex-1 rounded-lg border border-[#e4e4e7] bg-[#fafafa] px-3 text-sm" />
              <button type="button" className="h-11 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm" onClick={() => setEmailOpen(true)}>Change email</button>
            </div>
          </div>
          {notice === "saved" ? <p className="mt-3 rounded-lg border border-[#d7eadc] bg-[#e7f6ee] px-3 py-2 text-sm text-[#17803d]">Your profile has been saved.</p> : null}
          {notice === "pending" ? <p className="mt-3 rounded-lg border border-[#f4e4c4] bg-[#fbf6ea] px-3 py-2 text-sm text-[#8a5a10]">Awaiting verification · <Link href="/help/new" className="font-medium underline">Review request</Link></p> : null}
          {notice === "updated" ? <p className="mt-3 rounded-lg border border-[#d7eadc] bg-[#e7f6ee] px-3 py-2 text-sm text-[#17803d]">Sign-in email updated · <Link href="/settings/audit" className="font-medium underline">View audit log</Link></p> : null}
          <div className="mt-4 flex justify-end">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { setName(portal.profile.name); setError(""); setEditOpen(true); }}>Edit profile</button>
          </div>
        </div>
      </section>
      <section className="mt-4 rounded-2xl border border-[#e4e4e7] p-4">
        <h2 className="font-semibold text-[#162e25]">Password & sign-in</h2>
        <button type="button" className="mt-3 flex w-full items-center gap-3 rounded-xl border border-[#e4e4e7] px-3 py-3 text-left" onClick={() => setResetOpen(true)}>
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#f4f5ef] text-sm">🔑</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-[#162e25]">Reset password</span>
            <span className="block text-sm text-[#4e6358]">Send a reset link to your administrator sign-in email.</span>
          </span>
          <img src="/icons/records/next.svg" alt="" className="size-3.5" />
        </button>
      </section>
      <Modal open={editOpen} title="Edit profile" description="Update the name shown on your administrator account." onClose={() => setEditOpen(false)}>
        <form onSubmit={(event) => { event.preventDefault(); if (name.trim().length < 2) { setError("Enter a display name."); return; } portal.saveProfile({ ...portal.profile, name: name.trim() }); setNotice("saved"); setEditOpen(false); }} className="space-y-3">
          <Field label="Display name" error={error}><input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setEditOpen(false)}>Cancel</button>
            <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Save changes</button>
          </div>
        </form>
      </Modal>
      <EmailChange open={emailOpen} onClose={() => setEmailOpen(false)} onUpdated={() => setNotice("updated")} onPending={() => setNotice("pending")} />
      <ResetPassword open={resetOpen} onClose={() => setResetOpen(false)} />
    </SettingsFrame>
  );
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function EmailChange({ open, onClose, onUpdated, onPending }: { open: boolean; onClose: () => void; onUpdated: () => void; onPending: () => void }) {
  const portal = usePortal();
  const [step, setStep] = useState<"email" | "password" | "code" | "done" | "recovery" | "recovered">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [recovery, setRecovery] = useState("");
  const [error, setError] = useState("");

  function close() {
    setStep("email");
    setEmail("");
    setPassword("");
    setCode("");
    setRecovery("");
    setError("");
    onClose();
  }

  if (step === "done") {
    return (
      <Modal open={open} title="Your sign-in email has changed" description="Use this address the next time you sign in. Your workspace access carries over." onClose={close}>
        <p className="text-sm text-[#526459]">Verified sign-in email</p>
        <p className="mt-1 font-medium text-[#162e25]">{portal.profile.email}</p>
        <p className="mt-3 text-sm text-[#4e6358]">A security notice was sent to your previous address.</p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => portal.notify("Security notice sent to your previous sign-in email.")}>View security email</button>
          <Link href="/settings/audit" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={close}>View audit log</Link>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={close}>Back to settings</button>
        </div>
      </Modal>
    );
  }

  if (step === "recovery" || step === "recovered") {
    return (
      <Modal
        open={open}
        title={step === "recovered" ? "Recovery request received" : "Recover account access"}
        description={step === "recovered" ? "Wageet Support will review your request and verify ownership before any account details are changed." : "Give Wageet Support an email where we can reach you. We’ll verify your identity and organisation ownership through a contact already on file."}
        onClose={close}
      >
        {step === "recovered" ? (
          <div className="space-y-3">
            <p className="text-sm text-[#526459]">Reply address</p>
            <p className="font-medium text-[#162e25]">{recovery}</p>
            <p className="text-sm text-[#4e6358]">Your request is awaiting review.</p>
            <div className="flex justify-end"><button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={close}>Back to settings</button></div>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={(event) => {
            event.preventDefault();
            if (!validEmail(recovery)) { setError("Enter a complete email address."); return; }
            setError("");
            onPending();
            setStep("recovered");
          }}>
            <Field label="Reachable email" error={error}><input className={inputClass} placeholder="name@company.com" value={recovery} onChange={(event) => setRecovery(event.target.value)} /></Field>
            <p className="text-sm text-[#526459]">This address is for follow-up. Your sign-in email stays active.</p>
            <div className="flex justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => { setError(""); setStep("password"); }}>Cancel</button>
              <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Request recovery</button>
            </div>
          </form>
        )}
      </Modal>
    );
  }

  const checking = step === "email" && error;
  return (
    <Modal
      open={open}
      title={checking ? "Check the new email" : step === "password" ? "Confirm your password" : step === "code" ? "Verify your identity" : "Change sign-in email"}
      description={checking ? "Use a different, valid email address for this account." : step === "password" ? "Verify your identity before we send a link to your current inbox." : step === "code" ? "Enter the six-digit code from your enrolled authenticator." : "Enter the email you want to use to sign in to Wageet."}
      onClose={close}
    >
      {step === "email" ? (
        <form className="space-y-3" onSubmit={(event) => {
          event.preventDefault();
          if (!validEmail(email) || email.trim().toLowerCase() === portal.profile.email.toLowerCase()) {
            setError("Enter a complete email address that differs from your current one.");
            return;
          }
          setError("");
          setStep("password");
        }}>
          <Field label="Current sign-in email"><input className={inputClass} value={portal.profile.email} readOnly /></Field>
          <Field label="New sign-in email" error={error}><input className={inputClass} placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={close}>Cancel</button>
            <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Continue</button>
          </div>
        </form>
      ) : null}
      {step === "password" ? (
        <form className="space-y-3" onSubmit={(event) => {
          event.preventDefault();
          if (password.trim().length < 8) { setError("That password didn’t match. Try again."); return; }
          setError("");
          setStep("code");
        }}>
          <Field label="New sign-in email"><input className={inputClass} value={email} readOnly /></Field>
          <Field label="Current password" error={error}><input className={inputClass} type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
          <button type="button" className="text-sm font-medium text-[#153a2b]" onClick={() => { setError(""); setStep("recovery"); }}>Can’t access your password or inbox?</button>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => { setError(""); setStep("email"); }}>Back</button>
            <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Verify password</button>
          </div>
        </form>
      ) : null}
      {step === "code" ? (
        <form className="space-y-3" onSubmit={(event) => {
          event.preventDefault();
          if (!/^\d{6}$/.test(code.trim()) || code.trim() === "000000") { setError("That code didn’t match. Enter the current code."); return; }
          const message = portal.changeEmail(email);
          if (message) { setError(message); return; }
          setError("");
          onUpdated();
          setStep("done");
        }}>
          <Field label="New sign-in email"><input className={inputClass} value={email} readOnly /></Field>
          <Field label="Authenticator code" error={error}><input className={inputClass} inputMode="numeric" placeholder="6-digit code" value={code} onChange={(event) => setCode(event.target.value)} /></Field>
          <button type="button" className="text-sm font-medium text-[#153a2b]" onClick={() => { setError(""); setStep("recovery"); }}>Can’t use your authenticator?</button>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => { setError(""); setStep("password"); }}>Back</button>
            <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Verify identity</button>
          </div>
        </form>
      ) : null}
    </Modal>
  );
}

function ResetPassword({ open, onClose }: { open: boolean; onClose: () => void }) {
  const portal = usePortal();
  const [sent, setSent] = useState(false);
  function close() {
    setSent(false);
    onClose();
  }
  return (
    <Modal open={open} title={sent ? "Reset link sent" : "Reset password"} description={sent ? `We sent a password reset link to ${portal.profile.email}.` : "Send a reset link to your administrator sign-in email."} onClose={close}>
      <div className="flex justify-end gap-2">
        {sent ? (
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={close}>Done</button>
        ) : (
          <>
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={close}>Cancel</button>
            <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => setSent(true)}>Send reset link</button>
          </>
        )}
      </div>
    </Modal>
  );
}
