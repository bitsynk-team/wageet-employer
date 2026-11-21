"use client";

import Link from "next/link";
import { useState } from "react";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

export default function RolesPage() {
  const portal = usePortal();
  const [tab, setTab] = useState<"Roles" | "Team members" | "Permissions">("Roles");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportData, setExportData] = useState<"Roles" | "Team members">("Roles");
  const [exportFormat, setExportFormat] = useState("CSV (.csv)");
  const [prepared, setPrepared] = useState("");
  const [manageId, setManageId] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [invite, setInvite] = useState({ email: "", roleId: portal.roles.find((item) => item.kind === "Custom role")?.id ?? "" });
  const [error, setError] = useState("");
  const [nextRole, setNextRole] = useState("");
  const member = portal.team.find((item) => item.id === manageId);
  const removing = portal.team.find((item) => item.id === removeId);
  const customRoles = portal.roles.filter((item) => item.kind === "Custom role");

  function download() {
    const teamExport = exportData === "Team members";
    const header = teamExport ? ["Name", "Email", "Role", "Status"] : ["Role", "Kind", "Members", "Description"];
    const body = teamExport
      ? portal.team.map((item) => [item.name, item.email, portal.roles.find((role) => role.id === item.roleId)?.name ?? "", item.status])
      : portal.roles.map((item) => [item.name, item.kind, String(portal.team.filter((person) => person.roleId === item.id && person.status === "Active").length), item.description]);
    const csv = [header, ...body].map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const excel = `<table><tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr>${body.map((line) => `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
    const spreadsheet = exportFormat.startsWith("Excel");
    const blob = new Blob([spreadsheet ? excel : csv], { type: spreadsheet ? "application/vnd.ms-excel" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = spreadsheet ? `Acme-Foods-${exportData === "Roles" ? "roles" : "team"}.xlsx` : `Acme-Foods-${exportData === "Roles" ? "roles" : "team"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    setPrepared("Export prepared");
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Roles & permissions</h1>
          <p className="mt-1 text-sm text-[#4e6358]">Manage who can use your employer portal and what they can do.</p>
        </div>
        <div className="flex gap-2">
          {tab === "Permissions" ? null : (
            <button type="button" onClick={() => { setExportData(tab === "Team members" ? "Team members" : "Roles"); setExportOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
              <img src="/icons/tx/download.svg" alt="" className="size-4" />
              Export
            </button>
          )}
          {tab === "Roles" ? <Link href="/roles/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white"><img src="/icons/records/add.svg" alt="" className="size-4" />Create role</Link> : null}
          {tab === "Team members" ? <button type="button" onClick={() => { setError(""); setInviteOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white"><img src="/icons/records/add.svg" alt="" className="size-4" />Invite member</button> : null}
          {tab === "Permissions" ? <Link href="/roles/permissions/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white"><img src="/icons/records/add.svg" alt="" className="size-4" />Create permission set</Link> : null}
        </div>
      </div>
      {prepared ? <p className="mt-3 rounded-lg border border-[#d7eadc] bg-[#e7f6ee] px-3 py-2 text-sm text-[#17803d]">{prepared}</p> : null}
      <div className="mt-5 flex gap-6 border-b border-[#e7e9e9]">
        {(["Roles", "Team members", "Permissions"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`-mb-px border-b-2 pb-2 text-sm ${tab === item ? "border-[#153a2b] font-medium text-[#162e25]" : "border-transparent text-[#71717a]"}`}>{item}</button>
        ))}
      </div>

      {tab === "Roles" ? (
        <section className="mt-5">
          <h2 className="font-semibold text-[#162e25]">Workspace roles</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Select a role to see its members and permissions.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {portal.roles.map((role) => {
              const count = portal.team.filter((person) => person.roleId === role.id && person.status === "Active").length;
              return (
                <Link key={role.id} href={`/roles/${role.id}`} className="rounded-2xl border border-[#e4e4e7] p-4 hover:bg-[#f8f8f8]">
                  <span className="flex items-start justify-between">
                    <span className={`inline-flex size-10 items-center justify-center rounded-xl ${role.id === "people" ? "bg-[#f8f1e7]" : "bg-[#e7f3ee]"}`}>
                      <img src={role.id === "people" ? "/icons/employees.svg" : role.id === "payroll" ? "/icons/records.svg" : "/icons/shield.svg"} alt="" className="size-5" />
                    </span>
                    <span className="rounded-full bg-[#f4f5ef] px-2 py-1 text-[11px] font-medium text-[#526459]">{role.kind}</span>
                  </span>
                  <span className="mt-3 block font-semibold text-[#162e25]">{role.name}</span>
                  <span className="mt-1 block text-sm text-[#4e6358]">{role.description}</span>
                  <span className="mt-3 flex items-center justify-between border-t border-[#f0f2f0] pt-3 text-sm text-[#4e6358]">
                    {count} member{count === 1 ? "" : "s"}
                    <img src="/icons/records/next.svg" alt="" className="size-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {tab === "Team members" ? (
        <section className="mt-5">
          <h2 className="font-semibold text-[#162e25]">Team members</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Administrators and outstanding invitations for {portal.workspaceName}.</p>
          <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap rounded-xl border border-[#e4e4e7]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">{["Administrator", "Role", "Status", "Action"].map((heading) => <th key={heading} className="px-4 py-2.5 font-medium">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {portal.team.map((person) => (
                  <tr key={person.id} className="border-t border-[#f0f2f0]">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className={`inline-flex size-8 items-center justify-center rounded-full text-xs font-medium ${person.initials === "NE" ? "bg-[#f8f1e7] text-[#94590c]" : "bg-[#e7f3ee] text-[#153a2b]"}`}>{person.initials}</span>
                        <span>
                          <span className="block font-medium text-[#162e25]">{person.name}</span>
                          <span className="block text-xs text-[#71717a]">{person.email}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#4e6358]">{portal.roles.find((role) => role.id === person.roleId)?.name}</td>
                    <td className="px-4 py-3"><span className={`inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-medium ${person.status === "Active" ? "bg-[#e7f6ee] text-[#17803d]" : "bg-[#fbf1e0] text-[#b54708]"}`}>{person.status}</span></td>
                    <td className="px-4 py-3">
                      {person.roleId === "owner" ? <span className="inline-flex items-center gap-1 text-sm text-[#71717a]">🔒 Owner</span> : (
                        <button type="button" className="h-8 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => { setManageId(person.id); setNextRole(person.roleId); setError(""); }}>Manage</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {tab === "Permissions" ? (
        <section className="mt-5">
          <h2 className="font-semibold text-[#162e25]">Custom permission sets</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Group Wageet actions once, then assign the set to any custom role.</p>
          <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap rounded-xl border border-[#e4e4e7]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">{["Permission set", "Included actions", "Assigned to", "Action"].map((heading) => <th key={heading} className="px-4 py-2.5 font-medium">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {portal.permissionSets.map((item) => {
                  const assigned = item.assignedRoleIds.map((id) => portal.roles.find((role) => role.id === id)?.name).filter(Boolean);
                  return (
                    <tr key={item.id} className="border-t border-[#f0f2f0]">
                      <td className="px-4 py-3 font-medium text-[#162e25]">{item.name}</td>
                      <td className="px-4 py-3 text-[#4e6358]">{item.actions.length} action{item.actions.length === 1 ? "" : "s"}</td>
                      <td className="px-4 py-3 text-[#4e6358]">{assigned.length ? assigned.join(", ") : "No roles"}</td>
                      <td className="px-4 py-3"><Link href={`/roles/permissions/${item.id}`} className="inline-flex h-8 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm">Edit set</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <aside className="mt-4 rounded-2xl bg-[#f4f5ef] p-4 text-sm text-[#4e6358]">
            <h2 className="font-semibold text-[#162e25]">How permissions work</h2>
            <p className="mt-2">Wageet defines the actions available in each portal area. An owner can group these actions into a permission set and assign it to a role.</p>
          </aside>
        </section>
      ) : null}

      <Modal open={exportOpen} title="Export data" description="Download the full list for this workspace." onClose={() => setExportOpen(false)}>
        <p className="text-sm font-medium text-[#162e25]">Data</p>
        <div className="mt-2 flex gap-2">
          {(["Roles", "Team members"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setExportData(item)} className={`h-9 rounded-lg border px-3 text-sm ${exportData === item ? "border-[#153a2b] bg-[#f4f5ef]" : "border-[#e4e4e7]"}`}>{item}</button>
          ))}
        </div>
        <p className="mt-4 text-sm font-medium text-[#162e25]">File format</p>
        <div className="mt-2 flex gap-2">
          {["CSV (.csv)", "Excel (.xlsx)"].map((item) => (
            <button key={item} type="button" onClick={() => setExportFormat(item)} className={`h-9 rounded-lg border px-3 text-sm ${exportFormat === item ? "border-[#153a2b] bg-[#f4f5ef]" : "border-[#e4e4e7]"}`}>{item}</button>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setExportOpen(false)}>Cancel</button>
          <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={download}>Export</button>
        </div>
      </Modal>

      <Modal open={inviteOpen} title="Invite member" description={`Send an administrator an invitation to ${portal.workspaceName}.`} onClose={() => setInviteOpen(false)}>
        <form onSubmit={(event) => { event.preventDefault(); const message = portal.inviteMember(invite); if (message) { setError(message); return; } setInviteOpen(false); setInvite({ ...invite, email: "" }); }} className="space-y-3">
          <Field label="Work email" error={error}><input className={inputClass} placeholder="name@company.com" value={invite.email} onChange={(event) => setInvite({ ...invite, email: event.target.value })} /></Field>
          <Field label="Role">
            <select className={inputClass} value={invite.roleId} onChange={(event) => setInvite({ ...invite, roleId: event.target.value })}>
              {customRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </Field>
          <p className="text-sm text-[#4e6358]">The invitation grants access to this workspace only.</p>
          <div className="flex justify-end gap-2"><button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setInviteOpen(false)}>Cancel</button><button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Send invitation</button></div>
        </form>
      </Modal>

      <Modal open={Boolean(member)} title="Manage member" description="Update this administrator’s role or remove their portal access." onClose={() => setManageId(null)}>
        {member ? (
          <div className="space-y-3">
            <p className="text-sm text-[#4e6358]">{member.name} · {member.email}</p>
            <Field label="Role">
              <select className={inputClass} value={nextRole} onChange={(event) => setNextRole(event.target.value)}>
                {customRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
            </Field>
            {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-[#f3c7c7] px-3 text-sm text-[#b42318]" onClick={() => setRemoveId(member.id)}>Remove access</button>
              {member.status === "Invited" ? <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => { portal.resendInvite(member.id); setManageId(null); }}>Resend invite</button> : null}
              <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setManageId(null)}>Cancel</button>
              <button type="button" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white" onClick={() => { portal.updateMember(member.id, nextRole); setManageId(null); }}>Save changes</button>
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal open={Boolean(removing)} title="Remove access" description="This administrator will lose access to this employer portal." onClose={() => setRemoveId(null)}>
        {removing ? (
          <div>
            <p className="text-sm font-medium text-[#162e25]">{removing.name}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setRemoveId(null)}>Keep access</button>
              <button type="button" className="h-10 rounded-lg bg-[#b42318] px-3 text-sm font-medium text-white" onClick={() => { portal.removeMember(removing.id); setRemoveId(null); setManageId(null); }}>Remove access</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
