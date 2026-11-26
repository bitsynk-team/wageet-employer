"use client";

import { useEffect, useId, useRef, useState } from "react";
import { inputClass } from "@/components/portal/ui";
import type { Employee } from "@/lib/types";

export function MemberSearch({
  employees,
  query,
  selectedId,
  error,
  onQuery,
  onSelect,
}: {
  employees: Employee[];
  query: string;
  selectedId: string;
  error?: string;
  onQuery: (value: string) => void;
  onSelect: (employee: Employee | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const needle = query.trim().toLowerCase();
  const onboarded = employees.filter((person) => person.status !== "Invited");
  const matches = onboarded.filter((person) => !needle || `${person.name} ${person.email}`.toLowerCase().includes(needle));
  const selected = onboarded.find((person) => person.id === selectedId);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <div ref={ref} className="relative text-sm">
      <span className="mb-1.5 block font-medium text-[#0f2a1f]">Work email</span>
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        className={inputClass}
        placeholder="Search by name or email"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          const next = event.target.value;
          onQuery(next);
          if (selected && next.trim().toLowerCase() !== selected.email.toLowerCase()) onSelect(null);
          setOpen(true);
        }}
      />
      {selected ? <p className="mt-1 text-xs text-[#4e6358]">{selected.name}</p> : null}
      {error ? <p className="mt-1 text-xs text-[#b42318]">{error}</p> : null}
      {open ? (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-[#dfe5df] bg-white py-1 shadow-[0_5px_16px_rgba(10,31,20,0.15)]">
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[#4e6358]">No onboarded employees match that name or email.</li>
          ) : (
            matches.map((person) => (
              <li key={person.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={person.id === selectedId}
                  className="flex w-full flex-col px-3 py-2 text-left hover:bg-[#f4f6f3]"
                  onClick={() => {
                    onSelect(person);
                    onQuery(person.email);
                    setOpen(false);
                  }}
                >
                  <span className="text-sm font-medium text-[#162e25]">{person.name}</span>
                  <span className="text-xs text-[#4e6358]">{person.email}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
