"use client";

import { useState } from "react";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { usePortal } from "@/components/portal/store";

export default function SettingsPage() {
  const portal = usePortal();
  const [editOpen, setEditOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [name, setName] = useState(portal.profile.name);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
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
              <button type="button" className="h-11 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm" onClick={() => { setEmail(""); setError(""); setEmailOpen(true); }}>Change email</button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { setName(portal.profile.name); setError(""); setEditOpen(true); }}>Edit profile</button>
          </div>
        </div>
      </section>
      <section className="mt-4 rounded-2xl border border-[#e4e4e7] p-4">
        <h2 className="font-semibold text-[#162e25]">Password & sign-in</h2>
        <button type="button" className="mt-3 flex w-full items-center gap-3 rounded-xl border border-[#e4e4e7] px-3 py-3 text-left" onClick={() => portal.notify(`Reset link sent to ${portal.profile.email}.`)}>
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#f4f5ef] text-sm">🔑</span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-[#162e25]">Reset password</span>
            <span className="block text-sm text-[#4e6358]">Send a reset link to your administrator sign-in email.</span>
          </span>
          <img src="/icons/records/next.svg" alt="" className="size-3.5" />
        </button>
      </section>
      <Modal open={editOpen} title="Edit profile" description="Update the name shown on your administrator account." onClose={() => setEditOpen(false)}>
        <form onSubmit={(event) => { event.preventDefault(); if (name.trim().length < 2) { setError("Enter a display name."); return; } portal.saveProfile({ ...portal.profile, name: name.trim() }); setEditOpen(false); }} className="space-y-3">
          <Field label="Display name" error={error}><input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setEditOpen(false)}>Cancel</button>
            <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Save changes</button>
          </div>
        </form>
      </Modal>
      <Modal open={emailOpen} title="Change sign-in email" description="Enter the email you want to use to sign in to Wageet." onClose={() => setEmailOpen(false)}>
        <form onSubmit={(event) => {
          event.preventDefault();
          if (email.trim().toLowerCase() === portal.profile.email.toLowerCase()) { setError("Enter a new sign-in email."); return; }
          const message = portal.changeEmail(email);
          if (message) { setError(message); return; }
          setEmailOpen(false);
        }} className="space-y-3">
          <Field label="Current sign-in email"><input className={inputClass} value={portal.profile.email} readOnly /></Field>
          <Field label="New sign-in email" error={error}><input className={inputClass} type="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
          <div className="flex justify-end gap-2">
            <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setEmailOpen(false)}>Cancel</button>
            <button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Continue</button>
          </div>
        </form>
      </Modal>
    </SettingsFrame>
  );
}
