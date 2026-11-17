export const roleAreas = [
  { id: "employees", label: "Employees", view: "View employees", extra: "Manage employees" },
  { id: "records", label: "Work records", view: "View records", extra: "Submit and correct" },
  { id: "funding", label: "Funding", view: "View balance", extra: "Add funds" },
  { id: "transactions", label: "Transactions", view: "View history", extra: "Export transactions" },
  { id: "policy", label: "Access policy", view: "View policy", extra: "Change limits" },
  { id: "cycles", label: "Payroll cycles", view: "View cycles", extra: "Manage cycles" },
  { id: "integrations", label: "Integrations", view: "View connections", extra: "Manage connections" },
  { id: "team", label: "Team access", view: "View administrators", extra: "Manage roles and invites" },
] as const;

export type RoleAccess = Record<string, { view: boolean; extra: boolean }>;

export function blankAccess(): RoleAccess {
  return Object.fromEntries(roleAreas.map((area) => [area.id, { view: false, extra: false }]));
}

export function fullAccess(): RoleAccess {
  return Object.fromEntries(roleAreas.map((area) => [area.id, { view: true, extra: true }]));
}

export function accessFromActions(actions: string[], base: RoleAccess = blankAccess()): RoleAccess {
  const next = Object.fromEntries(roleAreas.map((area) => [area.id, { ...base[area.id] }]));
  for (const area of roleAreas) {
    if (actions.includes(area.view)) next[area.id].view = true;
    if (actions.includes(area.extra)) {
      next[area.id].extra = true;
      next[area.id].view = true;
    }
  }
  return next;
}

export function actionsFromAccess(access: RoleAccess) {
  return roleAreas.flatMap((area) => {
    const grant = access[area.id] ?? { view: false, extra: false };
    return [grant.view ? area.view : "", grant.extra ? area.extra : ""].filter(Boolean);
  });
}
