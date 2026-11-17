"use client";

import { roleAreas, type RoleAccess } from "@/lib/role-areas";

export function AccessMatrix({
  access,
  locked = new Set<string>(),
  onChange,
}: {
  access: RoleAccess;
  locked?: Set<string>;
  onChange?: (next: RoleAccess) => void;
}) {
  function toggle(id: string, key: "view" | "extra") {
    if (!onChange || locked.has(`${id}:${key}`)) return;
    const current = access[id] ?? { view: false, extra: false };
    const next = { ...current, [key]: !current[key] };
    if (key === "extra" && next.extra) next.view = true;
    if (key === "view" && !next.view) next.extra = false;
    onChange({ ...access, [id]: next });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="text-xs text-[#71717a]">
            {["Area", "View access", "Additional access"].map((heading) => <th key={heading} className="px-3 py-2 font-medium">{heading}</th>)}
          </tr>
        </thead>
        <tbody>
          {roleAreas.map((area) => {
            const grant = access[area.id] ?? { view: false, extra: false };
            return (
              <tr key={area.id} className="border-t border-[#f0f2f0]">
                <td className="px-3 py-3 font-medium text-[#162e25]">{area.label}</td>
                <td className="px-3 py-3"><Check label={area.view} checked={grant.view} disabled={locked.has(`${area.id}:view`) || !onChange} onClick={() => toggle(area.id, "view")} /></td>
                <td className="px-3 py-3"><Check label={area.extra} checked={grant.extra} disabled={locked.has(`${area.id}:extra`) || !onChange} onClick={() => toggle(area.id, "extra")} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Check({ label, checked, disabled, onClick }: { label: string; checked: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="inline-flex items-center gap-2 text-left text-[#162e25] disabled:cursor-default">
      <span className={`inline-flex size-4 items-center justify-center rounded border ${checked ? "border-[#17803d] bg-[#e7f6ee] text-[#17803d]" : "border-[#d4d4d8] text-transparent"}`}>✓</span>
      {label}
    </button>
  );
}
