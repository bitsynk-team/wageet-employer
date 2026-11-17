import type { InvitationResult } from "@/lib/types";

const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthIndex(name: string) {
  return shortMonths.findIndex((item) => item.toLowerCase() === name.slice(0, 3).toLowerCase());
}

export function presentStart(value: string) {
  const text = value.trim();
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return formatDate(new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])));
  const medium = text.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?/);
  if (medium) {
    const month = monthIndex(medium[2]);
    if (month >= 0) return formatDate(new Date(medium[3] ? Number(medium[3]) : 2026, month, Number(medium[1])));
  }
  return "Missing";
}

function formatDate(date: Date) {
  if (Number.isNaN(date.getTime())) return "Missing";
  return `${String(date.getDate()).padStart(2, "0")} ${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
}

export function bankResult(account: string, bank: string): InvitationResult["bank"] {
  const digits = account.replace(/\D/g, "");
  if (!digits && !bank.trim()) return "Missing";
  if (digits === "1023456789") return "Verified";
  if (digits.length === 10 && bank.trim()) return "Verification failed";
  return "Incomplete";
}

export function invitationResultSubtitle(rows: InvitationResult[]) {
  const sent = rows.filter((row) => row.status === "Invite Sent").length;
  const needsStart = rows.filter((row) => row.start === "Missing").length;
  const sentLabel = sent === 1 ? "Invitation sent." : `${sent} invitations sent.`;
  if (needsStart === 1) return `${sentLabel.slice(0, -1)}. One row still needs a start date.`;
  if (needsStart > 1) return `${sentLabel.slice(0, -1)}. ${needsStart} rows still need a start date.`;
  return sentLabel;
}

export function resultFromInvite(input: { email: string; start: string; account: string; bank: string }, row: number): InvitationResult {
  const start = presentStart(input.start);
  const email = input.email.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return {
    email: email || "Missing",
    start,
    status: validEmail && start !== "Missing" ? "Invite Sent" : "Needs correction",
    bank: bankResult(input.account, input.bank),
    row,
  };
}

export function parseInvitationCsv(text: string): InvitationResult[] | null {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2 || !/email/i.test(lines[0])) return null;
  return lines.slice(1).map((line, index) => {
    const [email = "", start = "", account = "", bank = ""] = line.split(",").map((part) => part.trim());
    return resultFromInvite({ email, start, account, bank }, index + 2);
  });
}
