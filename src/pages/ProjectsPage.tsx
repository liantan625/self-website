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
        description="Backend, data engineering, and full-stack projects by Tan Li An."
        path="/projects"
      />

      <SectionHeader
        icon={<FolderKanban className="h-5 w-5" />}
        title="Projects"
        subtitle="Work split between backend or data engineering systems and end-to-end product builds."
      />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Backend / Data Engineering</h2>
          <p className="max-w-3xl text-base leading-7 text-text-muted">
            API, data, analytics, and systems work focused on correctness, queryability, and maintainability.
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
