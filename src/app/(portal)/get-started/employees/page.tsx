"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RequiredNote, SetupActions, SetupCard, SetupPage, SupportLine, fieldClass, labelClass } from "@/components/portal/setup-ui";
import { usePortal } from "@/components/portal/store";
import { cn } from "cn";

type Row = { email: string; start: string; account: string; bank: string };

const banks = ["Access Bank", "Guaranty Trust Bank", "Zenith Bank", "United Bank for Africa"];

export default function AddEmployeesPage() {
  const portal = usePortal();
  const router = useRouter();
  const [mode, setMode] = useState<"individual" | "sheet">("individual");
  const [rows, setRows] = useState<Row[]>([{ email: "", start: "", account: "1023456789", bank: "" }]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileError, setFileError] = useState("");
  const [openBank, setOpenBank] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function update(index: number, key: keyof Row, value: string) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  }

  function send() {
    const next = rows.map((row) => (!row.email.includes("@") || !row.start.trim() ? "Enter each email and start date." : ""));
    setErrors(next);
    if (next.some(Boolean)) return;
    rows.forEach((row) => {
      const name = row.email.split("@")[0];
      portal.inviteEmployee({ name, email: row.email.trim(), role: "Member" });
    });
    portal.markEmployeesAdded();
    router.push("/get-started");
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/\.(csv|xlsx)$/i.test(file.name)) {
      setFileError("Use an Excel (.xlsx) or CSV file. No invitations have been sent.");
      return;
    }
    setFileError("");
    portal.markEmployeesAdded();
    router.push("/get-started");
  }

  return (
    <SetupPage title="Add Employee" subtitle="Invite an employee individually or upload a list.">
      <SetupCard className="max-w-[760px]">
        <RequiredNote />
        <div className="mt-6 flex w-[374px] max-w-full gap-1 rounded-lg border border-[#dce4de] p-1">
          {(["individual", "sheet"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={cn("h-11 flex-1 rounded px-3 text-[13px]", mode === item ? "bg-[#0f2a1f] font-medium text-[#f7f8fa]" : "font-normal text-[#0f2a1f]")}
            >
              {item === "individual" ? "Add Individually" : "Upload a Spreadsheet"}
            </button>
          ))}
        </div>
        {mode === "individual" ? (
          <div className="mt-6 space-y-6">
            {rows.map((row, index) => (
              <div key={index}>
                <p className="text-sm font-semibold text-[#0f2a1f]">Employee {index + 1}</p>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Invitation email *</span>
                    <input className={`${fieldClass} placeholder:text-[#526459]`} placeholder="Enter invitation email" value={row.email} onChange={(event) => update(index, "email", event.target.value)} />
                    <span className="mt-2 block text-xs leading-normal text-[#526459]">This is where this employee will receive their workspace invitation.</span>
                  </label>
                  <label>
                    <span className={labelClass}>Employment start date *</span>
                    <input className={fieldClass} placeholder="DD/MM/YYYY" value={row.start} onChange={(event) => update(index, "start", event.target.value)} />
                    <span className="mt-2 block text-xs leading-normal text-[#526459]">The start date is used to check the minimum employment duration in your access policy.</span>
                  </label>
                  <label>
                    <span className={labelClass}>Account Number</span>
                    <input className={fieldClass} value={row.account} onChange={(event) => update(index, "account", event.target.value)} />
                    {row.account === "1023456789" ? (
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#526459]">
                        <img src="/icons/setup/tick.svg" alt="" className="size-3.5" />
                        Hamzah Ridwanullah Opemipo
                      </span>
                    ) : null}
                  </label>
                  <div className="relative">
                    <span className={labelClass}>Bank Name</span>
                    <button type="button" className={`${fieldClass} flex items-center justify-between text-left`} aria-expanded={openBank === index} onClick={() => setOpenBank(openBank === index ? null : index)}>
                      <span>{row.bank || "Select a Bank"}</span>
                      <img src="/icons/setup/caret.svg" alt="" className="size-4" />
                    </button>
                    {openBank === index ? (
                      <ul className="absolute z-10 mt-1 w-full rounded-lg border border-[#dce4de] bg-white p-1 shadow-lg">
                        {banks.map((bank) => (
                          <li key={bank}>
                            <button type="button" className="w-full rounded-md px-2.5 py-2 text-left text-sm hover:bg-[#f4f5ef]" onClick={() => { update(index, "bank", bank); setOpenBank(null); }}>
                              {bank}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
                {errors[index] ? <p className="mt-2 text-sm text-[#b42318]">{errors[index]}</p> : null}
                <div className="mt-5 border-b border-[#dce4de]" />
              </div>
            ))}
            <button type="button" className="inline-flex h-10 w-[180px] items-center justify-center gap-2.5 rounded-lg border border-dashed border-[#dce4de] bg-[#f8f8f8] text-xs font-bold text-[#0f2a1f]" onClick={() => setRows((current) => [...current, { email: "", start: "", account: "", bank: "" }])}>
              <img src="/icons/setup/plus.svg" alt="" className="size-5" />
              Add Another Employee
            </button>
            <SetupActions backHref="/get-started" primary="Send invitation" onPrimary={send} titleCase />
          </div>
        ) : (
          <div className="mt-6 max-w-[696px]">
            <p className="text-sm font-semibold text-[#0f2a1f]">Prepare your spreadsheet</p>
            <p className="mt-1.5 text-xs text-[#526459]">
              Use one row per employee. Wageet reads the columns and prepares a preview.{" "}
              <a href="/templates/employee-invitations.csv" download="employee-invitations.csv" className="font-semibold text-[#0f2a1f] underline">
                Download Excel Template Here ↗
              </a>
            </p>
            <div className="mt-3 flex h-[138px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-[#d5ddd6] text-sm font-medium text-[#0f2a1f]">
              Drop your Excel (.xlsx) or CSV file here
              <button type="button" className="mt-3 inline-flex h-10 w-[180px] items-center justify-center rounded-lg bg-[#0f2a1f] text-xs font-bold text-[#fffff4]" onClick={() => fileRef.current?.click()}>
                Choose file
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".csv,.xlsx" className="sr-only" onChange={(event) => onFile(event.target.files?.[0])} />
            {fileError ? <p className="mt-3 text-sm text-[#b42318]">{fileError}</p> : null}
          </div>
        )}
      </SetupCard>
      <SupportLine align="left" />
    </SetupPage>
  );
}
