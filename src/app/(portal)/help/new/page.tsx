"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BackLink, requestTopics } from "@/components/portal/help-centre";
import { inputClass } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import { cn } from "cn";

export default function NewRequestPage() {
  const portal = usePortal();
  const router = useRouter();
  const [form, setForm] = useState({ topic: "", subject: "", body: "" });
  const [errors, setErrors] = useState({ topic: "", subject: "", body: "" });
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [open]);

  return (
    <div className="px-4 py-5 sm:px-6">
      <BackLink href="/help" label="Back" />
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Contact support</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Tell us what happened so the Wageet team can look into it.</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <form
          className="rounded-2xl border border-[#e4e4e7] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            const next = {
              topic: form.topic ? "" : "Choose a topic.",
              subject: form.subject.trim() ? "" : "Enter a subject.",
              body: form.body.trim() ? "" : "Describe what happened.",
            };
            setErrors(next);
            if (next.topic || next.subject || next.body) return;
            const result = portal.sendRequest(form);
            if (result.error || !result.id) {
              setErrors({ topic: result.error === "Choose a topic." ? result.error : "", subject: result.error === "Enter a subject." ? result.error : "", body: result.error === "Describe what happened." ? result.error : "" });
              return;
            }
            router.push(`/help/${result.id}?sent=1`);
          }}
        >
          <h2 className="text-base font-semibold text-[#162e25]">Request details</h2>
          <div className="mt-4 space-y-4">
            <div ref={menu} className="relative text-sm">
              <span className="mb-1.5 block font-medium text-[#0f2a1f]">Topic</span>
              <button
                type="button"
                className={cn(inputClass, "flex items-center justify-between text-left", errors.topic && "border-[#d92d20]", !form.topic && "text-[#666e6d]")}
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => setOpen((current) => !current)}
              >
                {form.topic || "Choose a topic"}
                <img src="/icons/help/chevron.svg" alt="" className="size-4 rotate-180" />
              </button>
              {errors.topic ? <span className="mt-1 block text-xs text-[#d92d20]">{errors.topic}</span> : null}
              {open ? (
                <ul role="listbox" className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-[#e4e4e7] bg-white py-1 shadow-lg">
                  {requestTopics.map((topic) => (
                    <li key={topic}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={form.topic === topic}
                        className="block w-full px-3 py-2 text-left text-sm text-[#162e25] hover:bg-[#f4f5ef]"
                        onClick={() => {
                          setForm({ ...form, topic });
                          setOpen(false);
                          setErrors({ ...errors, topic: "" });
                        }}
                      >
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[#0f2a1f]">Subject</span>
              <input
                className={cn(inputClass, errors.subject && "border-[#d92d20]")}
                placeholder="A short summary of the issue"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
              />
              {errors.subject ? <span className="mt-1 block text-xs text-[#d92d20]">{errors.subject}</span> : null}
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[#0f2a1f]">What happened?</span>
              <textarea
                className={cn(inputClass, "h-28 py-2", errors.body && "border-[#d92d20]")}
                placeholder="Include the steps you took and what you expected to see."
                value={form.body}
                onChange={(event) => setForm({ ...form, body: event.target.value })}
              />
              {errors.body ? <span className="mt-1 block text-xs text-[#d92d20]">{errors.body}</span> : null}
            </label>
            <p className="flex gap-2 rounded-lg bg-[#f4f5ef] p-3 text-sm text-[#526459]">
              <img src="/icons/setup/info.svg" alt="" className="mt-0.5 size-4 shrink-0" />
              For payment issues, include the transaction reference. Leave out passwords, PINs, API secrets and full bank details.
            </p>
            <div className="flex justify-end gap-2">
              <Link href="/help" className="inline-flex h-10 items-center rounded-lg border border-[#dfe5dd] px-4 text-sm font-medium text-[#162e25]">Cancel</Link>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white">
                <img src="/icons/help/arrow-white.svg" alt="" className="size-4" />
                Send request
              </button>
            </div>
          </div>
        </form>
        <aside className="h-fit rounded-2xl bg-[#f4f5ef] p-4">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#e7f3ee]">
            <img src="/icons/help/home.svg" alt="" className="size-4" />
          </span>
          <p className="mt-3 text-sm font-medium text-[#162e25]">Workspace</p>
          <p className="text-sm text-[#162e25]">{portal.workspaceName}</p>
          <div className="mt-4 border-t border-[#e4ebe4] pt-4">
            <p className="text-xs text-[#666e6d]">Submitted by</p>
            <p className="text-sm font-medium text-[#162e25]">{portal.profile.name}</p>
          </div>
          <p className="mt-4 text-sm text-[#526459]">
            You can follow up in <Link href="/help/requests" className="font-medium text-[#153a2b]">My support requests</Link>.
          </p>
        </aside>
      </div>
    </div>
  );
}
