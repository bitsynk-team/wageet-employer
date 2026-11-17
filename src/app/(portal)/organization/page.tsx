import type { Metadata } from "next";
import { SectionScreen } from "@/components/section-screen";
import { getSection } from "@/lib/portal";

const section = getSection("/organization");

export const metadata: Metadata = {
  title: section.title,
};

export default function OrganizationPage() {
  return <SectionScreen section={section} />;
}
