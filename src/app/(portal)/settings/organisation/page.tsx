"use client";

import Link from "next/link";
import { SettingsFrame } from "@/components/portal/settings-nav";
import { usePortal } from "@/components/portal/store";

export default function OrganisationSettingsPage() {
  const portal = usePortal();
  const org = portal.organisation;
  return (
    <SettingsFrame description="Manage the workplace identity, time zone and contact your employees see.">
      <section className="rounded-2xl border border-[#e4e4e7] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#162e25]">Organisation details</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Manage the workplace identity and contact shown in the employee app.</p>
          </div>
          <Link href="/settings/organisation/edit" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm">Edit organisation</Link>
        </div>
        <dl className="mt-4 divide-y divide-[#f0f2f0] text-sm">
          <div className="flex justify-between gap-4 py-3"><dt className="text-[#4e6358]">Country and time zone</dt><dd className="font-medium text-[#162e25]">{org.location} · {org.timezone ?? "Africa/Lagos (WAT)"}</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-[#4e6358]">Employee contact email</dt><dd className="font-medium text-[#162e25]">{org.contactEmail}</dd></div>
        </dl>
      </section>
      <Link href="/settings/audit" className="mt-4 flex items-center justify-between rounded-2xl border border-[#e4e4e7] p-4">
        <span>
          <span className="block font-semibold text-[#162e25]">Workspace activity</span>
          <span className="mt-1 block text-sm text-[#4e6358]">Audit log. Review access changes, exports and sensitive workspace actions.</span>
        </span>
        <img src="/icons/records/next.svg" alt="" className="size-3.5" />
      </Link>
      <section className="mt-4 rounded-2xl bg-[#f4f5ef] p-4">
        <h2 className="font-semibold text-[#162e25]">Employee workspace</h2>
        <p className="mt-1 text-sm text-[#4e6358]">Your display name and logo help employees choose the right workplace when they switch accounts.</p>
        <p className="mt-3 font-medium text-[#162e25]">{org.displayName ?? org.name}</p>
        <p className="text-sm text-[#4e6358]">HR or payroll contact · {org.contactEmail}</p>
      </section>
    </SettingsFrame>
  );
}
