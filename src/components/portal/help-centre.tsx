"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const topics = [
  {
    title: "Funding & payouts",
    body: "Balance top-ups, withdrawals and payout status.",
    action: { href: "/transactions", label: "Open transactions" },
    icon: "/icons/help/wallet.svg",
    tile: "bg-[#fde8df]",
    questions: [
      ["Why is a withdrawal still processing?", "In Transactions, open the withdrawal and check its latest status. Processing means the transfer is still in progress. No employer approval is required. If you contact support, include the transaction reference."],
      ["I transferred funds. Where is my top-up?", "Check Transactions for the funding transfer. Match the amount and reference with your bank receipt. If the money left your bank and the transfer is missing, contact support with the reference and amount."],
      ["What counts as paid to employees?", "Paid means the payout reached the employee’s account. Withdrawal requests include all attempts, including processing, failed and reversed transfers."],
    ],
  },
  {
    title: "Employee setup",
    body: "Invitations, bank verification and workspace access.",
    action: { href: "/employees", label: "Open employees" },
    icon: "/icons/help/users.svg",
    tile: "bg-[#e7f6ee]",
    questions: [
      ["An employee can’t find their invitation. What should they do?", "Ask them to enter the workplace email you invited. Wageet links it to the invitation and sends a code to that email. They can then connect the workspace to their Wageet account."],
      ["Who can correct an employee’s bank details?", "An authorised employer administrator can update and verify the details in Employees. You can invite the employee first. They can withdraw once their payout account is verified."],
      ["How do I restore an employee’s access?", "Open the employee’s details and find the access-ended notice. Use Restore access there. Confirm the employee is eligible before restoring access."],
    ],
  },
  {
    title: "Payroll & records",
    body: "Pay schedules, early paydays and employer-submitted records.",
    action: { href: "/settings/payroll", label: "Open payroll schedule" },
    icon: "/icons/help/calendar.svg",
    tile: "bg-[#e8f1f8]",
    questions: [
      ["How do I pay early for one cycle?", "In Settings, open Payroll schedule and choose the period to change. Update payday and check the withdrawal cut-off. The earning period stays the same. A monthly exception can apply once or repeat each year."],
      ["Do I have to upload work records every day?", "Use salary accrual for predictable earnings, sync an available payroll source, or upload records manually. Work Records shows employer-submitted earnings records and flags items that need attention."],
      ["Can weekly and daily schedules have exceptions?", "Yes. Use Change one week or Change one workday on the schedule. Check the preview and save the exception. Other periods continue on the regular schedule."],
    ],
  },
  {
    title: "Withdrawal limits",
    body: "Access percentages, personal limits and withdrawal rules.",
    action: { href: "/access-policy", label: "Open access policy" },
    icon: "/icons/help/shield.svg",
    tile: "bg-[#fbf1e0]",
    questions: [
      ["Why can an employee withdraw less than the employer limit?", "The employee can set a personal limit on the amount you allow. If verified earnings are ₦100,000, your 60% cap allows ₦60,000. A personal limit of 40% of that amount allows ₦24,000 before other limits."],
      ["Which limits can an employer set?", "Set the share of earned wages employees can access, up to Wageet’s system cap. You can also set limits per transaction, per day and per payroll cycle in Access Policy."],
      ["What happens at the withdrawal cut-off?", "Employees can withdraw within the limits that apply until the cut-off. Check the date and time in Payroll schedule. Wageet uses the organisation’s time zone."],
    ],
  },
  {
    title: "Team & connections",
    body: "Administrator roles, permissions and payroll connections.",
    action: { href: "/integrations", label: "Open integrations" },
    icon: "/icons/help/link.svg",
    tile: "bg-[#f3eefe]",
    questions: [
      ["How do I give a colleague portal access?", "The workspace owner or an authorised administrator can create a custom role in Roles & permissions. Select the actions the colleague needs, then invite them with that role."],
      ["How do I check a payroll connection?", "Open Integrations and choose the connected source. Check its status and last sync. If a sync needs attention, review the affected records before retrying."],
      ["What should I include in a support request?", "Describe what you were trying to do, what happened, and the relevant reference or error message. Leave out passwords, transaction PINs, API secrets and full bank details."],
    ],
  },
] as const;

export const requestTopics = [...topics.map((topic) => topic.title), "Something else"] as const;

export function topicMark(title: string) {
  return topics.find((topic) => topic.title === title) ?? { icon: "/icons/help/chat.svg", tile: "bg-[#e7f6ee]" };
}

export function TopicMark({ title, large = false }: { title: string; large?: boolean }) {
  const mark = topicMark(title);
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-lg", large ? "size-9" : "size-8", mark.tile)}>
      <img src={mark.icon} alt="" className="size-4" />
    </span>
  );
}

export function RequestStatus({ value }: { value: string }) {
  return (
    <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#e7f6ee] px-2 text-[11px] font-medium text-[#17803d]">
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dfe5dd] px-3 text-sm font-medium text-[#1a6849]">
      <img src="/icons/help/back.svg" alt="" className="size-4" />
      {label}
    </Link>
  );
}

export function HelpFrame({ children, hideContact = false }: { children?: React.ReactNode; hideContact?: boolean }) {
  const pathname = usePathname();
  const onRequests = pathname.startsWith("/help/requests");
  const [topic, setTopic] = useState<string>(topics[0].title);
  const [openQuestion, setOpenQuestion] = useState<string>(topics[0].questions[0][0]);
  const current = topics.find((item) => item.title === topic) ?? topics[0];

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Help & support</h1>
          <p className="mt-1 text-sm text-[#4e6358]">Get help with your Wageet workspace and follow up on support requests.</p>
        </div>
        {hideContact ? null : (
          <Link href="/help/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white">
            <img src="/icons/help/chat-white.svg" alt="" className="size-4" />
            Contact support
          </Link>
        )}
      </div>
      <div className="mt-5 flex gap-6 border-b border-[#ececed] text-sm">
        <Link href="/help" className={cn("-mb-px border-b-[3px] pb-2", !onRequests ? "border-[#226b49] font-semibold text-[#142e24]" : "border-transparent font-normal text-[#52665b]")}>Help centre</Link>
        <Link href="/help/requests" className={cn("-mb-px border-b-[3px] pb-2", onRequests ? "border-[#226b49] font-semibold text-[#142e24]" : "border-transparent font-normal text-[#52665b]")}>My support requests</Link>
      </div>
      {onRequests ? (
        <div className="pt-4">{children}</div>
      ) : (
        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl bg-[#f4f5ef] p-3">
            <p className="px-2 pb-2 text-sm font-medium text-[#162e25]">Browse topics</p>
            <ul className="space-y-1">
              {topics.map((item) => {
                const selected = item.title === current.title;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => {
                        setTopic(item.title);
                        setOpenQuestion(item.questions[0][0]);
                      }}
                      className={cn("relative flex h-[53px] w-full items-center gap-2 rounded-[7px] bg-white px-2.5 text-left text-sm text-[#142e24]", selected && "font-medium")}
                    >
                      {selected ? <span className="absolute top-1/2 left-0 h-[27px] w-[3px] -translate-y-1/2 rounded-sm bg-[#226b49]" /> : null}
                      <TopicMark title={item.title} />
                      {item.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
          <article className="rounded-2xl border border-[#e4e4e7] p-4 sm:p-5">
            <div className="flex items-start gap-3 border-b border-[#f0f0f0] pb-3">
              <TopicMark title={current.title} large />
              <span>
                <h2 className="font-semibold text-[#162e25]">{current.title}</h2>
                <p className="text-sm text-[#4e6358]">{current.body}</p>
              </span>
            </div>
            <ul>
              {current.questions.map(([question, answer]) => {
                const open = openQuestion === question;
                return (
                  <li key={question} className="border-b border-[#f3f3f1]">
                    <button type="button" className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-[#162e25]" aria-expanded={open} onClick={() => setOpenQuestion(open ? "" : question)}>
                      {question}
                      <img src="/icons/help/chevron.svg" alt="" className={cn("size-4 shrink-0", open ? "" : "rotate-180")} />
                    </button>
                    {open ? <p className="mb-3 rounded-lg bg-[#f4f5ef] p-3 text-sm leading-relaxed text-[#3f3f46]">{answer}</p> : null}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end pt-3">
              <Link href={current.action.href} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dfe5dd] px-3 text-sm font-medium text-[#1a6849]">
                <img src="/icons/help/arrow.svg" alt="" className="size-4" />
                {current.action.label}
              </Link>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
