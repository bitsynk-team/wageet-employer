"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { DarkButton, IntIcon, LineButton, Panel } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

export default function RetryDeliveryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const portal = usePortal();
  const [token, setToken] = useState("•••• •••• •••• 6842");
  const [draft, setDraft] = useState("•••• •••• •••• 6842");
  const [tokenOpen, setTokenOpen] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [error, setError] = useState("");

  function retry() {
    const result = portal.retryDelivery(token);
    if (result === "rejected") {
      setRejected(true);
      return;
    }
    if (result) {
      setError(result);
      return;
    }
    router.push(`/integrations/deliveries/${params.id}`);
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Retry payroll delivery</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Use a current payroll token to retry the missed delivery.</p>
      <Panel className="mt-5 max-w-3xl">
        <h2 className="font-semibold text-[#162e25]">Payroll API credentials</h2>
        <div className="mt-4">
          <Field label="New access token" error={error}>
            <span className="flex gap-2">
              <input className={inputClass} value={token} onChange={(event) => setToken(event.target.value)} />
              <button type="button" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#e4e4e7]" aria-label="Update access token" onClick={() => setTokenOpen(true)}>
                <IntIcon name="key" />
              </button>
            </span>
          </Field>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Retry delivery</dt><dd className="font-medium text-[#162e25]">12 Nov 2026 · 08:00 WAT</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-[#71717a]">Endpoint</dt><dd className="font-medium text-[#162e25]">https://payroll.example/approved</dd></div>
        </dl>
        <p className="mt-3 text-sm text-[#4e6358]">Wageet checks employee IDs and work dates to prevent duplicate earnings.</p>
        <div className="mt-5 flex justify-end gap-2">
          <LineButton href={`/integrations/deliveries/${params.id}`}>Cancel</LineButton>
          <DarkButton onClick={retry}>Test and retry</DarkButton>
        </div>
      </Panel>
      <Modal open={tokenOpen} title="Update access token" description="Use a read-only token from your payroll system." onClose={() => setTokenOpen(false)}>
        <Field label="New access token"><input className={inputClass} value={draft} onChange={(event) => setDraft(event.target.value)} /></Field>
        <p className="mt-2 text-sm text-[#4e6358]">The credential will be tested before the connection is saved.</p>
        <button type="button" className="mt-3 text-sm font-medium text-[#1a6849]" onClick={() => setDraft("•••• •••• •••• 3271")}>Use previously saved token · ending 3271</button>
        <div className="mt-4 flex justify-end gap-2">
          <LineButton onClick={() => setTokenOpen(false)}>Cancel</LineButton>
          <DarkButton onClick={() => { setToken(draft); setTokenOpen(false); }}>Use credential</DarkButton>
        </div>
      </Modal>
      <Modal open={rejected} title="Connection test failed" description="The payroll system rejected this token. Replace it with a current read-only token, then test again." onClose={() => setRejected(false)}>
        <div className="flex justify-end"><DarkButton onClick={() => setRejected(false)}>Back to retry</DarkButton></div>
      </Modal>
    </div>
  );
}
