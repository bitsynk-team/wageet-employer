"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortal } from "@/components/portal/store";

export default function EditOrganisationPage() {
  const portal = usePortal();
  const router = useRouter();
  const org = portal.organisation;
  const [legal, setLegal] = useState(org.name);
  const [display, setDisplay] = useState(org.displayName ?? "Acme Foods");
  const [country, setCountry] = useState(org.location);
  const [email, setEmail] = useState(org.contactEmail);
  const [logoName, setLogoName] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = (display || legal || "AF").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AF";

  function onFile(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Use a PNG or JPG up to 5 MB.");
      return;
    }
    setError("");
    setLogoName(file.name);
  }

  function save() {
    if (!legal.trim() || !display.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Fields marked * are required.");
      return;
    }
    portal.saveOrganisation({ ...org, name: legal.trim(), displayName: display.trim(), location: country.trim() || "Nigeria", contactEmail: email.trim(), contactName: display.trim() });
    router.push("/settings/organisation");
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <p className="text-sm text-[#71717a]">Settings</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Edit organisation</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Update the company details your employees see in Wageet.</p>
      <p className="mt-4 text-xs text-[#fa4d01]">Fields marked * are required.</p>
      <section className="mt-4 max-w-3xl rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
        <p className="text-sm font-medium text-[#162e25]">Company logo</p>
        <div className="mt-3 flex gap-4">
          <span className="inline-flex size-16 items-center justify-center rounded-xl border border-[#e4e4e7] text-lg text-[#526459]">{initials}</span>
          <div>
            <p className="text-sm text-[#162e25]">Help employees recognize your organization in Wageet.</p>
            <p className="mt-1 text-xs text-[#71717a]">PNG or JPG · Up to 5 MB · Square image recommended</p>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
            <div className="mt-2 flex gap-2">
              <button type="button" className="h-9 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => fileRef.current?.click()}>{logoName ? "Replace logo" : "Upload logo"}</button>
              {logoName ? <button type="button" className="h-9 px-3 text-sm text-[#b42318]" onClick={() => setLogoName("")}>Remove</button> : null}
            </div>
            {logoName ? <p className="mt-1 text-xs text-[#17803d]">{logoName}</p> : null}
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Legal organization name *" value={legal} onChange={setLegal} />
          <Field label="Display name *" value={display} onChange={setDisplay} />
          <Field label="Registered country" value={country} onChange={setCountry} />
          <Field label="Workspace time zone" value={org.timezone ?? "Africa/Lagos · WAT"} readOnly />
          <Field label="Employee contact email *" value={email} onChange={setEmail} />
        </div>
        {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Link href="/settings/organisation" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Back to settings</Link>
          <button type="button" onClick={save} className="h-10 rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">Save changes</button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, readOnly }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-[#162e25]">{label}</span>
      <input value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" />
    </label>
  );
}
