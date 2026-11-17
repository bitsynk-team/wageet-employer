import type { Metadata } from "next";
import { SectionScreen } from "@/components/section-screen";
import { getSection } from "@/lib/portal";

const section = getSection("/funding");

export const metadata: Metadata = {
  title: section.title,
};

export default function FundingPage() {
  return <SectionScreen section={section} />;
}
