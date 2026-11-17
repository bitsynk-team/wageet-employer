"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { DarkButton, IntIcon, LineButton, Panel, ScheduleField, SideFacts, sftpSchedules } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

function splitLocation(location: string) {
  const [host, ...rest] = location.split(" ");
  return { host: host || "sftp.example.com", folder: rest.join(" ") || "/approved-payroll/" };
}

export default function ConfigureSftpPage() {
  const portal = usePortal();
  const router = useRouter();
  const source = portal.integrations.find((item) => item.id === "sftp");
  const parts = splitLocation(source?.location ?? "");
  const [group, setGroup] = useState(source?.group ?? "Contract staff");
  const [host, setHost] = useState(parts.host);
  const [folder, setFolder] = useState(parts.folder);
  const [credential, setCredential] = useState(source?.credential ?? "payroll_reader · key ending 83B1");
  const [schedule, setSchedule] = useState(source?.schedule ?? sftpSchedules[0].value);
  const [error, setError] = useState("");
  const [credentialOpen, setCredentialOpen] = useState(false);
  const [username, setUsername] = useState("payroll_reader");
  const [identity, setIdentity] = useState("Payroll reader key · ending 6D42");
  const [rejected, setRejected] = useState(false);

  function save() {
    const result = portal.saveSftpConnection({ group, host, folder, credential, schedule });
    if (result === "rejected") {
      setRejected(true);
      return;
    }
    if (result) {
      setError(result);
      return;
    }
    router.push("/integrations/sftp");
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Configure secure file transfer</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Choose the records and delivery schedule for {portal.workspaceName}.</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel>
          <h2 className="font-semibold text-[#162e25]">Connection details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Source name"><input className={inputClass} value="Secure file transfer" readOnly /></Field>
            <Field label="Employee group"><input className={inputClass} value={group} onChange={(event) => setGroup(event.target.value)} /></Field>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Host"><input className={inputClass} value={host} onChange={(event) => setHost(event.target.value)} /></Field>
            <Field label="Remote folder"><input className={inputClass} value={folder} onChange={(event) => setFolder(event.target.value)} /></Field>
          </div>
          <div className="mt-3">
            <Field label="SSH credential">
              <span className="flex gap-2">
                <input className={inputClass} value={credential} onChange={(event) => setCredential(event.target.value)} />
                <button type="button" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#e4e4e7]" aria-label="Update SSH credential" onClick={() => setCredentialOpen(true)}>
                  <IntIcon name="key" />
                </button>
              </span>
            </Field>
          </div>
          <h2 className="mt-6 font-semibold text-[#162e25]">Delivery schedule</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Times follow the organisation’s timezone, Africa/Lagos.</p>
          <div className="mt-3">
            <ScheduleField label="Expected delivery" value={schedule} options={sftpSchedules} onChange={setSchedule} />
          </div>
          {error ? <p className="mt-3 text-sm text-[#b42318]">{error}</p> : null}
          <div className="mt-5 flex justify-end gap-2">
            <LineButton href={source?.state === "Connected" ? "/integrations/sftp" : "/integrations"}>Cancel</LineButton>
            <DarkButton onClick={save}>Test and save</DarkButton>
          </div>
        </Panel>
        <SideFacts
          icon="sftp"
          title="What Wageet will receive"
          rows={[
            ["Data", "Approved earnings and work records"],
            ["Matching field", "Wageet employee ID"],
            ["Used by", "Work records → Payroll sync"],
          ]}
        />
      </div>
      <Modal open={credentialOpen} title="Update SSH credential" description="Use the read-only SFTP account assigned to this payroll folder." onClose={() => setCredentialOpen(false)}>
        <div className="space-y-3">
          <Field label="SFTP username"><input className={inputClass} value={username} onChange={(event) => setUsername(event.target.value)} /></Field>
          <Field label="SSH identity"><input className={inputClass} value={identity} onChange={(event) => setIdentity(event.target.value)} /></Field>
        </div>
        <p className="mt-2 text-sm text-[#4e6358]">The credential will be tested before the connection is saved.</p>
        <button type="button" className="mt-3 text-sm font-medium text-[#1a6849]" onClick={() => setIdentity("Payroll reader key · ending 2A19")}>
          Use previously saved key · ending 2A19
        </button>
        <div className="mt-4 flex justify-end gap-2">
          <LineButton onClick={() => setCredentialOpen(false)}>Cancel</LineButton>
          <DarkButton
            onClick={() => {
              setCredential(`${username || "payroll_reader"} · key ending ${identity.split(" ").pop()}`);
              setCredentialOpen(false);
            }}
          >
            Use credential
          </DarkButton>
        </div>
      </Modal>
      <Modal open={rejected} title="Connection test failed" description="The server rejected this SSH key. Check the payroll reader’s authorised key, then test again." onClose={() => setRejected(false)}>
        <div className="flex justify-end">
          <DarkButton onClick={() => setRejected(false)}>Back to setup</DarkButton>
        </div>
      </Modal>
    </div>
  );
}
