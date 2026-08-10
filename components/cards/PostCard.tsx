import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/format";
import type { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  shadowClassName?: string;
}

export default function PostCard({
  post,
  shadowClassName = "shadow-sm",
}: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <div
        className={cn(
          "bg-card-bg border-2 border-black rounded-2xl p-3.5 flex items-center justify-between hover:translate-x-1 transition-transform cursor-pointer",
          shadowClassName,
        )}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-tight">{post.title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="px-2 py-0.5 bg-pink/20 text-pink rounded border border-pink/30 text-[10px] uppercase font-bold">
            {post.category}
          </span>
          <span className="text-foreground/50 font-mono text-[11px]">
            {formatShortDate(post.date)}
          </span>
        </div>
      </div>
    </Link>
  );
}
