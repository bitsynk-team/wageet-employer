import type { Metadata } from "next";
import { SectionScreen } from "@/components/section-screen";
import { getSection } from "@/lib/portal";

const section = getSection("/payroll");

export const metadata: Metadata = {
  title: section.title,
};

export default function PayrollPage() {
  return <SectionScreen section={section} />;
}
