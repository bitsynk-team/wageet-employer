import { blankAccess, fullAccess } from "@/lib/role-areas";
import type {
  AttentionItem,
  Delivery,
  EarningsSource,
  Employee,
  IntegrationSource,
  Notice,
  Organisation,
  Payroll,
  PermissionSet,
  Policy,
  Profile,
  Role,
  SupportRequest,
  TeamMember,
  Transaction,
  WorkRecord,
} from "@/lib/types";

export const workspace = {
  name: "Acme Foods Ltd",
  label: "Employer Dashboard",
};

export const profile: Profile = {
  name: "Shai Hulud",
  email: "Shai.hulud@gmail.com",
};

export const organisation: Organisation = {
  name: "Acme Foods Ltd",
  displayName: "Acme Foods",
  location: "Nigeria",
  timezone: "Africa/Lagos · WAT",
  contactName: "Shai Hulud",
  contactEmail: "hr@acmefoods.com",
  phone: "+234 800 000 0000",
};

export const payroll: Payroll = {
  frequency: "Monthly",
  start: "1 Nov 2026",
  end: "30 Nov 2026",
  payday: "30 Nov",
  cutoff: "28 Nov · 23:59 WAT",
};

export const policy: Policy = {
  percentage: 60,
  tenureDays: 30,
  perTransaction: 40000,
  perDay: 60000,
  perCycle: 300000,
  minimum: 1000,
  maxRequests: 3,
};

export const employees: Employee[] = [
  { id: "ada", code: "EMP001", name: "Ada Okafor", email: "ada@acmefoods.com", role: "HR", department: "Operations", joined: "Mar 20, 2026", account: "Verified", status: "Active", bank: "Guaranty Trust Bank · •••• 4821", phone: "+234 801 111 1111", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "tomi", code: "EMP002", name: "Tomi Adebayo", email: "tomi@acmefoods.com", role: "Member", department: "Production", joined: "Mar 20, 2026", account: "Missing", status: "Active", bank: "Not provided", phone: "+234 802 222 2222", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "ngozi", code: "EMP003", name: "Ngozi Eze", email: "ngozi@acmefoods.com", role: "Accountant", department: "People operations", joined: "Mar 20, 2026", account: "Verified", status: "Active", bank: "Access Bank · •••• 6655", phone: "+234 803 333 3333", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "fatima", code: "EMP004", name: "Fatima Yusuf", email: "fatima@acmefoods.com", role: "Member", department: "Operations", joined: "Mar 20, 2026", account: "Verified", status: "Inactive", bank: "United Bank for Africa · •••• 5566", phone: "+234 804 444 4444", invitedBy: "Shai Hulud", delivery: "Delivery failed" },
  { id: "maya", code: "EMP005", name: "Maya Chen", email: "maya@example.com", role: "Member", department: "Operations", joined: "Mar 20, 2026", account: "Verified", status: "Active", bank: "Zenith Bank · •••• 6677", phone: "+234 805 555 5555", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "liam", code: "EMP006", name: "Liam Patel", email: "liam@example.com", role: "Member", department: "Production", joined: "Mar 20, 2026", account: "Verified", status: "Inactive", bank: "Access Bank · •••• 7788", phone: "+234 806 666 6666", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "sofia", code: "EMP007", name: "Sofia Rivera", email: "sofia@example.com", role: "Member", department: "People operations", joined: "Mar 20, 2026", account: "Verified", status: "Inactive", bank: "Guaranty Trust Bank · •••• 8899", phone: "+234 807 777 7777", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "noah", code: "EMP008", name: "Noah Kim", email: "noah@example.com", role: "Member", department: "Operations", joined: "Mar 20, 2026", account: "Verified", status: "Active", bank: "Zenith Bank · •••• 9900", phone: "+234 808 888 8888", invitedBy: "Shai Hulud", delivery: "Pending" },
  { id: "emma", code: "EMP009", name: "Emma Wilson", email: "emma@example.com", role: "Member", department: "Production", joined: "Mar 20, 2026", account: "Verified", status: "Active", bank: "Access Bank · •••• 0011", phone: "+234 809 999 9999", invitedBy: "Shai Hulud", delivery: "Pending" },
];

export const transactions: Transaction[] = [
  { id: "wgt-009142", name: "Ada Okafor", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-009142", date: "06 Nov", requested: "06 Nov · 10:42", amount: 12500, status: "Successful", note: "The receiving bank confirmed delivery.", cycle: "November 2026", employeeId: "ACM-0018", account: "Guaranty Trust Bank · •••• 4821", fee: 100, provider: "TRF-009142" },
  { id: "wgt-009128", name: "Mariam Bello", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-009128", date: "06 Nov", requested: "06 Nov · 09:16", amount: 8000, status: "Failed", note: "The bank did not complete this payout. Nothing is counted toward the employee’s payroll.", cycle: "November 2026", employeeId: "ACM-0026", account: "Access Bank · •••• 6791", fee: 0, provider: "TRF-009128", review: "none", reviewRef: "WG-RV-009128" },
  { id: "wgt-009117", name: "Femi Balogun", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-009117", date: "05 Nov", requested: "05 Nov · 15:34", amount: 5000, status: "Pending", note: "The payout has been sent. Wageet will update this record when the bank responds.", cycle: "November 2026", employeeId: "ACM-0051", account: "Zenith Bank · •••• 2914", fee: 0, provider: "TRF-009117" },
  { id: "wgt-fd-061", name: "Acme Foods Ltd", kind: "Top-up", detail: "Balance top-up", reference: "WGT-FD-061", date: "05 Nov", requested: "05 Nov · 11:08", amount: 50000, status: "Successful", note: "The bank transfer has been credited to the organisation’s Wageet balance.", cycle: "November 2026", fee: 0, provider: "DEP-061" },
  { id: "wgt-009104", name: "Chidi Nwosu", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-009104", date: "04 Nov", requested: "04 Nov · 14:20", amount: 6500, status: "Reversed", note: "The bank reversed this payout. The amount has been returned to the employer balance.", cycle: "November 2026", employeeId: "ACM-0034", account: "United Bank for Africa · •••• 3162", fee: 0, provider: "TRF-009104" },
  { id: "wgt-009086", name: "Tunde Adeyemi", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-009086", date: "03 Nov", requested: "03 Nov · 11:32", amount: 10000, status: "Adjusted", note: "A ₦1,000 payroll correction was recorded against the original ₦10,000 withdrawal.", cycle: "November 2026", employeeId: "ACM-0021", account: "Access Bank · •••• 9173", fee: 100, provider: "TRF-009086" },
  { id: "wgt-acm-1042", name: "Ada Okafor", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-ACM-1042", date: "10 Oct", requested: "10 Oct · 10:42", amount: 12000, status: "Successful", note: "The receiving bank confirmed delivery.", cycle: "October 2026", employeeId: "EMP001", account: "Guaranty Trust Bank · •••• 4821", fee: 100, provider: "TRF-1042" },
  { id: "wgt-acm-0508", name: "Ada Okafor", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-ACM-0508", date: "05 Oct", requested: "05 Oct · 14:18", amount: 5000, status: "Failed", note: "The bank did not complete this payout. Nothing is counted toward the employee’s payroll.", cycle: "October 2026", employeeId: "EMP001", account: "Guaranty Trust Bank · •••• 4821", fee: 0, provider: "TRF-0508", review: "complete", reviewReason: "Check transfer status", reviewRef: "WG-RV-0508" },
  { id: "wgt-acm-0317", name: "Ada Okafor", kind: "Withdrawal", detail: "Employee withdrawal", reference: "WGT-ACM-0317", date: "03 Oct", requested: "03 Oct · 09:11", amount: 12400, status: "Successful", note: "The receiving bank confirmed delivery.", cycle: "October 2026", employeeId: "EMP001", account: "Guaranty Trust Bank · •••• 4821", fee: 100, provider: "TRF-0317" },
];

export const sources: EarningsSource[] = [
  { id: "salary", name: "Salary accrual", audience: "Fixed salaries", confirmedThrough: "12 Nov 2026", schedule: "Daily at 00:05 WAT", connection: "Connected", summary: "Earnings calculated through 12 Nov", action: "View schedule" },
  { id: "payroll", name: "Payroll sync", audience: "Hourly staff", confirmedThrough: "12 Nov 2026", schedule: "Daily · 08:00 WAT", connection: "Connected", summary: "8 approved rows posted · 2 held", action: "Review sync" },
  { id: "manual", name: "Manual uploads", audience: "Contract staff", confirmedThrough: "6 Nov 2026", schedule: "Weekly · Friday", connection: "On demand", summary: "Earnings confirmed through 6 Nov", action: "Upload records" },
];

export const attention: AttentionItem[] = [
  { id: "leave", who: "Ada Okafor", issue: "Unpaid leave submitted for an accrued day", source: "Salary accrual", action: "Review adjustment" },
  { id: "emp020", who: "Employee ID EMP020", issue: "Employee ID could not be matched", source: "Payroll sync", action: "Match employee" },
  { id: "tomi", who: "Tomi Adebayo", issue: "Two amounts for the same work date", source: "Payroll sync", action: "Compare amounts" },
];

export const deliveries: Delivery[] = [
  { id: "d1", source: "Payroll API", received: "13 Nov 2026 · 08:05", records: "8 approved rows posted · 2 held", status: "Needs review", window: "13 Nov · 08:00 / 08:05", kind: "review" },
  { id: "d2", source: "Spreadsheet upload", received: "12 Nov 2026 · 14:20", records: "18 received · 18 posted", status: "Completed", window: "12 Nov · On demand / 14:20", kind: "file" },
  { id: "d3", source: "Payroll API", received: "12 Nov 2026 · 08:00", records: "No records received", status: "Failed", window: "12 Nov · 08:00 / —", kind: "failed" },
  { id: "d4", source: "Payroll API", received: "12 Nov 2026 · 08:00", records: "9 received · 9 posted", status: "Completed", window: "12 Nov · 08:00 / Retry", kind: "recovered" },
];

export const integrations: IntegrationSource[] = [
  {
    id: "api",
    name: "Payroll API",
    body: "Bring approved earnings into Wageet directly from your payroll system.",
    state: "Connected",
    group: "Hourly staff",
    method: "API connection",
    location: "https://payroll.example/approved",
    schedule: "Daily · 08:00 WAT",
    credential: "•••• •••• •••• 7924",
  },
  {
    id: "sftp",
    name: "Secure file transfer",
    body: "Collect approved payroll files from an SFTP folder on a schedule.",
    state: "Not connected",
    group: "Contract staff",
    method: "SFTP connection",
    location: "sftp.example.com /approved-payroll/",
    schedule: "Daily · 06:00 WAT",
    credential: "payroll_reader · key ending 83B1",
  },
  {
    id: "sheet",
    name: "Spreadsheet upload",
    body: "Upload approved work records when you have a file ready to review.",
    state: "On demand",
    group: "Contract staff",
    method: "File upload",
    location: "On demand",
    schedule: "On demand",
    credential: "",
  },
];

const peopleAccess = blankAccess();
peopleAccess.employees = { view: true, extra: true };
peopleAccess.records = { view: true, extra: true };

const payrollAccess = blankAccess();
payrollAccess.records = { view: true, extra: true };
payrollAccess.funding = { view: true, extra: false };
payrollAccess.transactions = { view: true, extra: true };
payrollAccess.cycles = { view: true, extra: true };

export const roles: Role[] = [
  { id: "owner", name: "Workspace owner", kind: "System role", description: "Full access to the workspace, including administrator access and security.", members: 1, access: fullAccess(), setIds: [] },
  { id: "people", name: "People operations", kind: "Custom role", description: "Invite employees, manage their details and keep work records up to date.", members: 1, access: peopleAccess, setIds: [] },
  { id: "payroll", name: "Payroll manager", kind: "Custom role", description: "Confirm earnings and reconcile payroll records and transactions.", members: 1, access: payrollAccess, setIds: [] },
];

export const team: TeamMember[] = [
  { id: "shai", name: "Shai Hulud", email: "shai.hulud@acmefoods.com", initials: "SH", roleId: "owner", status: "Active" },
  { id: "ngozi", name: "Ngozi Eze", email: "ngozi.eze@acmefoods.com", initials: "NE", roleId: "people", status: "Active" },
  { id: "mariam", name: "Mariam Bello", email: "mariam.bello@acmefoods.com", initials: "MB", roleId: "payroll", status: "Active" },
];

export const permissionSets: PermissionSet[] = [
  { id: "reporting", name: "Payroll reporting", actions: ["View history", "Export transactions"], assignedRoleIds: [] },
];

export const requests: SupportRequest[] = [
  {
    id: "WGT-1040",
    topic: "Funding & payouts",
    subject: "Funding transfer missing",
    status: "Open",
    messages: [
      {
        author: "Shai Hulud",
        at: "15 Nov 2026 · 09:18 WAT",
        body: "Our bank transfer was debited, but I can’t see a funding credit in Transactions. Can you check the reference?",
        tone: "user",
      },
      {
        author: "Wageet Support",
        at: "15 Nov 2026 · 10:04 WAT",
        body: "Please send the transfer reference from your bank receipt so we can trace the top-up.",
        tone: "support",
      },
    ],
  },
  {
    id: "WGT-1039",
    topic: "Employee setup",
    subject: "Employee invitation email",
    status: "Resolved",
    messages: [
      {
        author: "Shai Hulud",
        at: "13 Nov 2026 · 14:32 WAT",
        body: "I need help locating an employee invitation.",
        tone: "user",
      },
      {
        author: "Resolved by Wageet Support",
        at: "13 Nov 2026 · 15:06 WAT",
        body: "We linked the existing invitation to the employee’s work email. They can now enter that email in Wageet to finish signing up.",
        tone: "support",
      },
    ],
  },
];

export const notices: Notice[] = [
  { id: "n1", title: "Withdrawal failed", body: "Mariam Bello · WGT-009128 was rejected by the bank.", read: false },
  { id: "n2", title: "Top-up confirmed", body: "₦50,000 was added to the funding balance.", read: false },
  { id: "n3", title: "Work record needs review", body: "Payroll sync held 2 rows from the 13 Nov delivery.", read: true },
];

export const records: WorkRecord[] = [
  { id: "r1", employeeId: "ada", name: "Ada Okafor", code: "EMP001", date: "11 Nov 2026", iso: "2026-11-11", hours: "8.0", amount: 12000, status: "Confirmed", source: "Salary accrual" },
  { id: "r2", employeeId: "tomi", name: "Tomi Adebayo", code: "EMP002", date: "11 Nov 2026", iso: "2026-11-11", hours: "6.0", amount: 9000, status: "Confirmed", source: "Payroll sync" },
  { id: "r3", employeeId: "ada", name: "Ada Okafor", code: "EMP001", date: "10 Nov 2026", iso: "2026-11-10", hours: "7.0", amount: 10500, status: "Corrected", source: "Salary accrual" },
  { id: "r4", employeeId: "tomi", name: "Tomi Adebayo", code: "EMP002", date: "10 Nov 2026", iso: "2026-11-10", hours: "7.5", amount: 11250, status: "Confirmed", source: "Operations payroll.csv" },
  { id: "r5", employeeId: "fatima", name: "Fatima Yusuf", code: "EMP005", date: "10 Nov 2026", iso: "2026-11-10", hours: "8.0", amount: 12000, status: "Confirmed", source: "Operations payroll.csv" },
  { id: "r6", employeeId: "ngozi", name: "Ngozi Eze", code: "EMP004", date: "9 Nov 2026", iso: "2026-11-09", hours: "6.0", amount: 9000, status: "Corrected", source: "November correction" },
  { id: "r7", employeeId: "fatima", name: "Fatima Yusuf", code: "EMP005", date: "30 Oct 2026", iso: "2026-10-30", hours: "2.0", amount: 3000, status: "Confirmed", source: "Operations payroll.csv" },
  { id: "r8", employeeId: "ada", name: "Ada Okafor", code: "EMP001", date: "28 Oct 2026", iso: "2026-10-28", hours: "8.0", amount: 12000, status: "Confirmed", source: "Salary accrual" },
];

export function naira(value: number) {
  return `₦${value.toLocaleString("en-NG")}`;
}
