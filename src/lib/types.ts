export type EmployeeStatus = "Active" | "Inactive" | "Invited";
export type AccountState = "Verified" | "Missing";

export type InviteDelivery = "Pending" | "Delivery failed";

export type Employee = {
  id: string;
  code: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joined: string;
  account: AccountState;
  status: EmployeeStatus;
  bank: string;
  phone: string;
  invitedBy: string;
  delivery: InviteDelivery;
};

export type WorkRecordStatus = "Confirmed" | "Held" | "Corrected";

export type WorkRecord = {
  id: string;
  employeeId: string;
  name: string;
  code: string;
  date: string;
  iso: string;
  hours: string;
  amount: number;
  status: WorkRecordStatus;
  source: string;
};
export type TxStatus = "Successful" | "Failed" | "Pending" | "Reversed" | "Adjusted";
export type TxKind = "Withdrawal" | "Top-up";

export type TxReview = "none" | "requested" | "complete";

export type Transaction = {
  id: string;
  name: string;
  kind: TxKind;
  detail: string;
  reference: string;
  date: string;
  requested: string;
  amount: number;
  status: TxStatus;
  note: string;
  cycle: "November 2026" | "October 2026";
  employeeId?: string;
  account?: string;
  fee?: number;
  provider?: string;
  review?: TxReview;
  reviewReason?: string;
  reviewRef?: string;
};

export type EarningsSource = {
  id: string;
  name: string;
  audience: string;
  confirmedThrough: string;
  schedule: string;
  connection: "Connected" | "Not connected" | "On demand";
  summary: string;
  action: string;
};

export type AttentionItem = {
  id: string;
  who: string;
  issue: string;
  source: string;
  action: string;
};

export type SourceState = "Connected" | "Not connected" | "On demand";

export type IntegrationSource = {
  id: "api" | "sftp" | "sheet";
  name: string;
  body: string;
  state: SourceState;
  group: string;
  method: string;
  location: string;
  schedule: string;
  credential: string;
};

export type DeliveryKind = "review" | "file" | "failed" | "recovered";

export type Delivery = {
  id: string;
  source: string;
  received: string;
  records: string;
  status: "Needs review" | "Completed" | "Failed";
  window: string;
  kind: DeliveryKind;
};

export type RoleAccess = Record<string, { view: boolean; extra: boolean }>;

export type Role = {
  id: string;
  name: string;
  kind: "System role" | "Custom role";
  description: string;
  members: number;
  access: RoleAccess;
  setIds: string[];
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  roleId: string;
  status: "Active" | "Invited";
};

export type PermissionSet = {
  id: string;
  name: string;
  actions: string[];
  assignedRoleIds: string[];
};

export type SupportMessage = {
  author: string;
  at: string;
  body: string;
  tone: "user" | "support";
};

export type SupportRequest = {
  id: string;
  topic: string;
  subject: string;
  status: "Open" | "Resolved" | "Reopened";
  messages: SupportMessage[];
};

export type Policy = {
  percentage: number;
  tenureDays: number;
  perTransaction: number;
  perDay: number;
  perCycle: number;
  minimum: number;
  maxRequests: number;
};

export type Organisation = {
  name: string;
  location: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  displayName?: string;
  timezone?: string;
};

export type Payroll = {
  frequency: "Weekly" | "Monthly" | "Daily";
  start: string;
  end: string;
  payday: string;
  cutoff: string;
};

export type SetupBank = {
  email: string;
  invitation: string;
  details: string;
  bankStatus: string;
};

export type FundingPhase = "idle" | "transfer" | "confirming" | "done" | "expired";

export type Profile = {
  name: string;
  email: string;
};

export type Notice = { id: string; title: string; body: string; read: boolean };
