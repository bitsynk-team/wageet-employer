"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { DarkButton, IntIcon, LineButton, Panel, ScheduleField, SideFacts, apiSchedules } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

export default function ConfigureApiPage() {
  const portal = usePortal();
  const router = useRouter();
  const source = portal.integrations.find((item) => item.id === "api");
  const [group, setGroup] = useState(source?.group ?? "Hourly staff");
  const [endpoint, setEndpoint] = useState(source?.location ?? "https://payroll.example/approved");
  const [token, setToken] = useState(source?.credential ?? "•••• •••• •••• 7924");
  const [schedule, setSchedule] = useState(source?.schedule ?? apiSchedules[0].value);
  const [error, setError] = useState("");
  const [tokenOpen, setTokenOpen] = useState(false);
  const [draft, setDraft] = useState("•••• •••• •••• 6842");
  const [rejected, setRejected] = useState(false);

  function save() {
    const result = portal.saveApiConnection({ group, endpoint, token, schedule });
    if (result === "rejected") {
      setRejected(true);
      return;
    }
    if (result) {
      setError(result);
      return;
    }
    router.push("/integrations/api");
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Configure payroll API</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Choose the records and delivery schedule for {portal.workspaceName}.</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel>
          <h2 className="font-semibold text-[#162e25]">Connection details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Source name"><input className={inputClass} value="Payroll API" readOnly /></Field>
            <Field label="Employee group"><input className={inputClass} value={group} onChange={(event) => setGroup(event.target.value)} /></Field>
          </div>
          <div className="mt-3">
            <Field label="Endpoint"><input className={inputClass} value={endpoint} onChange={(event) => setEndpoint(event.target.value)} /></Field>
          </div>
          <div className="mt-3">
            <Field label="Access token">
              <span className="flex gap-2">
                <input className={inputClass} value={token} onChange={(event) => setToken(event.target.value)} />
                <button type="button" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#e4e4e7]" aria-label="Update access token" onClick={() => setTokenOpen(true)}>
                  <IntIcon name="key" />
                </button>
              </span>
            </Field>
          </div>
          <h2 className="mt-6 font-semibold text-[#162e25]">Delivery schedule</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Times follow the organisation’s timezone, Africa/Lagos.</p>
          <div className="mt-3">
            <ScheduleField label="Expected delivery" value={schedule} options={apiSchedules} onChange={setSchedule} />
          </div>
          {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
          <div className="mt-5 flex justify-end gap-2">
            <LineButton href={source?.state === "Connected" ? "/integrations/api" : "/integrations"}>Cancel</LineButton>
            <DarkButton onClick={save}>Test and save</DarkButton>
          </div>
        </Panel>
        <SideFacts
          icon="api"
          title="What Wageet will receive"
          rows={[
            ["Data", "Approved earnings and work records"],
            ["Matching field", "Wageet employee ID"],
            ["Used by", "Work records → Payroll sync"],
          ]}
        />
      </div>
      <Modal open={tokenOpen} title="Update access token" description="Use a read-only token from your payroll system." onClose={() => setTokenOpen(false)}>
        <Field label="New access token">
          <input className={inputClass} value={draft} onChange={(event) => setDraft(event.target.value)} />
        </Field>
        <p className="mt-2 text-sm text-[#4e6358]">The credential will be tested before the connection is saved.</p>
        <button type="button" className="mt-3 text-sm font-medium text-[#1a6849]" onClick={() => setDraft("•••• •••• •••• 3271")}>
          Use previously saved token · ending 3271
        </button>
        <div className="mt-4 flex justify-end gap-2">
          <LineButton onClick={() => setTokenOpen(false)}>Cancel</LineButton>
          <DarkButton
            onClick={() => {
              setToken(draft);
              setTokenOpen(false);
            }}
          >
            Use credential
          </DarkButton>
        </div>
      </Modal>
      <Modal open={rejected} title="Connection test failed" description="The payroll system rejected this token. Replace it with a current read-only token, then test again." onClose={() => setRejected(false)}>
        <div className="flex justify-end">
          <DarkButton onClick={() => setRejected(false)}>Back to setup</DarkButton>
        </div>
      </Modal>
    </div>
  );
}
