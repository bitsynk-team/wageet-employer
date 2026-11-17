"use client";

import Link from "next/link";
import { StatusPill } from "@/components/portal/ui";
import { BackLink } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

export default function DeliveryHistoryPage() {
  const portal = usePortal();
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Delivery history</h1>
          <p className="mt-1 text-sm text-[#4e6358]">Review source activity across {portal.workspaceName}. All times are in WAT.</p>
        </div>
        <BackLink href="/integrations">All integrations</BackLink>
      </div>
      <section className="mt-5 overflow-hidden rounded-2xl border border-[#e4e4e7]">
        <div className="px-4 py-3">
          <h2 className="font-semibold text-[#162e25]">Recent deliveries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-[#f7f7f5] text-xs text-[#71717a]">
                {["Source", "Expected / received", "Records", "Result", "Action"].map((heading) => (
                  <th key={heading} className="px-4 py-2 font-medium">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portal.deliveries.map((delivery) => (
                <tr key={delivery.id} className="border-t border-[#f0f2f0]">
                  <td className="px-4 py-3 font-medium text-[#162e25]">{delivery.source}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{delivery.window}</td>
                  <td className="px-4 py-3 text-[#4e6358]">{delivery.records}</td>
                  <td className="px-4 py-3">{delivery.kind === "recovered" ? <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-[#e7f6ee] px-2 text-[11px] font-medium text-[#17803d]">● Recovered</span> : <StatusPill value={delivery.status} />}</td>
                  <td className="px-4 py-3">
                    <Link href={`/integrations/deliveries/${delivery.id}`} className="text-[#4e6358] hover:text-[#162e25]">
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
