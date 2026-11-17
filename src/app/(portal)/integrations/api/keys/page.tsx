"use client";

import { useState } from "react";
import { Modal } from "@/components/portal/ui";
import { BackLink, DarkButton, IntIcon, LineButton, Panel, Rows } from "@/components/portal/integrations-ui";
import { Icon } from "@/components/portal/icons";
import { usePortal } from "@/components/portal/store";

export default function ApiKeysPage() {
  const portal = usePortal();
  const [rotateOpen, setRotateOpen] = useState(false);
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const events = [portal.webhookEvents.snapshot ? "Snapshot frozen" : "", portal.webhookEvents.export ? "Export completed" : ""].filter(Boolean).join(" · ");
  return (
    <div className="px-4 py-5 sm:px-6">
      <BackLink href="/integrations/api">Back to connection</BackLink>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">API keys & webhooks</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Manage the credentials and payroll events for the {portal.workspaceName} integration.</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <Panel>
            <h2 className="font-semibold text-[#162e25]">Payroll API key</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Use this credential to authenticate your payroll connector.</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="inline-flex items-center gap-2 rounded-lg bg-[#f4f5ef] px-3 py-2 font-mono text-sm text-[#162e25]">
                <IntIcon name="key" />
                {portal.apiKey}
              </p>
              <LineButton onClick={() => setRotateOpen(true)}>
                <IntIcon name="key" />
                Rotate key
              </LineButton>
            </div>
            {freshKey ? (
              <div className="mt-3 rounded-lg border border-[#dce4de] bg-[#f8f8f8] px-3 py-3">
                <p className="text-xs text-[#526459]">New key · shown once</p>
                <p className="mt-1 font-mono text-sm text-[#0f2a1f]">{hidden ? "••••••••••••••••" : freshKey}</p>
                <p className="mt-2 text-xs text-[#526459]">Save this key in your connector before closing this message.</p>
                <div className="mt-3 flex gap-2">
                  <LineButton onClick={() => { void navigator.clipboard?.writeText(freshKey); portal.notify("Key copied."); }}>Copy key</LineButton>
                  <LineButton onClick={() => setHidden((current) => !current)}>{hidden ? "Show key" : "Hide key"}</LineButton>
                </div>
              </div>
            ) : null}
          </Panel>
          <Panel>
            <h2 className="font-semibold text-[#162e25]">Webhook endpoint</h2>
            <Rows rows={[["HTTPS endpoint", portal.webhookEndpoint], ["Subscribed events", events || "None"]]} />
            <div className="mt-4 flex justify-end">
              <DarkButton href="/integrations/api/webhook">
                <IntIcon name="settings" />
                Configure webhook
              </DarkButton>
            </div>
          </Panel>
        </div>
        <aside className="rounded-2xl border border-[#e4e4e7] p-4">
          <h2 className="font-semibold text-[#162e25]">Connection scope</h2>
          <div className="mt-4 flex gap-3">
            <Icon name="shield" className="size-5" />
            <div>
              <p className="text-sm font-medium text-[#162e25]">These credentials apply to {portal.workspaceName}.</p>
              <p className="mt-1 text-sm text-[#4e6358]">Rotating the key stops the previous key from authenticating.</p>
            </div>
          </div>
          <div className="mt-4 border-t border-[#f0f2f0] pt-4">
            <p className="text-sm font-medium text-[#17803d]">Signed webhook</p>
            <p className="mt-1 text-sm text-[#4e6358]">Webhook deliveries are signed so the receiving system can confirm they came from Wageet.</p>
          </div>
        </aside>
      </div>
      <Modal open={rotateOpen} title="Rotate the payroll API key?" description="The current key will stop working immediately. Update your payroll connector with the replacement to keep it connected." onClose={() => setRotateOpen(false)}>
        <Rows rows={[["Workspace", portal.workspaceName], ["Affected integration", "Payroll connector"]]} />
        <div className="mt-4 flex justify-end gap-2">
          <LineButton onClick={() => setRotateOpen(false)}>Cancel</LineButton>
          <DarkButton
            onClick={() => {
              setFreshKey(portal.rotateApiKey());
              setHidden(false);
              setRotateOpen(false);
            }}
          >
            Rotate key
          </DarkButton>
        </div>
      </Modal>
    </div>
  );
}
