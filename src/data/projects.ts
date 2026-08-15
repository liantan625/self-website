import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "RBAC Admin Panel + Query Controls",
    category: "backend",
    summary:
      "Built role-aware admin flows around Druid SQL parsing and ClickHouse-backed analytics to control access and query behavior.",
    tags: ["Java", "Spring Boot", "ClickHouse", "RBAC"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
  {
    title: "Kafka Pipeline Work",
    category: "backend",
    summary:
      "Implemented event-driven ingestion and processing flows for internal data movement, with a focus on reliability and observability.",
    tags: ["Kafka", "Data Pipelines", "Observability"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
  {
    title: "LegalBot RAG Backend",
    category: "backend",
    summary:
      "Worked on retrieval and backend orchestration for a legal assistant workflow, connecting document search with answer generation.",
    tags: ["Python", "RAG", "APIs"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
  {
    title: "Baseball Stats API",
    category: "backend",
    summary:
      "Designed a Spring Boot API for baseball statistics, handling structured domain models and queryable player or game summaries.",
    tags: ["Java", "Spring Boot", "REST"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
  {
    title: "React TypeScript WebView Work",
    category: "fullstack",
    summary:
      "Built product-facing UI flows inside a WebView environment, focusing on predictable state handling and practical UX constraints.",
    tags: ["React", "TypeScript", "WebView"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
  {
    title: "Lifting Log App",
    category: "fullstack",
    summary:
      "Created a workout logging app with fast data entry, session tracking, and a clean mobile-first interface.",
    tags: ["React", "TypeScript", "Full-Stack"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
  {
    title: "Baseball Play Whiteboard",
    category: "fullstack",
    summary:
      "Built an interactive whiteboard for drawing and sharing baseball plays, emphasizing direct manipulation and low-friction editing.",
    tags: ["React", "Canvas", "UX"],
    links: [{ label: "GitHub", href: "https://github.com/" }],
  },
];
