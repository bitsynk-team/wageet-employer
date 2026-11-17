"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusPill } from "@/components/portal/ui";
import { DarkButton, IntIcon, SourceMark, sourceHref } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";
import { cn } from "cn";

const filters = ["All sources", "Connected", "Not connected"] as const;

export default function IntegrationsPage() {
  const portal = usePortal();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All sources");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const scoped = useMemo(() => {
    return portal.integrations.filter((item) => {
      if (filter === "Connected") return item.state === "Connected";
      if (filter === "Not connected") return item.state === "Not connected";
      return true;
    });
  }, [filter, portal.integrations]);

  const items = scoped.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()));
  const matches = portal.integrations.filter((item) => query.trim() && item.name.toLowerCase().includes(query.trim().toLowerCase()));

  const heading = filter === "Connected" ? "Connected sources" : filter === "Not connected" ? "Available to connect" : "Available sources";
  const description =
    filter === "Connected"
      ? "Manage the automated sources linked to this workspace."
      : filter === "Not connected"
        ? "Set up a payroll source for the employees it covers."
        : `Choose how ${portal.workspaceName} sends approved payroll and work records to Wageet.`;

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Integrations</h1>
          <p className="mt-1 text-sm text-[#4e6358]">Connect your payroll tools and keep earnings up to date.</p>
        </div>
        <DarkButton href="/integrations/add">
          <IntIcon name="plus" />
          Add integration
        </DarkButton>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-fit rounded-full bg-[#f4f5ef] p-1 text-sm">
          {filters.map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={cn("h-8 rounded-full px-3", filter === item ? "bg-white font-medium text-[#162e25] shadow-sm" : "text-[#4e6358]")}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-64">
            <IntIcon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              className="h-10 w-full rounded-lg border border-[#e4e4e7] pr-3 pl-9 text-sm outline-none placeholder:text-[#71717a] focus:border-[#153a2b]"
              placeholder="Find a source…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            />
            {searchOpen && query.trim() ? (
              <ul className="absolute z-20 mt-1 w-full rounded-lg border border-[#e4e4e7] bg-white p-1 shadow-lg">
                {matches.length === 0 ? <li className="px-3 py-2 text-sm text-[#71717a]">No sources</li> : matches.map((item) => (
                  <li key={item.id}>
                    <Link href={sourceHref(item)} className="block rounded-md px-3 py-2 text-sm hover:bg-[#eaf0ec]">{item.name}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Link href="/integrations/deliveries" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e4e4e7] px-3 text-sm font-medium text-[#162e25]">
            <IntIcon name="history" />
            Delivery history
          </Link>
        </div>
      </div>

      <h2 className="mt-6 font-semibold text-[#162e25]">{heading}</h2>
      <p className="text-sm text-[#4e6358]">{description}</p>
      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-[#e4e4e7] px-4 py-10 text-center">
          <p className="font-medium text-[#162e25]">{filter === "Connected" ? "No connected sources" : filter === "Not connected" ? "All automated sources are connected" : "No sources"}</p>
          <p className="mt-1 text-sm text-[#4e6358]">
            {filter === "Connected"
              ? "Connect a payroll source to start receiving approved records."
              : filter === "Not connected"
                ? "Open Connected to manage a source or change its schedule."
                : "Try a different name or connection state."}
          </p>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col rounded-2xl border border-[#e4e4e7] p-4">
              <div className="flex items-start justify-between">
                <SourceMark id={item.id} />
                <StatusPill value={item.state} />
              </div>
              <h3 className="mt-4 font-semibold text-[#162e25]">{item.name}</h3>
              <p className="mt-1 flex-1 text-sm text-[#4e6358]">{item.body}</p>
              <Link href={sourceHref(item)} className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e4e4e7] text-sm font-medium text-[#162e25] hover:bg-[#f8f8f8]">
                <IntIcon name={item.state === "Connected" ? "settings" : item.state === "On demand" ? "upload" : "link"} />
                {item.state === "Connected" ? "Manage connection" : item.state === "On demand" ? "Upload file" : "Connect"}
              </Link>
            </article>
          ))}
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-[#e4e4e7]">
        <div className="px-4 py-3">
          <h2 className="font-semibold text-[#162e25]">Recent deliveries</h2>
          <p className="text-sm text-[#4e6358]">See which records arrived and which need a closer look.</p>
        </div>
        <div className="max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                {["Source", "Received (WAT)", "Records", "Status", ""].map((heading) => (
                  <th key={heading || "action"} className="px-4 py-2 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portal.deliveries.filter((delivery) => delivery.kind !== "recovered").map((delivery) => (
                <tr key={delivery.id} className="border-t border-[#f0f2f0]">
                  <td className="px-4 py-3 font-medium text-[#162e25]">{delivery.source}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{delivery.received}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{delivery.records}</td>
                  <td className="px-4 py-3"><StatusPill value={delivery.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/integrations/deliveries/${delivery.id}`} className="text-sm text-[#4e6358] hover:text-[#162e25]">
                      {delivery.status === "Failed" ? "View issue →" : "View delivery →"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
