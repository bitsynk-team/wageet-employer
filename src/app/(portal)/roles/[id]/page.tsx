"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { roleAreas } from "@/lib/role-areas";
import { Field, Modal, inputClass } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const portal = usePortal();
  const role = portal.roles.find((item) => item.id === id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [manageId, setManageId] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [nextRole, setNextRole] = useState("");
  if (!role) {
    return <div className="px-4 py-6 text-sm text-[#4e6358]">That role is not in this workspace. <Link className="font-medium text-[#162e25]" href="/roles">All roles</Link></div>;
  }
  const members = portal.team.filter((person) => person.roleId === role.id);
  const activeCount = members.filter((person) => person.status === "Active").length;
  const member = members.find((person) => person.id === manageId);
  const removing = portal.team.find((person) => person.id === removeId);
  const customRoles = portal.roles.filter((item) => item.kind === "Custom role");

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href="/roles" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        All roles
      </Link>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">{role.name}</h1>
      <p className="mt-1 max-w-2xl text-sm text-[#4e6358]">{role.description}</p>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-[#e4e4e7] p-4">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-semibold text-[#162e25]">Members</h2>
                <p className="text-sm text-[#4e6358]">{activeCount} member{activeCount === 1 ? "" : "s"}</p>
              </div>
              {role.id === "owner" ? null : (
                <button type="button" onClick={() => { setError(""); setInviteOpen(true); }} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] px-3 text-sm">
                  <img src="/icons/setup/plus.svg" alt="" className="size-3.5" />
                  Invite member
                </button>
              )}
            </div>
            {members.length === 0 ? <p className="mt-4 text-sm text-[#4e6358]">No members yet. Invite an administrator to use this role in {portal.workspaceName}.</p> : (
              <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead><tr className="text-xs text-[#71717a]"><th className="py-2 font-medium">Administrator</th><th className="py-2 font-medium">Status</th><th /></tr></thead>
                <tbody>
                  {members.map((person) => (
                    <tr key={person.id} className="border-t border-[#f0f2f0]">
                      <td className="py-3">
                        <span className="flex items-center gap-3">
                          <span className={`inline-flex size-8 items-center justify-center rounded-full text-xs font-medium ${person.initials === "NE" ? "bg-[#f8f1e7] text-[#94590c]" : "bg-[#e7f3ee] text-[#153a2b]"}`}>{person.initials}</span>
                          <span><span className="block font-medium text-[#162e25]">{person.name}</span><span className="block text-xs text-[#71717a]">{person.email}</span></span>
                        </span>
                      </td>
                      <td><span className={`inline-flex h-[22px] items-center rounded-full px-2 text-[11px] font-medium ${person.status === "Active" ? "bg-[#e7f6ee] text-[#17803d]" : "bg-[#fbf1e0] text-[#b54708]"}`}>{person.status}</span></td>
                      <td className="text-right">
                        {person.roleId === "owner" ? <span className="text-sm text-[#71717a]">Owner</span> : (
                          <button type="button" className="h-8 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => { setManageId(person.id); setNextRole(person.roleId); }}>Manage</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </section>
          {role.id === "owner" ? (
            <p className="rounded-xl bg-[#f4f5ef] px-4 py-3 text-sm text-[#4e6358]">Protected role. The workspace owner always has full access.</p>
          ) : (
            <section className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-[#f4f5ef] px-4 py-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-[#162e25]">Delete role</h2>
                <p className="text-sm text-[#4e6358]">The role must have no members or pending invitations.</p>
              </div>
              <button type="button" className="inline-flex h-9 items-center rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm" onClick={() => { const message = portal.deleteRole(role.id); if (message) { setError(message); return; } router.push("/roles"); }}>Delete role</button>
            </section>
          )}
          {error ? <p className="text-sm text-[#b42318]">{error}</p> : null}
        </div>
        <section className="rounded-2xl border border-[#e4e4e7] p-4">
          <h2 className="font-semibold text-[#162e25]">Permissions</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Actions granted to members of this role.</p>
          <ul className="mt-3 divide-y divide-[#f0f2f0]">
            {roleAreas.map((area) => {
              const grant = role.access[area.id] ?? { view: false, extra: false };
              return (
                <li key={area.id} className="grid grid-cols-1 items-start gap-2 py-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-3">
                  <span className="font-medium text-[#162e25]">{area.label}</span>
                  <Grant on={grant.view} label="View" />
                  <Grant on={grant.extra} label={area.extra} />
                </li>
              );
            })}
          </ul>
          {role.id === "owner" ? null : <Link href={`/roles/${role.id}/edit`} className="mt-3 inline-flex h-9 items-center rounded-lg border border-[#e4e4e7] px-3 text-sm">Edit permissions</Link>}
        </section>
      </div>
      <Modal open={inviteOpen} title="Invite member" description={`Send an administrator an invitation to ${portal.workspaceName}.`} onClose={() => setInviteOpen(false)}>
        <form onSubmit={(event) => { event.preventDefault(); const message = portal.inviteMember({ email, roleId: role.id }); if (message) { setError(message); return; } setInviteOpen(false); setEmail(""); setError(""); }} className="space-y-3">
          <Field label="Work email" error={error}><input className={inputClass} placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
          <p className="text-sm text-[#4e6358]">Role: {role.name}. The invitation grants access to this workspace only.</p>
          <div className="flex flex-wrap justify-end gap-2"><button type="button" className="h-10 rounded-lg border border-[#e4e4e7] px-3 text-sm" onClick={() => setInviteOpen(false)}>Cancel</button><button type="submit" className="h-10 rounded-lg bg-[#153a2b] px-3 text-sm font-medium text-white">Send invitation</button></div>
        </form>
      </Modal>
      <Modal open={Boolean(member)} title="Manage member" description="Update this administrator’s role or remove their portal access." onClose={() => setManageId(null)}>
        {member ? (
          <div className="space-y-3">
            <p className="text-sm text-[#4e6358]">{member.name} · {member.email}</p>
            <Field label="Role">
              <select className={inputClass} value={nextRole} onChange={(event) => setNextRole(event.target.value)}>
                {customRoles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </Field>
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

function Grant({ on, label }: { on: boolean; label: string }) {
  return <span className={`inline-flex items-center gap-1 text-xs ${on ? "text-[#17803d]" : "text-[#a1a1aa]"}`}>{on ? "✓" : "—"} {on ? label : ""}</span>;
}
