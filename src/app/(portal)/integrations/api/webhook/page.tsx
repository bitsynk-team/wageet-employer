"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/portal/ui";
import { BackLink, DarkButton, LineButton, Panel } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

const events = [
  { key: "snapshot" as const, title: "Snapshot frozen", body: "When a payroll snapshot becomes final." },
  { key: "export" as const, title: "Export completed", body: "When a payroll export is recorded." },
];

export default function WebhookPage() {
  const portal = usePortal();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState(portal.webhookEndpoint.replace("https://", ""));
  const [snapshot, setSnapshot] = useState(portal.webhookEvents.snapshot);
  const [exported, setExported] = useState(portal.webhookEvents.export);
  const [error, setError] = useState("");
  const flags = { snapshot, export: exported };

  function save() {
    const result = portal.saveWebhook({ endpoint: `https://${endpoint.replace(/^https?:\/\//, "")}`, snapshot, export: exported });
    if (result) {
      setError(result);
      return;
    }
    router.push("/integrations/api/keys");
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <BackLink href="/integrations/api/keys">Back</BackLink>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Configure webhook</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Choose the HTTPS endpoint and payroll events your integration receives.</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel>
          <h2 className="font-semibold text-[#162e25]">Delivery settings</h2>
          <div className="mt-4">
            <Field label="HTTPS endpoint" error={error}>
              <span className="flex overflow-hidden rounded-lg border border-[#dce4de]">
                <span className="inline-flex items-center bg-[#f4f5ef] px-3 text-sm text-[#4e6358]">https://</span>
                <input className={`${inputClass} rounded-none border-0`} value={endpoint} onChange={(event) => setEndpoint(event.target.value)} />
              </span>
            </Field>
          </div>
          <p className="mt-4 text-sm font-medium text-[#162e25]">Subscribed events</p>
          <div className="mt-2 space-y-2">
            {events.map((event) => (
              <label key={event.key} className="flex items-start gap-3 rounded-xl border border-[#e4e4e7] p-3">
                <input type="checkbox" className="mt-1" checked={flags[event.key]} onChange={(change) => (event.key === "snapshot" ? setSnapshot(change.target.checked) : setExported(change.target.checked))} />
                <span>
                  <span className="block text-sm font-medium text-[#162e25]">{event.title}</span>
                  <span className="block text-sm text-[#4e6358]">{event.body}</span>
                </span>
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <LineButton href="/integrations/api/keys">Cancel</LineButton>
            <DarkButton onClick={save}>Save webhook</DarkButton>
          </div>
        </Panel>
        <Panel>
          <h2 className="font-semibold text-[#162e25]">Request signing</h2>
          <p className="mt-3 text-xs text-[#71717a]">Signing secret</p>
          <p className="font-mono text-sm text-[#162e25]">••••••••h93V</p>
          <p className="mt-3 text-sm text-[#4e6358]">Use the signing secret at your endpoint to verify Wageet’s delivery signature.</p>
        </Panel>
      </div>
    </div>
  );
}
