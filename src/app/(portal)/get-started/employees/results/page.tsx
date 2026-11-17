"use client";

import Link from "next/link";
import { SupportLine } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";
import { invitationResultSubtitle } from "@/lib/invitation-results";
import type { InvitationResult } from "@/lib/types";
import { cn } from "cn";

const bankTone: Record<InvitationResult["bank"], string> = {
  Verified: "text-[#09090b]",
  Missing: "text-[#714a0d]",
  Incomplete: "text-[#714a0d]",
  "Verification failed": "text-[#a72131]",
};

export default function InvitationResultsPage() {
  const portal = usePortal();
  const rows = portal.invitationResults;
  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-medium text-[#09090b]">Invitation results</h1>
      <p className="mt-1 text-sm text-[#71717b]">{rows.length ? invitationResultSubtitle(rows) : "No invitations have been sent yet."}</p>
      <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap rounded-2xl border border-[#e7ebe4] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="bg-[#f6f6f6] text-xs text-[#52525c]">
              {["Invitation email", "Start date", "Invite Status", "Bank details", "Row", "Action"].map((heading) => (
                <th key={heading} className={cn("px-4 py-3 font-normal", heading === "Invitation email" ? "text-left" : "text-center")}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#526459]">Send invitations to see them here.</td>
              </tr>
            ) : rows.map((row) => (
              <tr key={`${row.row}-${row.email}`} className="border-t border-dashed border-[#e7ebe4]">
                <td className="px-4 py-4 text-[#09090b]">{row.email}</td>
                <td className="px-4 py-4 text-center text-[#09090b]">{row.start}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex h-6 items-center gap-1.5 rounded bg-[#fdf3e2] px-2 text-xs font-medium text-[#b58330]">
                    <span className="size-1.5 rounded-full bg-current" />
                    {row.status}
                  </span>
                </td>
                <td className={cn("px-4 py-4 text-center", bankTone[row.bank])}>{row.bank}</td>
                <td className="px-4 py-4 text-center text-[#09090b]">{row.row}</td>
                <td className="px-4 py-4 text-center text-[#09090b]">-</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col gap-3 px-4 pt-2 pb-4 sm:flex-row">
          <Link href="/get-started" className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#dce4de] bg-[#f8f8f8] text-xs font-medium text-[#0f2a1f] sm:w-[180px]">Close</Link>
          <Link href="/get-started/banks" className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#0f2a1f] px-3 text-xs font-bold text-[#fffff4] sm:w-[180px]">Review Account Details</Link>
        </div>
        <div className="px-4 pb-4">
          <SupportLine align="left" />
        </div>
      </div>
    </div>
  );
}
