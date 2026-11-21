"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, EyeIcon, LockIcon, authBody, authField, authInput, authPrimary, authTitle } from "@/components/portal/auth-shell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const rules = [
    { label: "Minimum 8 characters", met: password.length >= 8 },
    { label: "At least one letter (a-z)", met: /[a-z]/i.test(password) },
    { label: "At least one number (0-9)", met: /\d/.test(password) },
  ];

  return (
    <AuthShell>
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          if (rules.some((rule) => !rule.met)) {
            setError("Choose a password that meets every requirement.");
            return;
          }
          if (password !== confirm) {
            setError("Enter the same password in both fields.");
            return;
          }
          router.push("/sign-in");
        }}
      >
        <h1 className={authTitle}>Set a new password</h1>
        <p className={authBody}>Choose a password you haven’t used for this account before.</p>
        <label className={`${authField} mt-6`}>
          <LockIcon />
          <input className={authInput} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="New password" aria-label="New password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button type="button" className="text-[#0f2a1f]" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>
            <EyeIcon off={showPassword} />
          </button>
        </label>
        <ul className="mt-3 flex flex-wrap gap-2">
          {rules.map((rule) => (
            <li key={rule.label} className={`inline-flex h-7 items-center gap-1.5 rounded-[10px] px-2.5 text-xs ${rule.met ? "bg-[#e7f6ee] text-[#17803d]" : "bg-[#f4f4f5] text-[#71717a]"}`}>
              <span className={`size-3 rounded-full border ${rule.met ? "border-current bg-current" : "border-current"}`} aria-hidden="true" />
              {rule.label}
            </li>
          ))}
        </ul>
        <label className={`${authField} mt-3`}>
          <LockIcon />
          <input className={authInput} type={showConfirm ? "text" : "password"} autoComplete="new-password" placeholder="Confirm password" aria-label="Confirm password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          <button type="button" className="text-[#0f2a1f]" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm((current) => !current)}>
            <EyeIcon off={showConfirm} />
          </button>
        </label>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <button type="submit" className={authPrimary}>Save Password</button>
        <Link href="/sign-in" className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-[#0f2a1f]">
          <span aria-hidden="true">←</span>
          Back to Sign In
        </Link>
      </form>
    </AuthShell>
  );
}
