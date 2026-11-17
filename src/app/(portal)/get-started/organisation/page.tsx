"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RequiredNote, SetupActions, SetupCard, SetupPage, fieldClass, labelClass } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";

export default function OrganisationSetupPage() {
  const portal = usePortal();
  const router = useRouter();
  const saved = portal.orgSaved ? portal.organisation : null;
  const [legal, setLegal] = useState(saved?.name ?? "");
  const [display, setDisplay] = useState(saved?.contactName ?? "");
  const [country, setCountry] = useState(saved && portal.orgSaved ? saved.location : "");
  const [email, setEmail] = useState(saved?.contactEmail ?? "");
  const [logoName, setLogoName] = useState("");
  const [logoError, setLogoError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const initials = (display || legal || "AF").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  function onFile(file: File | undefined) {
    if (!file) return;
    const allowed = file.type === "image/png" || file.type === "image/jpeg";
    if (!allowed || file.size > 5 * 1024 * 1024) {
      setLogoName("");
      setLogoError("We couldn’t upload this file. Choose a PNG or JPG smaller than 5 MB and try again.");
      return;
    }
    setLogoError("");
    setLogoName(file.name);
  }

  function save() {
    const next: Record<string, string> = {};
    if (!legal.trim()) next.legal = "Enter your legal company name.";
    if (!display.trim()) next.display = "Enter your display name.";
    if (!country.trim()) next.country = "Enter a country.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter your HR or payroll contact email.";
    setErrors(next);
    if (Object.keys(next).length || logoError) return;
    portal.saveOrganisation({
      name: legal.trim(),
      location: country.trim(),
      contactName: display.trim(),
      contactEmail: email.trim(),
      phone: portal.organisation.phone,
    });
    router.push("/get-started");
  }

  return (
    <SetupPage title="Organization Details" subtitle="Add the company details your employees will see in Wageet.">
      <SetupCard>
        <RequiredNote />
        <div className="mt-6 border-b border-[#dce4de] pb-6">
          <p className="text-sm font-medium text-[#0f2a1f]">Company logo</p>
          <div className="mt-3 flex gap-6">
            <span className="inline-flex size-[84px] shrink-0 items-center justify-center rounded-xl border border-[#dce4de] text-[28px] text-[#526459]">{logoName ? initials : "AF"}</span>
            <div>
              <p className="text-sm text-[#0f2a1f]">Help employees recognize your organization in Wageet.</p>
              <p className="mt-1 text-xs text-[#526459]">PNG or JPG · Up to 5 MB · Square image recommended</p>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
              <div className="mt-2 flex gap-2">
                <button type="button" className="h-10 rounded-lg border border-[#dce4de] bg-[#f8f8f8] px-4 text-xs font-bold text-[#0f2a1f]" onClick={() => fileRef.current?.click()}>
                  {logoError ? "Retry" : logoName ? "Replace logo" : "Upload logo"}
                </button>
                {logoName ? <button type="button" className="h-10 px-3 text-xs text-[#b42318]" onClick={() => setLogoName("")}>Remove</button> : null}
              </div>
              {logoError ? <p className="mt-2 text-sm text-[#b42318]">{logoError}</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Label label="Legal organization name *" error={errors.legal}>
            <input className={fieldClass} placeholder="Enter legal company name" value={legal} onChange={(event) => setLegal(event.target.value)} />
          </Label>
          <Label label="Display name *" error={errors.display}>
            <input className={fieldClass} placeholder="Enter name employees will see" value={display} onChange={(event) => setDisplay(event.target.value)} />
          </Label>
          <Label label="Country *" error={errors.country}>
            <input className={fieldClass} placeholder="Enter Country" value={country} onChange={(event) => setCountry(event.target.value)} />
          </Label>
          <Label label="Time Zone *">
            <input className={fieldClass} value="Africa/Lagos · WAT" readOnly />
          </Label>
          <Label label="Employee contact email *" error={errors.email} wide>
            <input className={fieldClass} placeholder="Enter your HR or payroll contact email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Label>
        </div>
        <div className="mt-6">
          <SetupActions backHref="/get-started" primary="Save details" onPrimary={save} stretch />
        </div>
      </SetupCard>
    </SetupPage>
  );
}

function Label({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={wide ? "sm:col-span-2" : undefined}>
      <span className={labelClass}>{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-[#b42318]">{error}</span> : null}
    </label>
  );
}
