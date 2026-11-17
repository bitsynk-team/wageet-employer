import {
  Building2,
  CalendarClock,
  FileSpreadsheet,
  Landmark,
  LayoutDashboard,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export type PortalSection = {
  href: string;
  title: string;
  kicker: string;
  summary: string;
  detail: string;
  points: readonly string[];
  icon: LucideIcon;
};

export const sections = [
  {
    href: "/organization",
    title: "Organization",
    kicker: "Workplace",
    summary: "Company name, location, and the people Wageet should reach about payroll.",
    detail:
      "This is the workplace employees will see. Contact details are also how Wageet reaches the people running payroll if a file or funding step needs attention.",
    points: [
      "Company name and location",
      "Payroll contact details",
      "The workplace employees recognize in the app",
    ],
    icon: Building2,
  },
  {
    href: "/payroll",
    title: "Payroll cycle",
    kicker: "Pay frequency",
    summary: "How often people are paid, the payday rule, and the withdrawal cut-off.",
    detail:
      "Pay frequency is weekly or monthly. The cycle has a start date, an end date, and a payday rule. Withdrawals pause at 23:59 WAT on the last withdrawal date, so the accessed total is fixed before payroll runs.",
    points: [
      "Weekly or monthly pay",
      "Cycle start, cycle end, and payday rule",
      "Last withdrawal date at 23:59 WAT",
    ],
    icon: CalendarClock,
  },
  {
    href: "/policy",
    title: "Access policy",
    kicker: "Ceiling",
    summary: "How much confirmed earnings people can access, and when they qualify.",
    detail:
      "Wageet sets the maximum access percentage at 70% of confirmed earnings. Inside that, the workplace chooses the percentage, the waiting period, a daily limit, and a pay-cycle limit. Saving the policy does not turn withdrawals on.",
    points: [
      "Access percentage, up to 70%",
      "Minimum employment duration",
      "Daily withdrawal limit",
      "Pay-cycle withdrawal limit",
    ],
    icon: ShieldCheck,
  },
  {
    href: "/employees",
    title: "Employees",
    kicker: "People",
    summary: "Invite people and resolve rows that are missing a date, earnings, or bank detail.",
    detail:
      "Invite employees by email, one person at a time or from a spreadsheet. Each row shows the invitation email, work date, earnings, and whether the invite is ready. A missing value can be fixed before anything is sent.",
    points: [
      "Invite by email",
      "Add one person or review a spreadsheet",
      "Flag missing work dates, earnings, and bank details",
    ],
    icon: Users,
  },
  {
    href: "/records",
    title: "Work records",
    kicker: "Confirmed earnings",
    summary: "The employee ID, work date, and earnings figure that keep balances current.",
    detail:
      "Work records can arrive from the organization’s payroll or HR system, from a CSV or XLSX, or one person at a time. Each record needs an employee ID, a work date, and confirmed earnings. Anything Wageet cannot read is rejected and not saved.",
    points: [
      "Employee ID, work date, and confirmed earnings",
      "Payroll system, manual entry, or CSV/XLSX",
      "Unreadable rows are rejected",
    ],
    icon: FileSpreadsheet,
  },
  {
    href: "/funding",
    title: "Funding",
    kicker: "Payday",
    summary: "Settle amounts employees accessed. Withdrawals stay off until this is in place.",
    detail:
      "On the standard arrangement there is no workplace subscription. The organization settles amounts employees accessed, on payday. Until funding is complete, the workplace is not ready for withdrawals.",
    points: [
      "Accessed amounts are reconciled on payday",
      "No workplace subscription on the standard arrangement",
      "Withdrawals stay off until funding is complete",
    ],
    icon: Landmark,
  },
] as const satisfies readonly PortalSection[];

export const portalNav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  ...sections.map((section) => ({
    href: section.href,
    label: section.title,
    icon: section.icon,
  })),
] as const;

export function getSection(href: PortalSection["href"]) {
  const section = sections.find((item) => item.href === href);
  if (!section) {
    throw new Error(`Unknown portal section: ${href}`);
  }
  return section;
}
