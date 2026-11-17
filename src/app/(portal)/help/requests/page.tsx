"use client";

import Link from "next/link";
import { HelpFrame, RequestStatus, TopicMark } from "@/components/portal/help-centre";
import { usePortal } from "@/components/portal/store";

export default function RequestsPage() {
  const portal = usePortal();
  const empty = portal.requests.length === 0;

  return (
    <HelpFrame hideContact={empty}>
      {empty ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl bg-[#f4f5ef] px-6 py-16 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#e7f3ee]">
            <img src="/icons/help/chat.svg" alt="" className="size-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-[#162e25]">No support requests yet</h2>
          <p className="mt-1 text-sm text-[#4e6358]">Your requests and follow-ups will appear here.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Link href="/help" className="inline-flex h-10 items-center rounded-lg border border-[#dfe5dd] bg-white px-4 text-sm font-medium text-[#162e25]">Browse topics</Link>
            <Link href="/help/new" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white">
              <img src="/icons/help/chat-white.svg" alt="" className="size-4" />
              Contact support
            </Link>
          </div>
        </div>
      ) : (
        <section className="rounded-2xl border border-[#e4e4e7]">
          <h2 className="px-4 pt-4 text-base font-semibold text-[#162e25]">Recent requests</h2>
          <div className="mt-3 max-w-full overflow-x-auto overscroll-x-contain [&_th]:whitespace-nowrap">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr] bg-[#f4f5ef] px-4 py-2 text-xs text-[#666e6d]">
                <span>Request</span>
                <span>Topic</span>
                <span>Reference</span>
                <span>Status</span>
              </div>
              <ul>
                {portal.requests.map((request) => (
                  <li key={request.id} className="border-t border-[#f0f0f0]">
                    <Link href={`/help/${request.id}`} className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr] items-center px-4 py-3 text-sm hover:bg-[#fafafa]">
                      <span className="flex items-center gap-2 font-medium text-[#162e25]">
                        <TopicMark title={request.topic} />
                        {request.subject}
                      </span>
                      <span className="text-[#3f3f46]">{request.topic}</span>
                      <span className="text-[#3f3f46]">{request.id}</span>
                      <RequestStatus value={request.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </HelpFrame>
  );
}
