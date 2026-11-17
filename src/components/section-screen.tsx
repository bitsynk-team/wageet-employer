import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import type { PortalSection } from "@/lib/portal";

export function SectionScreen({ section }: { section: PortalSection }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <PageHeader kicker={section.kicker} title={section.title} description={section.detail} />
      <Card>
        <CardHeader>
          <CardTitle>What this screen covers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.points.map((point) => (
              <li key={point} className="rounded-xl bg-canvas px-4 py-3 text-sm text-forest">
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
