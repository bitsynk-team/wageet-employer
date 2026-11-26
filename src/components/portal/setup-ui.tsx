import Link from "next/link";
import { cn } from "cn";

export function SetupPage({ title, subtitle, eyebrow, children }: { title: string; subtitle: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4">
      {eyebrow ? <p className="mb-1 text-xs text-[#526459]">{eyebrow}</p> : null}
      <h1 className="text-[22px] font-semibold leading-none text-[#0f2a1f]">{title}</h1>
      <p className="mt-1.5 max-w-[640px] text-sm leading-[21px] text-[#526459]">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function SetupCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("w-full max-w-[767px] rounded-xl bg-[#f8f8f8] px-4 py-5 sm:px-8 sm:py-7", className)}>{children}</section>;
}

export function RequiredNote() {
  return <p className="text-xs text-[#fa4d01]">Fields marked * are required.</p>;
}

export function SupportLine({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <p className={cn("mt-4 max-w-[767px] text-sm text-[#526459]", align === "center" && "mx-auto text-center")}>
      Need a hand getting set up?{" "}
      <Link href="/help/new" className="font-medium text-[#0f2a1f] underline">
        Contact Wageet support
      </Link>
    </p>
  );
}

export function SetupActions({
  backHref,
  backLabel = "Back to setup",
  primary,
  onPrimary,
  onBack,
  stretch = false,
  titleCase = false,
}: {
  backHref: string;
  backLabel?: string;
  primary: string;
  onPrimary: () => void;
  onBack?: () => void;
  stretch?: boolean;
  titleCase?: boolean;
}) {
  const backWidth = stretch ? "min-w-0 flex-1" : "w-full sm:w-[180px]";
  const primaryWidth = stretch ? "min-w-0 flex-1" : "w-full whitespace-nowrap sm:w-max sm:min-w-[180px]";
  const type = titleCase ? "font-medium capitalize" : "font-bold";
  const backClass = cn("inline-flex h-11 items-center justify-center rounded-lg border border-[#dce4de] bg-[#f8f8f8] px-5 text-xs text-[#0f2a1f]", type, backWidth);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
      {onBack ? (
        <button type="button" className={backClass} onClick={onBack}>{backLabel}</button>
      ) : (
        <Link href={backHref} className={backClass}>{backLabel}</Link>
      )}
      <button type="button" onClick={onPrimary} className={cn("inline-flex h-11 items-center justify-center rounded-lg bg-[#0f2a1f] px-5 text-xs text-[#fffff4]", type, primaryWidth)}>
        {primary}
      </button>
    </div>
  );
}

export const fieldClass =
  "h-12 w-full rounded-lg border border-[#dce4de] bg-[#f8f8f8] px-4 text-sm text-[#0f2a1f] outline-none placeholder:text-[#526459] focus:border-[#0f2a1f]";

export const labelClass = "mb-2 block text-sm font-medium text-[#0f2a1f]";
