"use client";

import { useMemo, useState } from "react";
import { ALL_FILTER, buildFilters, matchesFilter } from "@/lib/categories";

interface UseFeedOptions {
  pageSize?: number;
  step?: number;
}

export function useFeed<T extends { category: string }>(
  items: T[],
  { pageSize, step = 2 }: UseFeedOptions = {},
) {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [visibleCount, setVisibleCount] = useState(pageSize ?? items.length);

  const filters = useMemo(() => buildFilters(items), [items]);

  const filtered = useMemo(
    () => items.filter((item) => matchesFilter(item, activeFilter)),
    [items, activeFilter],
  );

  const paginated =
    pageSize === undefined ? filtered : filtered.slice(0, visibleCount);

  return {
    filters,
    activeFilter,

    changeFilter(filter: string) {
      setActiveFilter(filter);
      setVisibleCount(pageSize ?? items.length);
    },
    visible: paginated,
    canLoadMore: pageSize !== undefined && visibleCount < filtered.length,
    loadMore: () => setVisibleCount((count) => count + step),
    isEmpty: filtered.length === 0,
  };
}
