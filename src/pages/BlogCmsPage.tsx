import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, FilePenLine, LockKeyhole, LogOut, PencilLine, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Seo } from "../components/Seo";
import { deleteCmsPost, getErrorMessage, saveCmsPost } from "../lib/cmsApi";
import { createEmptyPostInput, downloadPostMarkdown, slugifyPostValue } from "../lib/cmsPosts";
import { getRepoPosts } from "../lib/posts";
import type { BlogPost, BlogPostInput } from "../types";
import { getRepoPostCount, isRepoSlug, useCmsPosts, useCmsSession } from "../hooks/useBlogPosts";

const repoPostCount = getRepoPostCount();
const repoPosts = getRepoPosts();

function mapPostToInput(post: BlogPost): BlogPostInput {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags,
    draft: post.draft,
    body: post.body,
  };
}

export default function BlogCmsPage() {
  const { session, loading: sessionLoading, error: sessionError, login, logout } = useCmsSession();
  const { posts: cmsPosts, loading: postsLoading, error: postsError, reload } = useCmsPosts(true, session.authenticated);
  const [form, setForm] = useState<BlogPostInput>(() => createEmptyPostInput());
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionPending, setActionPending] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  useEffect(() => {
    if (originalSlug && !cmsPosts.some((post) => post.slug === originalSlug)) {
      setForm(createEmptyPostInput());
      setOriginalSlug(null);
    }
  }, [cmsPosts, originalSlug]);

  const draftCount = cmsPosts.filter((post) => post.draft).length;
  const publishedCount = cmsPosts.length - draftCount;
  const previewSlug = useMemo(() => slugifyPostValue(form.slug || form.title), [form.slug, form.title]);

  function updateField<Key extends keyof BlogPostInput>(key: Key, value: BlogPostInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function loadPost(post: BlogPost) {
    setForm(mapPostToInput(post));
    setOriginalSlug(post.slug);
    setError("");
    setNotice(`Editing "${post.title}".`);
  }

  function resetForm() {
    setForm(createEmptyPostInput());
    setOriginalSlug(null);
    setError("");
    setNotice("Started a new draft.");
  }

  function validateForm() {
    if (!form.title.trim()) {
      return "Title is required.";
    }

    if (!form.excerpt.trim()) {
      return "Excerpt is required.";
    }

    if (!form.date.trim()) {
      return "Publish date is required.";
    }

    if (!form.body.trim()) {
      return "Body content is required.";
    }

    const slug = slugifyPostValue(form.slug || form.title);
    if (!slug) {
      return "Slug must contain at least one letter or number.";
    }

    if (slug !== originalSlug && isRepoSlug(slug)) {
      return "That slug is already used by a repository-managed post.";
    }

    if (slug !== originalSlug && cmsPosts.some((post) => post.slug === slug)) {
      return "That slug is already used by another CMS post.";
    }

    return "";
  }

  async function handleLogin() {
    if (!loginUsername.trim() || !loginPassword) {
      setLoginError("Username and password are required.");
      return;
    }

    setLoginPending(true);
    try {
      await login(loginUsername.trim(), loginPassword);
      setLoginPassword("");
      setLoginError("");
      setNotice("CMS login successful.");
    } catch (nextError) {
      setLoginError(getErrorMessage(nextError));
    } finally {
      setLoginPending(false);
    }
  }

  async function handleLogout() {
    setActionPending(true);
    try {
      await logout();
      setOriginalSlug(null);
      setForm(createEmptyPostInput());
      setError("");
      setNotice("");
    } finally {
      setActionPending(false);
    }
  }

  async function handleSave() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    setActionPending(true);
    try {
      const nextPost = await saveCmsPost(
        {
          ...form,
          slug: previewSlug,
          title: form.title.trim(),
          excerpt: form.excerpt.trim(),
          date: form.date,
          body: form.body.trim(),
          tags: form.tags,
        },
        originalSlug,
      );

      setForm(mapPostToInput(nextPost));
      setOriginalSlug(nextPost.slug);
      setError("");
      setNotice(`Saved "${nextPost.title}" to the CMS database.`);
      reload();
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      setNotice("");
    } finally {
      setActionPending(false);
    }
  }

  async function handleDelete(slug: string) {
    const post = cmsPosts.find((item) => item.slug === slug);
    if (!post || !window.confirm(`Delete "${post.title}" from the CMS database?`)) {
      return;
    }

    setActionPending(true);
    try {
      await deleteCmsPost(slug);
      if (originalSlug === slug) {
        setForm(createEmptyPostInput());
        setOriginalSlug(null);
      }
      setError("");
      setNotice(`Deleted "${post.title}".`);
      reload();
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      setNotice("");
    } finally {
      setActionPending(false);
    }
  }

  function handleExport() {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setNotice("");
      return;
    }

    downloadPostMarkdown({
      ...form,
      slug: previewSlug,
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      body: form.body.trim(),
      tags: form.tags,
    });
    setError("");
    setNotice(`Exported "${form.title.trim()}" as markdown.`);
  }

  if (sessionLoading) {
    return (
      <div className="space-y-8">
        <Seo title="Blog CMS" description="Create and manage blog posts for the self website." path="/blog/cms" />
        <Card className="p-6">
          <p className="text-sm text-text-muted">Checking CMS session…</p>
        </Card>
      </div>
    );
  }

  if (!session.authenticated) {
    return (
      <div className="space-y-8">
        <Seo title="Blog CMS Login" description="Secure login for the blog CMS." path="/blog/cms" />

        <section className="space-y-4 rounded-[1.75rem] border border-border bg-white p-6 sm:p-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              <LockKeyhole className="h-3.5 w-3.5" />
              Blog CMS
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">CMS access requires login.</h1>
              <p className="max-w-2xl text-base leading-7 text-text-muted">
                This route is intentionally hidden from navigation. Sign in with your CMS account to manage Postgres-backed blog posts.
              </p>
            </div>
          </div>
        </section>

        <Card className="max-w-xl p-6">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-text">Sign in</h2>
              <p className="text-sm text-text-muted">Use the Spring Boot CMS credentials configured on the backend.</p>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Username</span>
              <input
                type="text"
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                autoComplete="username"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Password</span>
              <input
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                autoComplete="current-password"
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </label>

            {sessionError ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{sessionError}</p> : null}
            {loginError ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{loginError}</p> : null}

            <button
              type="button"
              onClick={() => void handleLogin()}
              disabled={loginPending}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LockKeyhole className="h-4 w-4" />
              {loginPending ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Seo title="Blog CMS" description="Create and manage blog posts for the self website." path="/blog/cms" />

      <section className="space-y-4 rounded-[1.75rem] border border-border bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              <FilePenLine className="h-3.5 w-3.5" />
              Blog CMS
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">Manage blog content with Spring Boot and Postgres.</h1>
              <p className="max-w-3xl text-base leading-7 text-text-muted">
                Draft posts, edit published entries, preview markdown, and export clean frontmatter files for
                `content/posts`.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{repoPostCount} repo posts</Badge>
            <Badge>{publishedCount} CMS published</Badge>
            <Badge>{draftCount} CMS drafts</Badge>
            <Badge>{session.username}</Badge>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={actionPending}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-text transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-border bg-bg-subtle px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-text">{originalSlug ? "Edit CMS Post" : "New CMS Post"}</h2>
                <p className="text-sm text-text-muted">Changes are stored in the backend database and protected by login.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={actionPending}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-text transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  New
                </button>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={actionPending}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-text transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PencilLine className="h-4 w-4" />
                  {actionPending ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={actionPending}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-accent px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  Export Markdown
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-text">Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Designing for steady systems"
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-text">Slug</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="designing-for-steady-systems"
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
                />
                <span className="block text-xs text-text-muted">Resolved slug: {previewSlug || "untitled-post"}</span>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-text">Publish Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-text">Tags</span>
                <input
                  type="text"
                  value={form.tags.join(", ")}
                  onChange={(event) =>
                    updateField(
                      "tags",
                      event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                    )
                  }
                  placeholder="architecture, backend, product"
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Excerpt</span>
              <textarea
                value={form.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                rows={3}
                placeholder="Short summary shown on the blog listing."
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="flex items-center gap-3 rounded-md border border-border bg-bg-subtle px-3 py-3 text-sm text-text">
              <input
                type="checkbox"
                checked={form.draft}
                onChange={(event) => updateField("draft", event.target.checked)}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              Keep as draft until ready to publish
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text">Markdown Body</span>
              <textarea
                value={form.body}
                onChange={(event) => updateField("body", event.target.value)}
                rows={18}
                className="cms-textarea w-full rounded-xl border border-border bg-[#fcfbf7] px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent"
              />
            </label>

            {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {notice ? <p className="rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm text-text-muted">{notice}</p> : null}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-text">Live Preview</h2>
                  <p className="text-sm text-text-muted">Draft rendering for the current editor state.</p>
                </div>
                <Link to={previewSlug ? `/blog/${previewSlug}` : "/blog"} className="text-sm text-accent hover:underline">
                  View published blog
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-[#fcfbf7] p-5">
                <div className="space-y-3 border-b border-border pb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{form.draft ? "draft" : "published"}</Badge>
                    <Badge>{previewSlug || "untitled-post"}</Badge>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-text">{form.title || "Untitled post"}</h3>
                  <p className="text-sm leading-6 text-text-muted">
                    {form.excerpt || "Write a short excerpt to explain what this post covers."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.length ? form.tags.map((tag) => <Badge key={tag}>{tag}</Badge>) : <Badge>no tags</Badge>}
                  </div>
                </div>
                <div className="article-body mt-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.body}</ReactMarkdown>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text">CMS Posts</h2>
                <p className="text-sm text-text-muted">Posts stored in Postgres through the secured CMS backend.</p>
              </div>
              {postsError ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{postsError}</p> : null}
              {postsLoading ? <p className="rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm text-text-muted">Loading CMS posts…</p> : null}
              <div className="space-y-3">
                {cmsPosts.length ? (
                  cmsPosts.map((post) => (
                    <div key={post.slug} className="rounded-xl border border-border p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-text">{post.title}</h3>
                            <Badge>{post.draft ? "draft" : "published"}</Badge>
                          </div>
                          <p className="text-sm text-text-muted">{post.slug}</p>
                          <p className="text-sm leading-6 text-text-muted">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => loadPost(post)}
                            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:text-accent"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(post.slug)}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text transition-colors hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-text-muted">
                        Updated {new Date(post.updatedAt ?? post.date).toLocaleString("en-US")}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-4 text-sm text-text-muted">
                    No CMS posts yet. Start a draft, save it, and it will appear here.
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-text">Repository Posts</h2>
                <p className="text-sm text-text-muted">Existing markdown entries already shipped with the site.</p>
              </div>
              <div className="space-y-3">
                {repoPosts.map((post) => (
                  <div key={post.slug} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-text">{post.title}</h3>
                      <Badge>repo</Badge>
                    </div>
                    <p className="mt-1 text-sm text-text-muted">{post.slug}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
