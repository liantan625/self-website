import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import { Tag } from "./Tag";
import { Card } from "./ui/card";

type PostListItemProps = {
  post: BlogPost;
};

export function PostListItem({ post }: PostListItemProps) {
  return (
    <Card className="p-5">
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="text-sm text-text-muted">{new Date(post.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</div>
          <Link to={`/blog/${post.slug}`} className="text-lg font-semibold text-text hover:text-accent">
            {post.title}
          </Link>
          <p className="text-sm leading-6 text-text-muted">{post.excerpt}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </Card>
  );
}
