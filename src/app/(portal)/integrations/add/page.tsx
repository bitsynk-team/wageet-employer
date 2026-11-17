"use client";

import Link from "next/link";
import { LineButton, Panel, SourceMark, addHint, sourceHref } from "@/components/portal/integrations-ui";
import { usePortal } from "@/components/portal/store";

export default function AddIntegrationPage() {
  const portal = usePortal();
  return (
    <div className="px-4 py-5 sm:px-6">
      <h1 className="text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">Add integration</h1>
      <p className="mt-1 text-sm text-[#4e6358]">Choose the source for your approved work records.</p>
      <Panel className="mt-5">
        <h2 className="font-semibold text-[#162e25]">Choose a source</h2>
        <div className="mt-3 space-y-3">
          {portal.integrations.map((item) => (
            <Link key={item.id} href={sourceHref(item)} className="flex items-center gap-3 rounded-xl border border-[#e4e4e7] p-3 hover:bg-[#f8f8f8]">
              <SourceMark id={item.id} />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-[#162e25]">{item.name}</span>
                <span className="block text-sm text-[#4e6358]">{addHint(item)}</span>
              </span>
              <img src="/icons/caret.svg" alt="" className="size-3 -rotate-90" />
            </Link>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <LineButton href="/integrations">Back to integrations</LineButton>
        </div>
      </Panel>
    </div>
  );
}
