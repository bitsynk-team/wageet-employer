"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, inputClass, PrimaryButton } from "@/components/portal/ui";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <main id="main" className="flex flex-1 items-center justify-center bg-[#f8f8f8] px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/dashboard">
          <img src="/icons/wordmark.svg" alt="Wageet" width={75} height={24} className="mb-8 h-6 w-[75px]" />
        </Link>
        <form
          className="rounded-2xl border border-[#e4e4e7] bg-white p-6 shadow-[0px_1.5px_2px_-1px_rgba(3,7,18,0.05)]"
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
            router.push("/dashboard");
          }}
        >
          <h1 className="text-xl font-semibold text-[#0f2a1f]">Sign in</h1>
          <p className="mt-1 text-sm text-[#526459]">Use the administrator email for the workplace you manage.</p>
          <div className="mt-4 space-y-3">
            <Field label="Work email">
              <input className={inputClass} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Field>
            <Field label="Password" error={error}>
              <input className={inputClass} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </Field>
            <PrimaryButton type="submit" className="w-full">Continue</PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  );
}
