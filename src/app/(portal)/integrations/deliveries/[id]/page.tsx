"use client";

import { useParams } from "next/navigation";
import { StatusPill } from "@/components/portal/ui";
import { BackLink, DarkButton, LineButton, Panel, Rows, SideFacts } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

export default function DeliveryDetailPage() {
  const params = useParams<{ id: string }>();
  const portal = usePortal();
  const delivery = portal.deliveries.find((item) => item.id === params.id);

  if (!delivery) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-[26px] font-semibold text-[#162e25]">Delivery</h1>
        <p className="mt-1 text-sm text-[#4e6358]">That delivery is not in this workspace.</p>
        <div className="mt-4"><LineButton href="/integrations/deliveries">Delivery history</LineButton></div>
      </div>
    );
  }

  if (delivery.kind === "recovered") {
    return (
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Delivery recovered</h1>
        <p className="mt-1 text-sm text-[#4e6358]">The source accepted the new token and returned the missed records.</p>
        <Panel className="mt-5 max-w-3xl">
          <h2 className="font-semibold text-[#162e25]">Retry result</h2>
          <div className="mt-2"><StatusPill value="Completed" /></div>
          <Rows
            rows={[
              ["Delivery", "WG-API-1211"],
              ["Retry result", "9 records received · 9 posted"],
              ["Original attempt", "Failed · 12 Nov at 08:00 WAT"],
            ]}
          />
          <div className="mt-4 flex justify-end gap-2">
            <LineButton href="/integrations">All integrations</LineButton>
            <DarkButton href="/work-records">View work records</DarkButton>
          </div>
        </Panel>
      </div>
    );
  }

  if (delivery.kind === "file") {
    return (
      <Frame
        title="Spreadsheet delivery"
        subtitle="12 November 2026 · 14:20 WAT"
        status="Completed"
        rows={[
          ["File", "work-records-12-nov.xlsx"],
          ["Source", "Spreadsheet upload"],
          ["Received", "18 records"],
          ["Posted to earnings", "18 records"],
          ["Held for review", "0 records"],
        ]}
        side={[
          ["Workspace", portal.workspaceName],
          ["Reference", "WG-UP-1211"],
          ["Delivery method", "On demand"],
        ]}
        primary={{ href: "/work-records", label: "View work records" }}
      />
    );
  }

  if (delivery.kind === "failed") {
    return (
      <Frame
        title="Failed payroll delivery"
        subtitle="12 November 2026 · Scheduled for 08:00 WAT"
        status="Failed"
        alert="The payroll system rejected the access token. Update the credential and retry this delivery."
        heading="Source authentication failed"
        rows={[
          ["Source", "Payroll API"],
          ["Records received", "0 records"],
          ["Confirmed earnings", "Previous records are retained"],
        ]}
        side={[
          ["Workspace", portal.workspaceName],
          ["Reference", "WG-API-1211"],
          ["Work date", "11 November 2026"],
        ]}
        primary={{ href: `/integrations/deliveries/${delivery.id}/retry`, label: "Update token and retry" }}
      />
    );
  }

  return (
    <Frame
      title="Payroll API delivery"
      subtitle="13 November 2026 · 08:05 WAT"
      status="Needs review"
      alert="Review the held records before posting the affected earnings."
      heading="Delivery summary"
      rows={[
        ["Source", "Payroll API · Hourly staff"],
        ["Work date", "12 November 2026"],
        ["Received", "10 records"],
        ["Processing result", "10 rows received · 8 posted · 2 held"],
      ]}
      side={[
        ["Workspace", portal.workspaceName],
        ["Reference", "WG-API-1311"],
        ["Expected arrival", "13 Nov · 08:00 WAT"],
      ]}
        primary={{ href: "/work-records/held", label: "Review 2 held rows" }}
    />
  );
}

function Frame({
  title,
  subtitle,
  status,
  heading = "Delivery summary",
  alert,
  rows,
  side,
  primary,
}: {
  title: string;
  subtitle: string;
  status: string;
  heading?: string;
  alert?: string;
  rows: [string, string][];
  side: [string, string][];
  primary: { href: string; label: string };
}) {
  const tone = status === "Failed" ? "border-[#f3c7c7] bg-[#fdecec] text-[#b42318]" : "border-[#f3e0b8] bg-[#fff6e8] text-[#9a6700]";
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">{title}</h1>
          <p className="mt-1 text-sm text-[#4e6358]">{subtitle}</p>
        </div>
        <BackLink href="/integrations/deliveries">Delivery history</BackLink>
      </div>
      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Panel>
          <h2 className="font-semibold text-[#162e25]">{heading}</h2>
          <div className="mt-2"><StatusPill value={status} /></div>
          {alert ? <p className={`mt-3 rounded-lg border px-3 py-2 text-sm ${tone}`}>{alert}</p> : null}
          <Rows rows={rows} />
          <div className="mt-4 flex justify-end gap-2">
            <LineButton href="/integrations">All integrations</LineButton>
            <DarkButton href={primary.href}>{primary.label}</DarkButton>
          </div>
        </Panel>
        <SideFacts icon="api" title="Delivery details" rows={side} />
      </div>
    </div>
  );
}
