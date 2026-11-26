export const quietButton = "inline-flex h-[38px] items-center justify-center gap-2 rounded-[7px] border border-[#dfe5df] bg-white px-4 text-sm font-medium text-[#112c23]";
export const primaryButton = "inline-flex h-[38px] items-center justify-center rounded-[7px] bg-[#112c23] px-4 text-sm font-medium text-white";
export const dangerButton = "inline-flex h-[38px] items-center justify-center rounded-[7px] bg-[#a3292d] px-4 text-sm font-medium text-white";

export function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-2.5 border-t border-[#dfe5df] pt-5">{children}</div>;
}

export function MemberRow({ name }: { name: string }) {
  return (
    <div className="flex h-[61px] items-center gap-3 rounded-lg bg-[#f4f6f3] px-3.5">
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="7.5" r="3" stroke="#216746" strokeWidth="1.7" />
        <path d="M4.5 16.5c.8-2.4 3-3.8 6-3.8s5.2 1.4 6 3.8" stroke="#216746" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      <span className="text-base font-medium text-[#112c23]">{name}</span>
    </div>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 4.5h9M6 4.5V3.5h4v1M4.5 4.5l.5 8h6l.5-8" stroke="#112c23" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="#112c23" strokeWidth="1.7" />
      <path d="M3 4.5L8 8.5L13 4.5" stroke="#112c23" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
