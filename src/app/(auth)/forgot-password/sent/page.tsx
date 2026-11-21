"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthShell, authBody, authPrimary, authSecondary, authTitle } from "@/components/portal/auth-shell";

export default function ResetSentPage() {
  return (
    <Suspense>
      <Sent />
    </Suspense>
  );
}

function Sent() {
  const email = useSearchParams().get("email");
  const [resent, setResent] = useState(false);
  return (
    <AuthShell>
      <div className="w-full">
        <h1 className={authTitle}>Check your email</h1>
        <p className={authBody}>{email ? `If an administrator account matches ${email}, we’ll send a reset link.` : "If an administrator account matches this email address, we’ll send a reset link."}</p>
        {resent ? <p className="mt-3 text-sm text-[#17803d]">Reset link sent again.</p> : null}
        <button type="button" className={authPrimary} onClick={() => setResent(true)}>Resend reset link</button>
        <Link href="/sign-in" className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#0f2a1f]">
          <span aria-hidden="true">←</span>
          Back to Sign In
        </Link>
        <Link href="/reset-password" className={`${authSecondary} mt-10`}>Open reset link</Link>
      </div>
    </AuthShell>
  );
}
