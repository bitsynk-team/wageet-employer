import type { Metadata } from "next";
import { SectionScreen } from "@/components/section-screen";
import { getSection } from "@/lib/portal";

const section = getSection("/records");

export const metadata: Metadata = {
  title: section.title,
};

export default function RecordsPage() {
  return <SectionScreen section={section} />;
}
