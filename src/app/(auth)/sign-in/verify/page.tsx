"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, authBody, authPrimary, authSecondary, authTitle } from "@/components/portal/auth-shell";

export default function VerifySignInPage() {
  return (
    <Suspense>
      <VerifyCode />
    </Suspense>
  );
}

function VerifyCode() {
  const router = useRouter();
  const email = useSearchParams().get("email");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell>
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          if (!/^\d{6}$/.test(code)) {
            setError("Enter the six-digit code.");
            return;
          }
          router.push("/dashboard");
        }}
      >
        <h1 className={authTitle}>Verify your sign-in</h1>
        <p className={authBody}>{email ? `Enter the six-digit code sent to ${email}.` : "Enter the six-digit code sent to your sign-in email."}</p>
        <label className="mt-8 block text-sm font-medium text-[#0f2a1f]">
          Verification code
          <input className="mt-2 h-[46px] w-full rounded-[10px] bg-[#f8f8f8] px-3 text-sm font-normal text-[#0f2a1f] outline-none placeholder:text-[#1c1c1c]" inputMode="numeric" autoComplete="one-time-code" placeholder="Enter six-digit code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} />
        </label>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        {sent ? <p className="mt-2 text-sm text-[#17803d]">A new code is on its way.</p> : null}
        <button type="submit" className={authPrimary}>Verify and continue</button>
        <button type="button" className={authSecondary} onClick={() => setSent(true)}>Resend code</button>
      </form>
    </AuthShell>
  );
}
