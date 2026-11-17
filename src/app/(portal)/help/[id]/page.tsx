"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { BackLink, RequestStatus } from "@/components/portal/help-centre";
import { inputClass } from "@/components/portal/ui";
import { usePortal } from "@/components/portal/store";
import { cn } from "cn";

function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const portal = usePortal();
  const request = portal.requests.find((item) => item.id === id);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [banner, setBanner] = useState(params.get("sent") === "1" ? "Request sent. You can follow up here." : "");

  if (!request) {
    return (
      <div className="px-6 py-6 text-sm text-[#162e25]">
        That request was not found. <Link href="/help/requests" className="font-medium text-[#153a2b]">Back to requests</Link>
      </div>
    );
  }

  const resolved = request.status === "Resolved";

  return (
    <div className="px-4 py-5 sm:px-6">
      <BackLink href="/help/requests" label="Back to requests" />
      {banner ? (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#e7f6ee] px-4 py-3 text-sm text-[#17803d]">
          <img src="/icons/help/check.svg" alt="" className="size-4" />
          {banner}
        </p>
      ) : null}
      <div className="mt-4 flex items-center gap-2 text-sm text-[#526459]">
        <span>{request.id}</span>
        <RequestStatus value={request.status} />
      </div>
      <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.4px] text-[#162e25]">{request.subject}</h1>
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-3">
          {request.messages.map((message, index) => {
            const last = index === request.messages.length - 1;
            const showReopen = resolved && last && message.tone === "support";
            return (
              <article key={`${message.at}-${index}`} className={cn("rounded-2xl p-4", message.tone === "user" ? "border border-[#e4e4e7] bg-white" : "bg-[#f4f5ef]")}>
                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#162e25]">
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[#e7f3ee]">
                      <img src="/icons/help/chat.svg" alt="" className="size-4" />
                    </span>
                    {message.author}
                  </p>
                  <time className="text-xs text-[#666e6d]">{message.at}</time>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#3f3f46]">{message.body}</p>
                {showReopen ? (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-[#162e25]">Still need help with this issue?</p>
                    <button
                      type="button"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white"
                      onClick={() => {
                        portal.reopenRequest(request.id);
                        setBanner("Request reopened. You can continue the conversation below.");
                        setReplying(false);
                      }}
                    >
                      <img src="/icons/help/reply-white.svg" alt="" className="size-4" />
                      Reopen request
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
          {resolved ? null : replying ? (
            <form
              className="rounded-2xl bg-[#f4f5ef] p-4"
              onSubmit={(event) => {
                event.preventDefault();
                const message = portal.addReply(request.id, reply);
                if (message) {
                  setError(message);
                  return;
                }
                setReply("");
                setError("");
                setReplying(false);
                setBanner("Your reply has been added to this request.");
              }}
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-medium text-[#162e25]">Your reply</p>
                <p className="text-[#666e6d]">Replying as <span className="font-medium text-[#162e25]">{portal.profile.name}</span></p>
              </div>
              <textarea
                className={cn(inputClass, "mt-3 h-24 bg-white py-2", error && "border-[#d92d20]")}
                placeholder="Add a detail or update for the support team."
                value={reply}
                onChange={(event) => setReply(event.target.value)}
              />
              {error ? <p className="mt-1 text-xs text-[#d92d20]">{error}</p> : null}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-lg border border-[#dfe5dd] bg-white px-4 text-sm font-medium text-[#162e25]"
                  onClick={() => {
                    setReplying(false);
                    setError("");
                    setReply("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0f2a1f] px-4 text-sm font-medium text-white">
                  <img src="/icons/help/arrow-white.svg" alt="" className="size-4" />
                  Send reply
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe5dd] px-3 text-sm font-medium text-[#1a6849]" onClick={() => setReplying(true)}>
              <img src="/icons/help/reply.svg" alt="" className="size-4" />
              Add a reply
            </button>
          )}
        </div>
        <aside className="h-fit rounded-2xl bg-[#f4f5ef] p-4">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#e7f3ee]">
            <img src="/icons/help/file.svg" alt="" className="size-4" />
          </span>
          <h2 className="mt-3 text-base font-semibold text-[#162e25]">Request information</h2>
          <div className="mt-3 border-t border-[#e4ebe4] pt-3">
            <p className="text-xs text-[#666e6d]">Topic</p>
            <p className="text-sm font-medium text-[#162e25]">{request.topic}</p>
          </div>
          <div className="mt-3 border-t border-[#e4ebe4] pt-3">
            <p className="text-xs text-[#666e6d]">Workspace</p>
            <p className="text-sm font-medium text-[#162e25]">{portal.workspaceName}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  return (
    <Suspense fallback={<div className="px-6 py-6 text-sm text-[#526459]">Loading request…</div>}>
      <RequestDetail />
    </Suspense>
  );
}
