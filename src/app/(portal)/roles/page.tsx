"use client";

import Link from "next/link";
import { useState } from "react";
import { MemberSearch } from "@/components/portal/member-search";
import { DialogActions, MailIcon, MemberRow, TrashIcon, dangerButton, primaryButton, quietButton } from "@/components/portal/role-dialogs";
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
  const [invite, setInvite] = useState({ email: "", employeeId: "", roleId: portal.roles.find((item) => item.id !== "owner")?.id ?? "" });
  const [error, setError] = useState("");
  const [nextRole, setNextRole] = useState("");
  const member = portal.team.find((item) => item.id === manageId);
  const removing = portal.team.find((item) => item.id === removeId);
  const assignableRoles = portal.roles.filter((item) => item.id !== "owner");

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
          {tab === "Team members" ? <button type="button" onClick={() => { setError(""); setInvite({ email: "", employeeId: "", roleId: assignableRoles[0]?.id ?? "" }); setInviteOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white"><img src="/icons/records/add.svg" alt="" className="size-4" />Invite member</button> : null}
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

      <Modal sheet open={exportOpen} title="Export data" description="Download the full list for this workspace." onClose={() => setExportOpen(false)}>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-[#112c23]">Data</span>
          <select className="bg-transparent text-[#112c23] outline-none" value={exportData} onChange={(event) => setExportData(event.target.value as "Roles" | "Team members")}>
            <option>Roles</option>
            <option>Team members</option>
          </select>
        </div>
        <div className="mt-4 border-t border-[#dfe5df] pt-4">
          <p className="text-sm font-medium text-[#112c23]">File format</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {["CSV (.csv)", "Excel (.xlsx)"].map((item) => (
              <button key={item} type="button" onClick={() => setExportFormat(item)} className="flex h-[49px] items-center gap-3 rounded-lg border border-[#dfe5df] bg-white px-3 text-left text-sm text-[#112c23]">
                <span className="inline-flex size-[17px] items-center justify-center rounded-full border border-[#dfe5df]">{exportFormat === item ? <span className="size-[11px] rounded-full bg-[#216746]" /> : null}</span>
                {item}
              </button>
            ))}
          </div>
        </div>
        <DialogActions>
          <button type="button" className={quietButton} onClick={() => setExportOpen(false)}>Cancel</button>
          <button type="button" className={primaryButton} onClick={download}>Export</button>
        </DialogActions>
      </Modal>

      <Modal sheet open={inviteOpen} title="Invite member" description={`Send an administrator an invitation to ${portal.workspaceName}.`} onClose={() => setInviteOpen(false)}>
        <form onSubmit={(event) => { event.preventDefault(); const message = portal.inviteMember(invite); if (message) { setError(message); return; } setInviteOpen(false); setInvite({ ...invite, email: "", employeeId: "" }); }}>
          <MemberSearch
            employees={portal.employees}
            query={invite.email}
            selectedId={invite.employeeId}
            error={error}
            onQuery={(email) => { setInvite((current) => ({ ...current, email })); setError(""); }}
            onSelect={(person) => setInvite((current) => ({ ...current, employeeId: person?.id ?? "", email: person?.email ?? current.email }))}
          />
          <div className="mt-4">
            <Field label="Role">
              <select className={`${inputClass} rounded-[7px] border-[#dfe5df]`} value={invite.roleId} onChange={(event) => setInvite({ ...invite, roleId: event.target.value })}>
                {assignableRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
            </Field>
          </div>
          <p className="mt-4 rounded-lg bg-[#f4f6f3] px-4 py-3 text-sm text-[#53675e]">The invitation grants access to this workspace only.</p>
          <DialogActions>
            <button type="button" className={quietButton} onClick={() => setInviteOpen(false)}>Cancel</button>
            <button type="submit" className={primaryButton}>Send invitation</button>
          </DialogActions>
        </form>
      </Modal>

      <Modal sheet open={Boolean(member) && !removing} title="Manage member" description="Update this administrator’s role or remove their portal access." onClose={() => setManageId(null)}>
        {member ? (
          <div>
            <MemberRow name={member.name} />
            <div className="mt-4">
              <Field label="Role">
                <select className={`${inputClass} rounded-[7px] border-[#dfe5df]`} value={nextRole} onChange={(event) => setNextRole(event.target.value)}>
                  {assignableRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                </select>
              </Field>
            </div>
            {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className={quietButton} onClick={() => setRemoveId(member.id)}><TrashIcon />Remove access</button>
              {member.status === "Invited" ? <button type="button" className={quietButton} onClick={() => { portal.resendInvite(member.id); setManageId(null); }}><MailIcon />Resend invite</button> : null}
            </div>
            <DialogActions>
              <button type="button" className={quietButton} onClick={() => setManageId(null)}>Cancel</button>
              <button type="button" className={primaryButton} onClick={() => { portal.updateMember(member.id, nextRole); setManageId(null); }}>Save changes</button>
            </DialogActions>
          </div>
        ) : null}
      </Modal>
      <Modal sheet open={Boolean(removing)} title="Remove access" description="This administrator will lose access to this employer portal." onClose={() => setRemoveId(null)}>
        {removing ? (
          <div>
            <MemberRow name={removing.name} />
            <DialogActions>
              <button type="button" className={quietButton} onClick={() => setRemoveId(null)}>Keep access</button>
              <button type="button" className={dangerButton} onClick={() => { portal.removeMember(removing.id); setRemoveId(null); setManageId(null); }}>Remove access</button>
            </DialogActions>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
