"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePostFeed({ posts }: { posts: any[] }) {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {posts.slice(0, visibleCount).map((post: any) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <div className="bg-card-bg border-2 border-black rounded-2xl p-3.5 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-x-1 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm tracking-tight">
                  {post.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="px-2 py-0.5 bg-pink/20 text-pink rounded border border-pink/30 text-[10px] uppercase font-bold">
                  {post.category || post.tag || "Misc"}
                </span>
                <span className="text-foreground/50 font-mono text-[11px]">
                  {post.date
                    ? new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {visibleCount < posts.length && (
        <button
          onClick={handleLoadMore}
          className="w-full mt-4 bg-white dark:bg-zinc-800 text-foreground border-2 border-black font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#a0c4ff] hover:text-black active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
        >
          ↓ Load More Articles
        </button>
      )}
    </>
  );
}
