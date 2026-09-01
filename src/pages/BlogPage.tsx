import { PenSquare } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { PostListItem } from "../components/PostListItem";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { usePublishedPosts } from "../hooks/useBlogPosts";

export default function BlogPage() {
  const { posts, loading, error } = usePublishedPosts();
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <div className="space-y-10">
      <Seo title="Blog" description="Markdown-based blog posts by Tan Li An." path="/blog" />

      <SectionHeader
        icon={<PenSquare className="h-5 w-5" />}
        title="Blog"
        subtitle="Published writing from repository markdown and the secured CMS."
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-text">Recent Posts</h2>
              <Badge>{safePosts.length} published</Badge>
            </div>
            <p className="max-w-3xl text-base leading-7 text-text-muted">
              Writing on engineering tradeoffs, backend-heavy product work, and what I am learning as I build.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          {loading ? <p className="rounded-md border border-border bg-bg-subtle px-4 py-3 text-sm text-text-muted">Loading posts…</p> : null}
          {safePosts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
