"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, EyeIcon, LockIcon, MailIcon, authBody, authField, authInput, authPrimary, authTitle } from "@/components/portal/auth-shell";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  return (
    <AuthShell>
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter the work email for this workspace.");
            return;
          }
          if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
          }
          router.push(`/sign-in/verify?email=${encodeURIComponent(email)}`);
        }}
      >
        <h1 className={authTitle}>Sign in to Wageet</h1>
        <p className={authBody}>Manage your organisation’s earned-pay experience.</p>
        <label className={`${authField} mt-8`}>
          <MailIcon />
          <input className={authInput} type="email" autoComplete="email" placeholder="Enter email address" aria-label="Enter email address" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className={`${authField} mt-3`}>
          <LockIcon />
          <input className={authInput} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Password" aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button type="button" className="text-[#0f2a1f]" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>
            <EyeIcon off={showPassword} />
          </button>
        </label>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#0f2a1f]">
          <p>Forgot Password? <Link href="/forgot-password" className="font-semibold underline">Click here</Link></p>
          <Link href="/forgot-password" className="shrink-0">Recover account access</Link>
        </div>
        <button type="submit" className={authPrimary}>Sign in</button>
        <p className="mt-5 text-center text-sm font-medium text-[#0f2a1f]">New administrator? Use the invitation link sent to your email.</p>
      </form>
    </AuthShell>
  );
}
