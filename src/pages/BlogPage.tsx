import { PenSquare } from "lucide-react";
import { PostListItem } from "../components/PostListItem";
import { SectionHeader } from "../components/SectionHeader";
import { Seo } from "../components/Seo";
import { getAllPosts } from "../lib/posts";

const posts = getAllPosts();

export default function BlogPage() {
  return (
    <div className="space-y-10">
      <Seo title="Blog" description="Markdown-based blog posts by Tan Li An." path="/blog" />

      <SectionHeader
        icon={<PenSquare className="h-5 w-5" />}
        title="Blog"
        subtitle="Hand-authored Markdown posts committed directly to the repository."
      />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-text">Recent Posts</h2>
          <p className="max-w-3xl text-base leading-7 text-text-muted">
            Writing on engineering tradeoffs, backend-heavy product work, and what I am learning as I build.
          </p>
        </div>
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
