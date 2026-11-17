"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  attention,
  deliveries,
  employees as seedEmployees,
  integrations as seedIntegrations,
  notices as seedNotices,
  organisation as seedOrganisation,
  payroll as seedPayroll,
  policy as seedPolicy,
  profile as seedProfile,
  records as seedRecords,
  requests as seedRequests,
  roles as seedRoles,
  team as seedTeam,
  permissionSets as seedPermissionSets,
  sources,
  transactions as seedTransactions,
  workspace,
} from "@/lib/mock-data";
import type { Delivery, Employee, FundingPhase, IntegrationSource, InvitationResult, Notice, Organisation, Payroll, PermissionSet, Policy, Profile, Role, RoleAccess, SetupBank, SupportRequest, TeamMember, Transaction, WorkRecord } from "@/lib/types";

type Toast = { message: string } | null;

function supportStamp() {
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day} ${months[now.getMonth()]} ${now.getFullYear()} · ${hours}:${minutes} WAT`;
}

type PortalStore = {
  workspaceName: string;
  profile: Profile;
  organisation: Organisation;
  payroll: Payroll;
  policy: Policy;
  scheduledPolicy: Policy | null;
  employees: Employee[];
  transactions: Transaction[];
  roles: Role[];
  team: TeamMember[];
  permissionSets: PermissionSet[];
  requests: SupportRequest[];
  notices: Notice[];
  sources: typeof sources;
  attention: typeof attention;
  deliveries: Delivery[];
  integrations: IntegrationSource[];
  apiKey: string;
  webhookEndpoint: string;
  webhookEvents: { snapshot: boolean; export: boolean };
  records: WorkRecord[];
  balance: number;
  toast: Toast;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  dismissToast: () => void;
  markNoticesRead: () => void;
  saveOrganisation: (value: Organisation) => void;
  savePayroll: (value: Payroll) => void;
  savePolicy: (value: Policy) => string | null;
  saveScheduledPolicy: (value: Policy) => string | null;
  cancelSchedule: () => void;
  saveProfile: (value: Profile) => void;
  changeEmail: (email: string) => string | null;
  inviteEmployee: (input: { name: string; email: string; role: string; joined?: string; bank?: string }) => string | null;
  saveBank: (id: string, bank: string) => void;
  patchEmployee: (id: string, patch: Partial<Employee>) => void;
  addRecord: (input: { employeeId: string; date: string; hours: string; amount: number }) => string | null;
  correctRecord: (id: string, input: { hours: string; amount: number }) => void;
  addFunds: (amount: number) => string | null;
  createRole: (input: { name: string; description: string; access: RoleAccess; setIds: string[] }) => string | null;
  updateRole: (id: string, input: { name: string; description: string; access: RoleAccess; setIds: string[] }) => string | null;
  deleteRole: (id: string) => string | null;
  inviteMember: (input: { email: string; roleId: string }) => string | null;
  updateMember: (id: string, roleId: string) => void;
  removeMember: (id: string) => void;
  resendInvite: (id: string) => void;
  savePermissionSet: (id: string, actions: string[], name?: string) => void;
  createPermissionSet: (input: { name: string; actions: string[] }) => string | null;
  sendRequest: (input: { topic: string; subject: string; body: string }) => { error: string | null; id: string | null };
  addReply: (id: string, body: string) => string | null;
  reopenRequest: (id: string) => void;
  saveApiConnection: (input: { group: string; endpoint: string; token: string; schedule: string }) => string | null;
  saveSftpConnection: (input: { group: string; host: string; folder: string; credential: string; schedule: string }) => string | null;
  disconnectSource: (id: "api" | "sftp") => void;
  rotateApiKey: () => string;
  saveWebhook: (input: { endpoint: string; snapshot: boolean; export: boolean }) => string | null;
  retryDelivery: (token: string) => string | null;
  requestReview: (id: string, reason: string) => void;
  resolveAttention: (id: string) => void;
  switchWorkspace: (name: string) => void;
  signOut: () => void;
  notify: (message: string) => void;
  orgSaved: boolean;
  payrollSaved: boolean;
  policySaved: boolean;
  employeesAdded: boolean;
  banksReady: boolean;
  recordsSubmitted: boolean;
  fundingPhase: FundingPhase;
  fundingAmount: number;
  setupBanks: SetupBank[];
  invitationResults: InvitationResult[];
  saveInvitationResults: (rows: InvitationResult[]) => void;
  markEmployeesAdded: () => void;
  saveSetupBank: (email: string, details: string) => void;
  markRecordsSubmitted: () => void;
  startFunding: (amount: number) => string | null;
  confirmFunding: () => void;
  completeFunding: (amount?: number) => void;
  expireFunding: () => void;
};

const PortalContext = createContext<PortalStore | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [profile, setProfile] = useState(seedProfile);
  const [organisation, setOrganisation] = useState(seedOrganisation);
  const [payroll, setPayroll] = useState(seedPayroll);
  const [policy, setPolicy] = useState(seedPolicy);
  const [employees, setEmployees] = useState(seedEmployees);
  const [transactions, setTransactions] = useState(seedTransactions);
  const [roles, setRoles] = useState(seedRoles);
  const [team, setTeam] = useState(seedTeam);
  const [permissionSets, setPermissionSets] = useState(seedPermissionSets);
  const [scheduledPolicy, setScheduledPolicy] = useState<Policy | null>({ ...seedPolicy, percentage: 55 });
  const [requests, setRequests] = useState(seedRequests);
  const [notices, setNotices] = useState(seedNotices);
  const [integrations, setIntegrations] = useState(seedIntegrations);
  const [deliveryRows, setDeliveryRows] = useState(deliveries);
  const [apiKey, setApiKey] = useState("wg_live_••••••••••••84A2");
  const [webhookEndpoint, setWebhookEndpoint] = useState("https://payroll.example.com/wageet");
  const [webhookEvents, setWebhookEvents] = useState({ snapshot: true, export: true });
  const [openAttention, setOpenAttention] = useState(attention);
  const [balance, setBalance] = useState(50000);
  const [toast, setToast] = useState<Toast>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [orgSaved, setOrgSaved] = useState(false);
  const [payrollSaved, setPayrollSaved] = useState(false);
  const [policySaved, setPolicySaved] = useState(false);
  const [records, setRecords] = useState<WorkRecord[]>(seedRecords);
  const [employeesAdded, setEmployeesAdded] = useState(false);
  const [banksReady, setBanksReady] = useState(false);
  const [recordsSubmitted, setRecordsSubmitted] = useState(false);
  const [fundingPhase, setFundingPhase] = useState<FundingPhase>("idle");
  const [fundingAmount, setFundingAmount] = useState(0);
  const [setupBanks, setSetupBanks] = useState<SetupBank[]>([
    { email: "ada@acmefoods.com", invitation: "Invitation sent", details: "Not provided", bankStatus: "Not added" },
    { email: "sam@acmefoods.com", invitation: "Invitation sent", details: "Access Bank · •••• 6791", bankStatus: "Verification failed" },
  ]);
  const [invitationResults, setInvitationResults] = useState<InvitationResult[]>([]);

  const value = useMemo<PortalStore>(
    () => ({
      workspaceName,
      profile,
      organisation,
      payroll,
      policy,
      scheduledPolicy,
      employees,
      transactions,
      roles,
      team,
      permissionSets,
      requests,
      notices,
      sources,
      attention: openAttention,
      deliveries: deliveryRows,
      integrations,
      apiKey,
      webhookEndpoint,
      webhookEvents,
      records,
      balance,
      toast,
      collapsed,
      setCollapsed,
      dismissToast: () => setToast(null),
      markNoticesRead: () => setNotices((items) => items.map((item) => ({ ...item, read: true }))),
      saveOrganisation: (next) => {
        setOrganisation(next);
        setOrgSaved(true);
        setToast({ message: "Organization details saved." });
      },
      savePayroll: (next) => {
        setPayroll(next);
        setPayrollSaved(true);
        setToast({ message: "Payroll cycle saved." });
      },
      savePolicy: (next) => {
        if (next.percentage < 1 || next.percentage > 70) return "The access percentage must be between 1 and 70.";
        if (next.perTransaction > next.perDay) return "The per-transaction limit cannot exceed the daily limit.";
        if (next.perDay > next.perCycle) return "The daily limit cannot exceed the pay-cycle limit.";
        if (next.minimum < 1000) return "The minimum withdrawal is ₦1,000.";
        if (next.tenureDays < 0) return "Employment duration cannot be negative.";
        if (next.maxRequests < 1) return "Allow at least one request per cycle.";
        setPolicy(next);
        setPolicySaved(true);
        setToast({ message: "Access policy saved. Withdrawals stay off until funding is complete." });
        return null;
      },
      saveScheduledPolicy: (next) => {
        if (next.percentage < 1 || next.percentage > 70) return "The access percentage must be between 1 and 70.";
        if (next.perTransaction > next.perDay) return "The per-transaction limit cannot exceed the daily limit.";
        if (next.perDay > next.perCycle) return "The daily limit cannot exceed the pay-cycle limit.";
        if (next.minimum < 1000) return "The minimum withdrawal is ₦1,000.";
        if (next.tenureDays < 0) return "Employment duration cannot be negative.";
        if (next.maxRequests < 1) return "Allow at least one request per cycle.";
        setScheduledPolicy(next);
        setPolicySaved(true);
        setToast({ message: "Policy scheduled for 1 December 2026." });
        return null;
      },
      cancelSchedule: () => {
        setScheduledPolicy(null);
        setToast({ message: "Scheduled policy cancelled. The current policy stays in place." });
      },
      saveProfile: (next) => {
        if (next.name.trim().length < 2) return;
        setProfile(next);
        setToast({ message: "Profile updated." });
      },
      changeEmail: (email) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid sign-in email.";
        setProfile((current) => ({ ...current, email }));
        setToast({ message: "Sign-in email updated. A confirmation was sent." });
        return null;
      },
      inviteEmployee: (input) => {
        if (!input.name.trim()) return "Enter the employee’s name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return "Enter a valid work email.";
        if (employees.some((person) => person.email.toLowerCase() === input.email.toLowerCase())) {
          return "That email is already in this workspace.";
        }
        const person: Employee = {
          id: input.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() || `emp-${employees.length + 1}`,
          code: `EMP${String(employees.length + 1).padStart(3, "0")}`,
          name: input.name.trim(),
          email: input.email.trim(),
          role: input.role || "Member",
          department: "Operations",
          joined: input.joined || "17 Nov 2026",
          account: input.bank ? "Verified" : "Missing",
          status: "Invited",
          bank: input.bank || "Not provided",
          phone: "—",
          invitedBy: "Shai Hulud",
          delivery: "Pending",
        };
        setEmployees((current) => [person, ...current]);
        return null;
      },
      saveBank: (id, bank) => {
        setEmployees((current) =>
          current.map((person) => (person.id === id ? { ...person, bank, account: "Verified" } : person)),
        );
        setToast({ message: "Receiving account saved." });
      },
      patchEmployee: (id, patch) => {
        setEmployees((current) => current.map((person) => (person.id === id ? { ...person, ...patch } : person)));
      },
      addRecord: (input) => {
        const person = employees.find((item) => item.id === input.employeeId);
        if (!person) return "Choose an employee.";
        if (!input.date) return "Enter the work date.";
        if (!Number(input.hours)) return "Enter the hours.";
        if (!Number.isFinite(input.amount) || input.amount <= 0) return "Enter the earnings.";
        const next: WorkRecord = {
          id: `r-${records.length + 1}`,
          employeeId: person.id,
          name: person.name,
          code: person.code,
          date: input.date,
          iso: input.date,
          hours: input.hours,
          amount: input.amount,
          status: "Confirmed",
          source: "Added record",
        };
        setRecords((current) => [next, ...current]);
        setToast({ message: `1 record confirmed. ${person.name.split(" ")[0]}’s earnings increased by ₦${input.amount.toLocaleString("en-NG")}.` });
        return null;
      },
      correctRecord: (id, input) => {
        setRecords((current) => current.map((record) => (record.id === id ? { ...record, hours: input.hours, amount: input.amount, status: "Corrected" } : record)));
        setToast({ message: "Work record corrected." });
      },
      addFunds: (amount) => {
        if (!Number.isFinite(amount) || amount < 1000) return "Enter at least ₦1,000.";
        const reference = `WGT-FD-${String(70 + transactions.length)}`;
        const next: Transaction = {
          id: reference.toLowerCase(),
          name: workspaceName,
          kind: "Top-up",
          detail: "Balance top-up",
          reference,
          date: "17 Nov",
          requested: "17 Nov · 16:30",
          amount,
          status: "Successful",
          note: "The bank transfer has been credited to the organisation’s Wageet balance.",
          cycle: "November 2026",
          fee: 0,
          provider: reference.replace("WGT-FD-", "DEP-"),
        };
        setTransactions((current) => [next, ...current]);
        setBalance((current) => current + amount);
        setToast({ message: `${amount.toLocaleString("en-NG")} added to the funding balance.` });
        return null;
      },
      createRole: (input) => {
        const name = input.name.trim();
        if (name.length < 2) return "Give the role a name your team will recognise.";
        if (roles.some((item) => item.name.toLowerCase() === name.toLowerCase())) return "A role with this name already exists.";
        const id = name.toLowerCase().replace(/\s+/g, "-");
        setRoles((current) => [
          ...current,
          { id, name, kind: "Custom role", description: input.description.trim(), members: 0, access: input.access, setIds: input.setIds },
        ]);
        setPermissionSets((current) =>
          current.map((set) => ({
            ...set,
            assignedRoleIds: input.setIds.includes(set.id) ? [...new Set([...set.assignedRoleIds, id])] : set.assignedRoleIds.filter((roleId) => roleId !== id),
          })),
        );
        setToast({ message: "Role created." });
        return null;
      },
      updateRole: (id, input) => {
        const name = input.name.trim();
        if (id === "owner") return "The workspace owner role is protected.";
        if (name.length < 2) return "Give the role a name your team will recognise.";
        if (roles.some((item) => item.id !== id && item.name.toLowerCase() === name.toLowerCase())) return "A role with this name already exists.";
        setRoles((current) =>
          current.map((item) => (item.id === id ? { ...item, name, description: input.description.trim(), access: input.access, setIds: input.setIds } : item)),
        );
        setPermissionSets((current) =>
          current.map((set) => ({
            ...set,
            assignedRoleIds: input.setIds.includes(set.id) ? [...new Set([...set.assignedRoleIds, id])] : set.assignedRoleIds.filter((roleId) => roleId !== id),
          })),
        );
        setToast({ message: "Role updated." });
        return null;
      },
      deleteRole: (id) => {
        if (id === "owner") return "The workspace owner role is protected.";
        if (team.some((member) => member.roleId === id)) return "The role must have no members or pending invitations.";
        setRoles((current) => current.filter((item) => item.id !== id));
        setToast({ message: "Role removed." });
        return null;
      },
      inviteMember: (input) => {
        const email = input.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a work email to send the invitation.";
        if (team.some((member) => member.email.toLowerCase() === email)) return "This email already has access or a pending invitation.";
        const local = email.split("@")[0] ?? "New member";
        const name = local.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
        const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
        setTeam((current) => [...current, { id: email, name, email, initials, roleId: input.roleId, status: "Invited" }]);
        setToast({ message: "Invitation sent." });
        return null;
      },
      updateMember: (id, roleId) => {
        setTeam((current) => current.map((member) => (member.id === id ? { ...member, roleId } : member)));
        setToast({ message: "Role updated." });
      },
      removeMember: (id) => {
        const member = team.find((item) => item.id === id);
        setTeam((current) => current.filter((item) => item.id !== id));
        setToast({ message: member?.status === "Invited" ? "Invitation cancelled." : "Access removed." });
      },
      resendInvite: (id) => {
        if (!team.some((member) => member.id === id && member.status === "Invited")) return;
        setToast({ message: "Invitation resent." });
      },
      savePermissionSet: (id, actions, name) => {
        setPermissionSets((current) => current.map((item) => (item.id === id ? { ...item, actions, name: name?.trim() || item.name } : item)));
        setToast({ message: "Permission set updated." });
      },
      createPermissionSet: (input) => {
        const trimmed = input.name.trim();
        if (trimmed.length < 3) return "Enter a permission set name.";
        if (permissionSets.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())) return "A permission set with this name already exists.";
        setPermissionSets((current) => [...current, { id: trimmed.toLowerCase().replace(/\s+/g, "-"), name: trimmed, actions: input.actions, assignedRoleIds: [] }]);
        setToast({ message: "Permission set created." });
        return null;
      },
      sendRequest: (input) => {
        if (!input.topic) return { error: "Choose a topic.", id: null };
        if (!input.subject.trim()) return { error: "Enter a subject.", id: null };
        if (!input.body.trim()) return { error: "Describe what happened.", id: null };
        const numbers = requests.map((item) => Number(item.id.replace(/\D/g, ""))).filter((value) => Number.isFinite(value));
        const id = `WGT-${Math.max(1040, ...numbers) + 1}`;
        const request: SupportRequest = {
          id,
          topic: input.topic,
          subject: input.subject.trim(),
          status: "Open",
          messages: [{ author: profile.name, at: supportStamp(), body: input.body.trim(), tone: "user" }],
        };
        setRequests((current) => [request, ...current]);
        return { error: null, id };
      },
      addReply: (id, body) => {
        const text = body.trim();
        if (!text) return "Write a reply before sending.";
        if (!requests.some((item) => item.id === id)) return "That request was not found.";
        setRequests((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, messages: [...item.messages, { author: "Employer reply", at: supportStamp(), body: text, tone: "user" }] }
              : item,
          ),
        );
        return null;
      },
      reopenRequest: (id) => {
        setRequests((current) => current.map((item) => (item.id === id ? { ...item, status: "Reopened" } : item)));
      },
      saveApiConnection: (input) => {
        if (!input.endpoint.trim().startsWith("https://") || input.token.trim().length < 4) {
          return "Enter the endpoint and a read-only access token.";
        }
        if (input.token.includes("3271")) return "rejected";
        const digits = input.token.replace(/\D/g, "");
        const ending = digits.slice(-4) || "7924";
        setIntegrations((current) =>
          current.map((item) =>
            item.id === "api"
              ? { ...item, state: "Connected", group: input.group.trim() || item.group, location: input.endpoint.trim(), schedule: input.schedule, credential: `•••• •••• •••• ${ending}` }
              : item,
          ),
        );
        setToast({ message: "Payroll API connection saved." });
        return null;
      },
      saveSftpConnection: (input) => {
        if (!input.host.trim() || !input.folder.trim() || input.credential.trim().length < 4) {
          return "Enter the host, folder and SSH credential.";
        }
        if (input.credential.toUpperCase().includes("2A19")) return "rejected";
        const ending = input.credential.toUpperCase().match(/[0-9A-F]{4}$/)?.[0] ?? "6D42";
        setIntegrations((current) =>
          current.map((item) =>
            item.id === "sftp"
              ? {
                  ...item,
                  state: "Connected",
                  group: input.group.trim() || item.group,
                  location: `${input.host.trim()} ${input.folder.trim()}`,
                  schedule: input.schedule,
                  credential: `payroll_reader · key ending ${ending}`,
                }
              : item,
          ),
        );
        setToast({ message: "Secure file transfer connection saved." });
        return null;
      },
      disconnectSource: (id) => {
        setIntegrations((current) => current.map((item) => (item.id === id ? { ...item, state: "Not connected" } : item)));
        setToast({ message: id === "api" ? "Payroll API disconnected." : "Secure file transfer disconnected." });
      },
      rotateApiKey: () => {
        const revealed = "wg_test_demo_6c48e7f2";
        setApiKey("wg_live_••••••••••••19C7");
        setToast({ message: "Save this key in your connector before closing this message." });
        return revealed;
      },
      saveWebhook: (input) => {
        if (!input.endpoint.trim().startsWith("https://") || input.endpoint.trim().length < 12) return "Enter an HTTPS endpoint.";
        if (!input.snapshot && !input.export) return "Choose at least one payroll event.";
        setWebhookEndpoint(input.endpoint.trim());
        setWebhookEvents({ snapshot: input.snapshot, export: input.export });
        setToast({ message: "Webhook saved." });
        return null;
      },
      retryDelivery: (token) => {
        if (token.trim().length < 4) return "Enter a current access token.";
        if (token.includes("3271")) return "rejected";
        const digits = token.replace(/\D/g, "");
        const ending = digits.slice(-4) || "6842";
        setDeliveryRows((current) =>
          current.map((row) =>
            row.id === "d3"
              ? { ...row, status: "Completed", kind: "recovered", records: "9 records received · 9 posted", received: "12 Nov 2026 · 08:00", window: "12 Nov · 08:00 / 08:00" }
              : row,
          ),
        );
        setIntegrations((current) =>
          current.map((item) => (item.id === "api" ? { ...item, credential: `•••• •••• •••• ${ending}` } : item)),
        );
        setToast({ message: "Delivery recovered. 9 records were posted." });
        return null;
      },
      requestReview: (id, reason) => {
        setTransactions((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, review: "requested", reviewReason: reason, reviewRef: item.reviewRef ?? `WG-RV-${item.reference.slice(-6)}` }
              : item,
          ),
        );
        setToast({ message: "Review requested. The payout and payroll amount are unchanged." });
      },
      resolveAttention: (id) => {
        setOpenAttention((current) => current.filter((item) => item.id !== id));
        setToast({ message: "Marked as reviewed." });
      },
      switchWorkspace: (name) => {
        setWorkspaceName(name);
        setToast({ message: `Switched to ${name}.` });
      },
      signOut: () => {
        setToast(null);
      },
      notify: (message) => setToast({ message }),
      orgSaved,
      payrollSaved,
      policySaved,
      employeesAdded,
      banksReady,
      recordsSubmitted,
      fundingPhase,
      fundingAmount,
      setupBanks,
      invitationResults,
      saveInvitationResults: (rows) => {
        setInvitationResults(rows);
        setEmployeesAdded(rows.some((row) => row.status === "Invite Sent"));
        const invited = rows.filter((row) => row.status === "Invite Sent");
        if (invited.length === 0) return;
        setSetupBanks(invited.map((row) => ({
          email: row.email,
          invitation: "Invitation sent",
          details: row.bank === "Verified" ? "Verified" : row.bank === "Verification failed" ? "Account entered" : "Not provided",
          bankStatus: row.bank === "Verified" ? "Verified" : row.bank === "Verification failed" ? "Verification failed" : "Not added",
        })));
        setBanksReady(invited.every((row) => row.bank === "Verified"));
      },
      markEmployeesAdded: () => setEmployeesAdded(true),
      saveSetupBank: (email, details) => {
        setSetupBanks((current) => {
          const next = current.map((row) => (row.email === email ? { ...row, details, bankStatus: "Verified" } : row));
          if (next.every((row) => row.bankStatus === "Verified")) setBanksReady(true);
          return next;
        });
        setToast({ message: "Bank details submitted for verification." });
      },
      markRecordsSubmitted: () => {
        setRecordsSubmitted(true);
        setToast({ message: "Work records submitted." });
      },
      startFunding: (amount) => {
        if (!Number.isFinite(amount) || amount < 1000) return "Enter an amount or choose a preset.";
        setFundingAmount(amount);
        setFundingPhase("transfer");
        return null;
      },
      confirmFunding: () => setFundingPhase("confirming"),
      completeFunding: (amount) => {
        const credit = amount ?? fundingAmount;
        setFundingPhase("done");
        if (credit > 0) setBalance((current) => current + credit);
        setToast({ message: "Your bank confirmed the deposit." });
      },
      expireFunding: () => setFundingPhase("expired"),
    }),
    [
      apiKey,
      balance,
      banksReady,
      employeesAdded,
      fundingAmount,
      fundingPhase,
      collapsed,
      deliveryRows,
      employees,
      integrations,
      webhookEndpoint,
      webhookEvents,
      notices,
      openAttention,
      orgSaved,
      organisation,
      payroll,
      payrollSaved,
      permissionSets,
      policy,
      policySaved,
      profile,
      records,
      recordsSubmitted,
      requests,
      roles,
      scheduledPolicy,
      invitationResults,
      setupBanks,
      team,
      toast,
      transactions,
      workspaceName,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const store = useContext(PortalContext);
  if (!store) throw new Error("usePortal must be used inside PortalProvider");
  return store;
}

export function setupProgress(store: PortalStore) {
  return {
    details: store.orgSaved,
    payroll: store.payrollSaved,
    policy: store.policySaved,
    invited: store.employeesAdded,
    banks: store.banksReady,
    records: store.recordsSubmitted,
    funded: store.fundingPhase === "done",
  };
}
