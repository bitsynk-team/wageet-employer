"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, authBody, authPrimary, authSecondary, authTitle } from "@/components/portal/auth-shell";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("Shai.hulud@gmail.com");
  const [error, setError] = useState("");

  return (
    <AuthShell>
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter the email you use for your employer workspace.");
            return;
          }
          router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`);
        }}
      >
        <h1 className={authTitle}>Reset your password</h1>
        <p className={authBody}>Enter the email you use for your employer workspace.</p>
        <label className="mt-8 block text-sm font-medium text-[#0f2a1f]">
          Work email
          <input className="mt-2 h-[46px] w-full rounded-[10px] bg-[#f8f8f8] px-3 text-sm font-normal text-[#0f2a1f] outline-none" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <button type="submit" className={authPrimary}>Send reset link</button>
        <Link href="/sign-in" className={authSecondary}>Back to sign in</Link>
      </form>
    </AuthShell>
  );
}
