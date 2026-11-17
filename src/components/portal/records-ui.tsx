import Link from "next/link";
import { cn } from "cn";

export function RecordCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 max-w-3xl rounded-2xl border border-[#e6e8e3] bg-white p-5">
      {title ? <h2 className="text-base font-semibold text-[#0f2a1f]">{title}</h2> : null}
      {children}
    </section>
  );
}

export function RecordLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[#f0f2f0] py-3 text-sm last:border-0">
      <dt className="text-[#526459]">{label}</dt>
      <dd className="text-right font-medium text-[#0f2a1f]">{value}</dd>
    </div>
  );
}

export function RecordNote({ tone = "amber", children }: { tone?: "amber" | "blue"; children: React.ReactNode }) {
  return (
    <p className={cn("mt-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm", tone === "blue" ? "bg-[#eef4ff] text-[#2e5aac]" : "bg-[#fff6e8] text-[#9a6700]")}>
      <img src={tone === "blue" ? "/icons/records/info-blue.svg" : "/icons/records/info.svg"} alt="" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export function RecordActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center justify-end gap-2">{children}</div>;
}

export function OutlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex h-10 items-center rounded-lg border border-[#dce4de] bg-white px-4 text-sm text-[#0f2a1f]">{children}</Link>;
}

export function DarkButton({ children, onClick, type = "button" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit" }) {
  return <button type={type} onClick={onClick} className="inline-flex h-10 items-center rounded-lg bg-[#0f2a1f] px-4 text-sm font-bold text-[#fffff4]">{children}</button>;
}
