import type { BlogPost } from "../types";

const modules = import.meta.glob("/content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function sortPosts(posts: BlogPost[]) {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function parseValue(value: string) {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---\n")) {
    return { data: {}, content: raw };
  }

  const endIndex = raw.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {}, content: raw };
  }

  const frontmatter = raw.slice(4, endIndex);
  const content = raw.slice(endIndex + 5).trimStart();
  const data: Record<string, string | boolean | string[]> = {};
  let currentKey: string | null = null;

  for (const line of frontmatter.split("\n")) {
    if (line.startsWith("  - ") && currentKey) {
      const currentValue = data[currentKey];
      const nextValue = parseValue(line.slice(4));
      if (Array.isArray(currentValue)) {
        currentValue.push(String(nextValue));
      } else {
        data[currentKey] = [String(nextValue)];
      }
      continue;
    }

    const separator = line.indexOf(":");
    if (separator === -1) {
      currentKey = null;
      continue;
    }

    currentKey = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1);
    data[currentKey] = rawValue.trim() ? parseValue(rawValue) : [];
  }

  return { data, content };
}

export function getRepoPosts() {
  const posts = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const filename = path.split("/").pop() ?? "";
    const slug = filename.replace(/\.md$/, "");

    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      excerpt: String(data.excerpt ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: Boolean(data.draft),
      body: content,
      source: "repo",
    } satisfies BlogPost;
  });

  return sortPosts(posts.filter((post) => !post.draft));
}

export function getRepoPostBySlug(slug: string) {
  return getRepoPosts().find((post) => post.slug === slug);
}

export const getAllPosts = getRepoPosts;
export const getPostBySlug = getRepoPostBySlug;
