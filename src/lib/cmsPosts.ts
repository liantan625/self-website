import type { BlogPostInput } from "../types";

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

function quoteFrontmatterValue(value: string) {
  return JSON.stringify(value);
}

export function slugifyPostValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptyPostInput(): BlogPostInput {
  return {
    slug: "",
    title: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    tags: [],
    draft: true,
    body: "# New post\n\nStart writing here.",
  };
}

export function serializePostToMarkdown(post: BlogPostInput) {
  const tags = normalizeTags(post.tags);
  const frontmatter = [
    "---",
    `title: ${quoteFrontmatterValue(post.title)}`,
    `date: ${quoteFrontmatterValue(post.date)}`,
    `excerpt: ${quoteFrontmatterValue(post.excerpt)}`,
    "tags:",
    ...tags.map((tag) => `  - ${quoteFrontmatterValue(tag)}`),
    `draft: ${post.draft ? "true" : "false"}`,
    "---",
  ].join("\n");

  return `${frontmatter}\n\n${post.body.trim()}\n`;
}

export function downloadPostMarkdown(post: BlogPostInput) {
  const slug = slugifyPostValue(post.slug || post.title) || "untitled-post";
  const blob = new Blob([serializePostToMarkdown(post)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}.md`;
  link.click();
  URL.revokeObjectURL(url);
}
