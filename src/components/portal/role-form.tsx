"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { accessFromActions, blankAccess, roleAreas, type RoleAccess } from "@/lib/role-areas";
import { AccessMatrix } from "@/components/portal/access-matrix";
import { usePortal } from "@/components/portal/store";

export function RoleForm({ roleId }: { roleId?: string }) {
  const portal = usePortal();
  const router = useRouter();
  const existing = portal.roles.find((item) => item.id === roleId);
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [setIds, setSetIds] = useState<string[]>(existing?.setIds ?? []);
  const [manual, setManual] = useState<RoleAccess>(stripSets(existing?.access ?? blankAccess(), actionsFor(portal.permissionSets, existing?.setIds ?? [])));
  const [error, setError] = useState("");
  const selectedActions = actionsFor(portal.permissionSets, setIds);
  const access = useMemo(() => accessFromActions(selectedActions, manual), [manual, selectedActions]);
  const locked = lockKeys(selectedActions);

  function toggleSet(id: string) {
    setSetIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function save() {
    const input = { name, description, access, setIds };
    const message = existing ? portal.updateRole(existing.id, input) : portal.createRole(input);
    if (message) {
      setError(message);
      return;
    }
    const id = existing?.id ?? name.trim().toLowerCase().replace(/\s+/g, "-");
    router.push(`/roles/${id}`);
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href={existing ? `/roles/${existing.id}` : "/roles"} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        Back
      </Link>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">{existing ? "Edit permissions" : "Create role"}</h1>
      <p className="mt-1 text-sm text-[#4e6358]">{existing ? `Choose the actions ${existing.name} can take in ${portal.workspaceName}.` : `Name the role and choose the actions its members can take in ${portal.workspaceName}.`}</p>
      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-[#e4e4e7] p-4">
            <h2 className="font-semibold text-[#162e25]">Role details</h2>
            <label className="mt-4 block text-sm">
              <span className="font-medium text-[#162e25]">Role name</span>
              <input value={name} placeholder="e.g. Accountant" onChange={(event) => setName(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" />
              <span className="mt-1 block text-xs text-[#71717a]">Give the role a name your team will recognise.</span>
            </label>
            <label className="mt-4 block text-sm">
              <span className="font-medium text-[#162e25]">Description (optional)</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 h-24 w-full rounded-lg border border-[#dce4de] px-3 py-2" />
            </label>
            {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
          </section>
          <section className="rounded-2xl border border-[#e4e4e7] p-4">
            <h2 className="font-semibold text-[#162e25]">Workspace permissions</h2>
            <p className="mt-1 text-sm text-[#4e6358]">Actions marked with a lock come from an assigned permission set.</p>
            <div className="mt-3"><AccessMatrix access={access} locked={locked} onChange={setManual} /></div>
          </section>
          <div className="flex justify-end gap-2">
            <Link href={existing ? `/roles/${existing.id}` : "/roles"} className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Cancel</Link>
            <button type="button" onClick={save} className="h-10 rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">Save role</button>
          </div>
        </div>
        <aside className="rounded-2xl border border-[#e4e4e7] p-4">
          <h2 className="font-semibold text-[#162e25]">Permission sets</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Apply saved actions to this role.</p>
          <p className="mt-3 text-xs font-medium tracking-wide text-[#71717a] uppercase">Choose permission sets</p>
          <ul className="mt-2 space-y-2">
            {portal.permissionSets.map((set) => (
              <li key={set.id}>
                <label className="flex items-start gap-2 text-sm text-[#162e25]">
                  <input type="checkbox" className="mt-1" checked={setIds.includes(set.id)} onChange={() => toggleSet(set.id)} />
                  <span><span className="block font-medium">{set.name}</span><span className="text-xs text-[#71717a]">{set.actions.length} actions</span></span>
                </label>
              </li>
            ))}
          </ul>
          <Link href="/roles/permissions/new" className="mt-4 inline-flex text-sm font-medium text-[#236355]">Create permission set</Link>
        </aside>
      </div>
    </div>
  );
}

function actionsFor(sets: { id: string; actions: string[] }[], ids: string[]) {
  return sets.filter((set) => ids.includes(set.id)).flatMap((set) => set.actions);
}

function lockKeys(actions: string[]) {
  const keys = new Set<string>();
  for (const area of roleAreas) {
    if (actions.includes(area.view)) keys.add(`${area.id}:view`);
    if (actions.includes(area.extra)) {
      keys.add(`${area.id}:view`);
      keys.add(`${area.id}:extra`);
    }
  }
  return keys;
}

function stripSets(access: RoleAccess, actions: string[]): RoleAccess {
  const next = accessFromActions([], access);
  for (const area of roleAreas) {
    if (actions.includes(area.view)) next[area.id].view = next[area.id].extra;
    if (actions.includes(area.extra)) next[area.id].extra = false;
    if (!next[area.id].extra && actions.includes(area.view)) next[area.id].view = false;
  }
  return next;
}
