"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, StatusPill } from "@/components/portal/ui";
import { BackLink, DarkButton, IntIcon, LineButton, Panel, Rows, SideFacts } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

export default function PayrollApiPage() {
  const portal = usePortal();
  const router = useRouter();
  const source = portal.integrations.find((item) => item.id === "api");
  const latest = portal.deliveries.find((item) => item.kind === "review") ?? portal.deliveries.find((item) => item.source === "Payroll API");
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  if (!source || source.state !== "Connected") {
    return (
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-[26px] font-semibold text-[#162e25]">Payroll API</h1>
        <p className="mt-1 text-sm text-[#4e6358]">This source is not connected.</p>
        <div className="mt-4"><DarkButton href="/integrations/api/configure">Connect</DarkButton></div>
      </div>
    );
  }
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Payroll API</h1>
          <p className="mt-1 text-sm text-[#4e6358]">Manage access, deliveries and the expected arrival time.</p>
        </div>
        <BackLink href="/integrations">All integrations</BackLink>
      </div>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel>
          <h2 className="font-semibold text-[#162e25]">Connection overview</h2>
          <div className="mt-2"><StatusPill value="Connected" /></div>
          <Rows
            rows={[
              ["Source", source.name],
              ["Employee group", source.group],
              ["Method", source.method],
              ["Location", source.location],
              ["Expected delivery", source.schedule],
            ]}
          />
          <h2 className="mt-4 font-semibold text-[#162e25]">Delivery activity</h2>
          <Rows
            rows={
              latest
                ? [
                    ["Latest delivery", "13 Nov 2026 · 08:05 WAT"],
                    ["Result", "10 rows received · 8 posted · 2 held"],
                  ]
                : [["Latest delivery", "Waiting for the first delivery."]]
            }
          />
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <LineButton onClick={() => setDisconnectOpen(true)}>Disconnect</LineButton>
            <LineButton href="/integrations/api/configure">
              <IntIcon name="settings" />
              Edit connection
            </LineButton>
            <LineButton href="/integrations/api/keys">
              <IntIcon name="key" />
              API keys & webhooks
            </LineButton>
            <DarkButton href={latest ? `/integrations/deliveries/${latest.id}` : "/integrations/deliveries"}>
              <IntIcon name="history" />
              View latest delivery
            </DarkButton>
          </div>
        </Panel>
        <SideFacts
          icon="api"
          title="Record handling"
          rows={[
            ["Workspace", portal.workspaceName],
            ["Timezone", "Africa/Lagos · WAT"],
            ["Duplicates", "Previously received records are checked before posting"],
          ]}
        />
      </div>
      <Modal open={disconnectOpen} title="Disconnect payroll API?" description="Review what will change for this workspace." onClose={() => setDisconnectOpen(false)}>
        <p className="font-medium text-[#162e25]">Stop scheduled deliveries</p>
        <p className="mt-1 text-sm text-[#4e6358]">Future deliveries from this source will stop. Previously confirmed earnings and delivery history are kept.</p>
        <Rows rows={[["Source", "Payroll API"], ["Affected employees", source.group]]} />
        <div className="mt-4 flex justify-end gap-2">
          <LineButton onClick={() => setDisconnectOpen(false)}>Keep connected</LineButton>
          <DarkButton
            onClick={() => {
              portal.disconnectSource("api");
              setDisconnectOpen(false);
              router.push("/integrations");
            }}
          >
            Disconnect source
          </DarkButton>
        </div>
      </Modal>
    </div>
  );
}
