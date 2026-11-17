import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center bg-canvas px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-forest">That page is not in the portal.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The workplace screens live under overview, organization, payroll, policy, employees, work records, and funding.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-6")}>
          Back to overview
        </Link>
      </div>
    </main>
  );
}
