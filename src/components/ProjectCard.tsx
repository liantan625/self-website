import type { Project } from "../types";
import { Tag } from "./Tag";
import { Card } from "./ui/card";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="p-5">
      <div className="space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-text">{project.title}</h3>
          <p className="text-sm leading-6 text-text-muted">{project.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-accent">
          {project.links.map((link) => (
            <a key={link.href + link.label} href={link.href} target="_blank" rel="noreferrer" className="hover:underline">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
