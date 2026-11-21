import type { ReactNode } from "react";

export const authTitle = "text-[32px] font-extrabold leading-[1.15] tracking-[-0.4px] text-[#0f2a1f]";
export const authBody = "mt-1 text-sm leading-snug text-[#0f2a1f]";
export const authPrimary = "mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#0f2a1f] text-sm font-semibold text-white";
export const authSecondary = "mt-3 flex h-10 w-full items-center justify-center rounded-full border border-[#d7ddd6] bg-white text-sm font-medium text-[#0f2a1f]";
export const authField = "flex h-[52px] items-center gap-2 rounded-[10px] bg-[#f8f8f8] px-3";
export const authInput = "h-full min-w-0 flex-1 bg-transparent text-sm text-[#0f2a1f] outline-none placeholder:text-[#1c1c1c]";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="flex min-h-svh flex-col items-center bg-[#f4f6f3] px-4 py-8 sm:px-8">
      <img src="/icons/wordmark.svg" alt="Wageet" className="h-11 w-auto" />
      <div className="mt-8 grid w-full max-w-[1300px] overflow-hidden rounded-[26px] bg-white p-2 shadow-[0_12px_40px_rgba(15,42,31,0.06)] lg:min-h-[702px] lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-[510px]">{children}</div>
        </div>
        <PayrollPreview />
      </div>
      <p className="mt-8 text-center text-xs font-bold text-[#526459]">Privacy Policy · Terms of Use</p>
    </main>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-[#0f2a1f]" aria-hidden="true">
      <rect x="2.25" y="4.25" width="15.5" height="11.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.2 6.2 10 11.1l6.8-4.9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-[#0f2a1f]" aria-hidden="true">
      <rect x="4" y="8.5" width="12" height="8" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8.5V6.4a3 3 0 0 1 6 0v2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function EyeIcon({ off = false }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
      <path d="M2.2 10s2.8-4.6 7.8-4.6S17.8 10 17.8 10s-2.8 4.6-7.8 4.6S2.2 10 2.2 10Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {off ? <path d="M4.2 15.8 15.8 4.2" stroke="currentColor" strokeWidth="1.4" /> : null}
    </svg>
  );
}

function PayrollPreview() {
  const bars = [18, 28, 22, 34, 26, 40, 30, 36, 24, 44, 32, 48];
  return (
    <div className="relative hidden min-h-[420px] overflow-hidden rounded-[20px] bg-[#0f2a1f] lg:block">
      <img src="/brand/auth-pattern.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative flex h-full items-center p-6 xl:p-8">
        <div className="w-full rounded-[20px] bg-white p-5 text-[#162e25] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <h2 className="text-[25px] font-semibold leading-tight">Payroll overview</h2>
          <p className="mt-1 text-sm text-[#526459]">Acme Foods Ltd / Current cycle</p>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e7ebe6] pt-4">
            <div className="rounded-xl bg-[#f4f6f3] p-3">
              <p className="text-xs text-[#526459]">Confirmed earnings</p>
              <p className="mt-1 text-[28px] font-semibold leading-none tracking-[-0.4px]">₦4,820,000</p>
            </div>
            <div className="rounded-xl bg-[#f4f6f3] p-3">
              <p className="text-xs text-[#526459]">Employees</p>
              <p className="mt-1 text-[28px] font-semibold leading-none">128</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-medium">Work records</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f6ee] px-2 py-1 text-[11px] font-medium text-[#17803d]">
              <span className="size-1.5 rounded-full bg-current" />
              Confirmed
            </span>
          </div>
          <div className="mt-3 flex h-16 items-end gap-1.5">
            {bars.map((height, index) => (
              <span key={height + index} className={`flex-1 rounded-sm ${index === bars.length - 1 ? "bg-[#fa4d01]" : "bg-[#b7d7c8]"}`} style={{ height }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
