export type Project = {
  title: string;
  category: "backend" | "fullstack";
  summary: string;
  tags: string[];
  links: Array<{
    label: string;
    href: string;
  }>;
};

export type BlogPostSource = "repo" | "cms";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  body: string;
  source: BlogPostSource;
  updatedAt?: string;
};

export type BlogPostInput = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  body: string;
};
