import type { Metadata } from "next";
import { SectionScreen } from "@/components/section-screen";
import { getSection } from "@/lib/portal";

const section = getSection("/policy");

export const metadata: Metadata = {
  title: section.title,
};

export default function PolicyPage() {
  return <SectionScreen section={section} />;
}
