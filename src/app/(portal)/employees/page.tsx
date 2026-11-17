import type { Metadata } from "next";
import { SectionScreen } from "@/components/section-screen";
import { getSection } from "@/lib/portal";

const section = getSection("/employees");

export const metadata: Metadata = {
  title: section.title,
};

export default function EmployeesPage() {
  return <SectionScreen section={section} />;
}
