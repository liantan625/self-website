import { FolderKanban } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { Card } from "../components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <Seo
        title="Projects"
        description="DevOps, reliability, backend, and full-stack projects by Tan Li An."
        path="/projects"
      />

      <SectionHeader
        icon={<FolderKanban className="h-5 w-5" />}
        title="Projects"
        subtitle="A refreshed project list is coming soon."
      />

      <Card className="p-6 sm:p-8">
        <p className="max-w-3xl text-base leading-8 text-text-muted">
          I’m revisiting this section to better reflect my current DevOps and SRE direction. I’ll update it with recent
          infrastructure, reliability, automation, and systems work soon.
        </p>
      </Card>
    </div>
  );
}
