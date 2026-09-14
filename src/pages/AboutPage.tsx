import { UserRound } from "lucide-react";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { Card } from "../components/ui/card";
import { profile } from "../data/profile";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <Seo
        title="About"
        description="Background, current work, and career direction for Tan Li An."
        path="/about"
      />

      <SectionHeader
        icon={<UserRound className="h-5 w-5" />}
        title="About"
        subtitle="DevOps Engineer / Site Reliability Engineer at Tencent, pivoting deeper into reliability, automation, and infrastructure."
      />

      <Card className="space-y-8 p-6 sm:p-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Background</h2>
          <div className="space-y-4 text-base leading-8 text-text-muted">
            <p>
              I’m currently working at Tencent as a DevOps Engineer / Site Reliability Engineer. My focus is shifting
              toward production reliability: deployment automation, observability, incident readiness, and the systems
              work that keeps services dependable under real operating conditions.
            </p>
            <p>
              My earlier work across backend systems, analytics pipelines, and product-facing React interfaces still
              matters to how I approach operations. I like projects where application behavior, infrastructure, and
              day-to-day maintainability all line up.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Links</h2>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:underline">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
              LinkedIn
            </a>
            <a href={profile.resume} className="hover:underline">
              Resume PDF
            </a>
          </div>
        </section>
      </Card>
    </div>
  );
}
