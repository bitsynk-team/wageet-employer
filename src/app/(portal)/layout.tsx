import { Suspense } from "react";
import { Shell } from "@/components/portal/shell";
import { PortalProvider } from "@/components/portal/store";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <Suspense fallback={<div className="min-h-svh bg-[#f8f8f8]" />}>
        <Shell>{children}</Shell>
      </Suspense>
    </PortalProvider>
  );
}
