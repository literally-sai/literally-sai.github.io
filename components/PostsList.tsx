"use client";

import { useState } from "react";
import Link from "next/link";

export default function PostsList({ initialPosts }: { initialPosts: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Systems Programming", "GameDev", "WebDev", "Misc"];

  const filteredPosts =
    activeFilter === "All"
      ? initialPosts
      : initialPosts.filter((post) => {
          const category = post.category || post.tag || "Misc";
          return category.toLowerCase() === activeFilter.toLowerCase();
        });

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-8 flex-wrap border-b border-black/5 dark:border-white/5 pb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider font-mono border rounded-lg transition-all hover:scale-105 active:scale-95 ${
              activeFilter === filter
                ? "bg-blue/20 text-blue border-blue/30 dark:border-blue/50"
                : "bg-card-bg/40 text-foreground/60 border-black/10 dark:border-white/10 hover:text-foreground hover:border-black/20 dark:hover:border-white/20"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        {filteredPosts.map((post: any) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <div className="bg-card-bg border-2 border-black rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm tracking-tight">
                  {post.title}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="px-2 py-0.5 bg-pink/20 text-pink rounded border border-pink/30 text-[10px] uppercase font-bold">
                  {post.category || post.tag || "Misc"}
                </span>
                <span
                  suppressHydrationWarning
                  className="text-foreground/50 font-mono text-[11px]"
                >
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 font-mono text-xs text-foreground/40 border-2 border-dashed border-black/10 rounded-2xl">
            No posts found under this category.
          </div>
        )}
      </div>
    </div>
  );
}
