import { FolderKanban } from "lucide-react";
import { ProjectCard } from "../components/ProjectCard";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { projects } from "../data/projects";

const backendProjects = projects.filter((project) => project.category === "backend");
const fullstackProjects = projects.filter((project) => project.category === "fullstack");

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
        subtitle="Work across reliability-minded backend systems, automation, data pipelines, and end-to-end product builds."
      />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text">DevOps / Backend / Data Systems</h2>
          <p className="max-w-3xl text-base leading-7 text-text-muted">
            Systems work focused on reliability, automation, observability, correctness, and maintainability.
          </p>
        </div>
        <div className="grid gap-4">
          {backendProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Full-Stack / Frontend</h2>
          <p className="max-w-3xl text-base leading-7 text-text-muted">
            Product-facing work where interface design, state handling, and implementation details need to line up.
          </p>
        </div>
        <div className="grid gap-4">
          {fullstackProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
