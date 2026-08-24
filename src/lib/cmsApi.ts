import type { BlogPost, BlogPostInput } from "../types";

export type CmsSession = {
  authenticated: boolean;
  username: string | null;
};

const API_BASE = import.meta.env.VITE_CMS_API_BASE ?? "/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type BlogPostResponse = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  body: string;
  source?: "cms" | "repo";
  updatedAt?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.detail === "string"
          ? data.detail
          : typeof data?.error === "string"
            ? data.error
            : "Request failed.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

function normalizePost(post: BlogPostResponse): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: Array.isArray(post.tags) ? post.tags : [],
    draft: Boolean(post.draft),
    body: post.body,
    source: "cms",
    updatedAt: post.updatedAt,
  };
}

function toPayload(post: BlogPostInput) {
  return {
    slug: post.slug,
    title: post.title.trim(),
    date: post.date,
    excerpt: post.excerpt.trim(),
    tags: post.tags,
    draft: post.draft,
    body: post.body.trim(),
  };
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export async function fetchPublishedCmsPosts() {
  const posts = await request<BlogPostResponse[]>("/posts");
  return posts.map(normalizePost);
}

export async function fetchCmsPosts(includeDrafts = true) {
  const posts = await request<BlogPostResponse[]>(`/cms/posts?includeDrafts=${includeDrafts ? "true" : "false"}`);
  return posts.map(normalizePost);
}

export async function saveCmsPost(post: BlogPostInput, previousSlug?: string | null) {
  const path = previousSlug ? `/cms/posts/${encodeURIComponent(previousSlug)}` : "/cms/posts";
  const method = previousSlug ? "PUT" : "POST";
  const saved = await request<BlogPostResponse>(path, {
    method,
    body: JSON.stringify(toPayload(post)),
  });

  return normalizePost(saved);
}

export async function deleteCmsPost(slug: string) {
  await request<void>(`/cms/posts/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}

export async function fetchCmsSession() {
  return request<CmsSession>("/auth/session");
}

export async function loginCms(username: string, password: string) {
  return request<CmsSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logoutCms() {
  await request<void>("/auth/logout", {
    method: "POST",
  });
}
