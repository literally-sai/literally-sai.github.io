"use client";

import PostCard from "@/components/cards/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import FilterBar from "@/components/ui/FilterBar";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import { useFeed } from "@/hooks/useFeed";
import type { Post } from "@/lib/types";

interface PostFeedProps {
  posts: Post[];
  filterable?: boolean;
  pageSize?: number;
  step?: number;
  cardShadowClassName?: string;
}

export default function PostFeed({
  posts,
  filterable = false,
  pageSize,
  step = 2,
  cardShadowClassName,
}: PostFeedProps) {
  const {
    filters,
    activeFilter,
    changeFilter,
    visible,
    canLoadMore,
    loadMore,
    isEmpty,
  } = useFeed(posts, { pageSize, step });

  return (
    <div className="w-full">
      {filterable && (
        <FilterBar
          filters={filters}
          active={activeFilter}
          onChange={changeFilter}
        />
      )}
      <div className="flex flex-col gap-2.5 w-full">
        {visible.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            shadowClassName={cardShadowClassName}
          />
        ))}
        {isEmpty && (
          <EmptyState message="No posts found under this category." />
        )}
      </div>
      {canLoadMore && (
        <LoadMoreButton onClick={loadMore} className="mt-4">
          ↓ Load More Articles
        </LoadMoreButton>
      )}
    </div>
  );
}
