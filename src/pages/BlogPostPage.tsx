import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Tag } from "../components/Tag";
import { usePublishedPost } from "../hooks/useBlogPosts";

export default function BlogPostPage() {
  const { slug = "" } = useParams();
  const { post, loading, error } = usePublishedPost(slug);
  const tags = Array.isArray(post?.tags) ? post.tags : [];

  if (loading && !post) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-white p-6">
        <Seo title="Loading Post" description="Loading blog entry." path={`/blog/${slug}`} />
        <p className="text-sm text-text-muted">Loading post…</p>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="space-y-4 rounded-xl border border-red-200 bg-white p-6">
        <Seo title="Blog Unavailable" description="Blog post could not be loaded." path={`/blog/${slug}`} />
        <h1 className="text-2xl font-semibold text-text">Blog unavailable</h1>
        <p className="text-sm text-red-700">{error}</p>
        <Link to="/blog" className="text-sm text-accent hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-white p-6">
        <Seo title="Post Not Found" description="Requested blog post could not be found." path={`/blog/${slug}`} />
        <h1 className="text-2xl font-semibold text-text">Post not found</h1>
        <p className="text-sm text-text-muted">The requested entry does not exist.</p>
        <Link to="/blog" className="text-sm text-accent hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-6 rounded-2xl border border-border bg-white p-6 sm:p-8">
      <Seo title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />

      <header className="space-y-4 border-b border-border pb-6">
        <Link to="/blog" className="text-sm text-accent hover:underline">
          Back to blog
        </Link>
        <div className="space-y-3">
          <div className="text-sm text-text-muted">{new Date(post.date).toLocaleDateString("en-US", { dateStyle: "long" })}</div>
          <h1 className="text-3xl font-semibold tracking-tight text-text">{post.title}</h1>
          <p className="text-base leading-7 text-text-muted">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      </header>

      <div className="article-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>
    </article>
  );
}
