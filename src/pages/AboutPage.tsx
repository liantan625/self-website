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
        subtitle="Final-year CS (Information Systems) student at Universiti Malaya, currently interning at Infinity Data Tech."
      />

      <Card className="space-y-8 p-6 sm:p-8">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Background</h2>
          <div className="space-y-4 text-base leading-8 text-text-muted">
            <p>
              I’m interested in backend engineering and data systems: the parts of a product that need to stay correct,
              observable, and easy to extend without turning into a maintenance problem.
            </p>
            <p>
              Recent work has ranged from admin tooling and analytics pipelines to product-facing React interfaces. I like
              projects where I can connect application behavior to the underlying data model and system constraints.
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
