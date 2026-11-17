"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { actionsFromAccess, blankAccess, roleAreas, type RoleAccess } from "@/lib/role-areas";
import { AccessMatrix } from "@/components/portal/access-matrix";
import { usePortal } from "@/components/portal/store";

export default function PermissionSetPage() {
  const params = useParams<{ setId: string }>();
  const creating = params.setId === "new";
  const portal = usePortal();
  const router = useRouter();
  const existing = creating ? undefined : portal.permissionSets.find((item) => item.id === params.setId);
  const [name, setName] = useState(existing?.name ?? "");
  const [access, setAccess] = useState<RoleAccess>(existing ? accessFromLabels(existing.actions) : blankAccess());
  const [error, setError] = useState("");
  const count = actionsFromAccess(access).length;

  function save() {
    const actions = actionsFromAccess(access);
    if (creating) {
      const message = portal.createPermissionSet({ name, actions });
      if (message) {
        setError(message);
        return;
      }
    } else if (existing) {
      portal.savePermissionSet(existing.id, actions, name);
    }
    router.push("/roles");
  }

  if (!creating && !existing) {
    return <div className="px-4 py-6 text-sm">That permission set is not in this workspace. <Link href="/roles" className="font-medium">Permissions</Link></div>;
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <Link href="/roles" className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#162e25]">
        <img src="/icons/int/back.svg" alt="" className="size-4" />
        Back
      </Link>
      <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">{creating ? "Create permission set" : "Edit permission set"}</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Name this set and select the Wageet actions it grants.</p>
      <section className="mt-5 max-w-4xl rounded-2xl border border-[#e4e4e7] p-4">
        <h2 className="font-semibold text-[#162e25]">Set details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <label className="block text-sm">
            <span className="font-medium text-[#162e25]">Permission set name</span>
            <input value={name} placeholder="e.g. Funding operations" onChange={(event) => setName(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4de] px-3" />
          </label>
          <div>
            <p className="text-sm font-medium text-[#162e25]">Selected</p>
            <p className="mt-2 text-2xl font-semibold text-[#162e25]">{count} action{count === 1 ? "" : "s"}</p>
          </div>
        </div>
        {error ? <p className="mt-2 text-sm text-[#b42318]">{error}</p> : null}
        <p className="mt-4 text-sm text-[#4e6358]">Assign the set to a role to grant access. Editing a saved set updates access for every role using it.</p>
        <h2 className="mt-5 font-semibold text-[#162e25]">Wageet actions</h2>
        <p className="mt-1 text-sm text-[#4e6358]">Selecting an additional action also includes its view permission.</p>
        <div className="mt-3"><AccessMatrix access={access} onChange={setAccess} /></div>
        <div className="mt-4 flex justify-end gap-2">
          <Link href="/roles" className="inline-flex h-10 items-center rounded-lg border border-[#e4e4e7] px-4 text-sm">Cancel</Link>
          <button type="button" onClick={save} className="h-10 rounded-lg bg-[#153a2b] px-4 text-sm font-medium text-white">Save permission set</button>
        </div>
      </section>
    </div>
  );
}

function accessFromLabels(actions: string[]): RoleAccess {
  const access = blankAccess();
  for (const area of roleAreas) {
    if (actions.includes(area.view)) access[area.id].view = true;
    if (actions.includes(area.extra)) {
      access[area.id].extra = true;
      access[area.id].view = true;
    }
  }
  return access;
}
