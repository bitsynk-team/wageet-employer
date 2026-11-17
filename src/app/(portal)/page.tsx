import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { sections } from "@/lib/portal";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <PageHeader
        kicker="Workplace"
        title="Set the rules before anyone can withdraw."
        description="Wageet sits on confirmed work records and a policy you set. Employees see a clear ceiling. Payday reconciles what was accessed. Saving the policy is not the same as turning withdrawals on."
      />

      <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <li key={section.href}>
              <Link href={section.href} className="block h-full rounded-xl focus-visible:outline-none">
                <Card className="h-full transition-colors hover:bg-mint/40">
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-mint text-forest">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{section.summary}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
